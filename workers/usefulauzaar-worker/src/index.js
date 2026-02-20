const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
};

// Local-only fallback (when MongoDB Data API is not configured).
// Note: This is in-memory and resets whenever the Worker restarts.
const LOCAL_LINKS = new Map();

const API_CORS_ALLOW_METHODS = "GET,POST,OPTIONS";
const API_CORS_ALLOW_HEADERS = "content-type";

function apiCorsHeaders(request) {
  const origin = request.headers.get("Origin") || "*";
  return {
    "access-control-allow-origin": origin,
    "access-control-allow-methods": API_CORS_ALLOW_METHODS,
    "access-control-allow-headers": API_CORS_ALLOW_HEADERS,
    "access-control-max-age": "86400",
    vary: "Origin",
  };
}

function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...JSON_HEADERS, ...headers },
  });
}

function jsonApi(request, data, status = 200, headers = {}) {
  return json(data, status, { ...apiCorsHeaders(request), ...headers });
}

function normalizeUrl(value) {
  const trimmed = String(value || "").trim();
  if (!trimmed) return null;
  try {
    const parsed = new URL(trimmed);
    if (!parsed.protocol.startsWith("http")) return null;
    return parsed.toString();
  } catch {
    return null;
  }
}

const BASE62 = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
function randomSlug(length = 7) {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  let out = "";
  for (let i = 0; i < bytes.length; i++) {
    out += BASE62[bytes[i] % BASE62.length];
  }
  return out;
}

async function dataApiFetch(env, action, payload) {
  if (!env.MONGO_DATA_API_BASE || !env.MONGO_DATA_API_KEY) {
    throw new Error("Missing MongoDB Data API configuration");
  }
  const url = `${env.MONGO_DATA_API_BASE}/action/${action}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      accept: "application/json",
      "api-key": env.MONGO_DATA_API_KEY,
    },
    body: JSON.stringify({
      dataSource: env.MONGO_DATA_SOURCE,
      database: env.MONGO_DB,
      collection: env.MONGO_COLLECTION,
      ...payload,
    }),
  });

  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text };
  }

  if (!res.ok) {
    const message = data?.error || data?.message || "Data API request failed";
    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

function isDataApiConfigured(env) {
  return Boolean(env.MONGO_DATA_API_BASE && env.MONGO_DATA_API_KEY);
}

function projectLocal(doc, projection) {
  if (!doc || !projection) return doc;
  // Only support the projections we use (exclude _id and include explicit fields)
  const out = {};
  for (const [key, include] of Object.entries(projection)) {
    if (key === "_id") continue;
    if (include) out[key] = doc[key];
  }
  return out;
}

async function dbInsertLink(env, document) {
  if (isDataApiConfigured(env)) {
    return dataApiFetch(env, "insertOne", { document });
  }
  if (LOCAL_LINKS.has(document.slug)) {
    const err = new Error("Duplicate slug");
    err.code = "DUPLICATE";
    throw err;
  }
  LOCAL_LINKS.set(document.slug, { ...document });
  return { insertedId: document.slug };
}

async function dbFindLink(env, slug, projection = null) {
  if (isDataApiConfigured(env)) {
    const result = await dataApiFetch(env, "findOne", {
      filter: { slug },
      ...(projection ? { projection } : {}),
    });
    return result?.document || null;
  }

  const doc = LOCAL_LINKS.get(slug) || null;
  return projectLocal(doc, projection);
}

async function dbUpdateLink(env, slug, update) {
  if (isDataApiConfigured(env)) {
    return dataApiFetch(env, "updateOne", {
      filter: { slug },
      update,
    });
  }
  const existing = LOCAL_LINKS.get(slug);
  if (!existing) return { matchedCount: 0, modifiedCount: 0 };

  const next = { ...existing };
  if (update?.$inc) {
    for (const [k, v] of Object.entries(update.$inc)) {
      const prev = Number(next[k] || 0);
      next[k] = prev + Number(v);
    }
  }
  if (update?.$set) {
    for (const [k, v] of Object.entries(update.$set)) {
      next[k] = v;
    }
  }
  LOCAL_LINKS.set(slug, next);
  return { matchedCount: 1, modifiedCount: 1 };
}

async function handleCreate(request, env) {
  const body = await request.json();
  const destination = normalizeUrl(body?.url);
  const expiresAtRaw = body?.expiresAt;

  if (!destination) {
    return jsonApi(request, { error: "Please enter a valid http(s) URL." }, 400);
  }

  let expiresAt = null;
  if (expiresAtRaw) {
    const d = new Date(expiresAtRaw);
    if (Number.isNaN(d.getTime())) {
      return jsonApi(request, { error: "Expiry must be a valid date/time." }, 400);
    }
    if (d.getTime() <= Date.now()) {
      return jsonApi(request, { error: "Expiry must be in the future." }, 400);
    }
    expiresAt = d.toISOString();
  }

  // Try a few times in case of slug collision
  let slug = null;
  for (let i = 0; i < 5; i++) {
    const candidate = randomSlug(7);
    try {
      await dbInsertLink(env, {
        slug: candidate,
        destination,
        createdAt: new Date().toISOString(),
        expiresAt,
        clicks: 0,
      });
      slug = candidate;
      break;
    } catch (err) {
      // Duplicate slug -> retry. Any other error -> return a real backend error.
      if (err?.code === "DUPLICATE") continue;
      if (err?.message === "Missing MongoDB Data API configuration") {
        // Local dev can still work via in-memory mode; but if we get here, treat as server error.
        return jsonApi(
          request,
          {
            error:
              "MongoDB Data API is not configured for this Worker. For local-only use, you can leave it unconfigured and restart the Worker; it will use in-memory storage.",
          },
          500,
        );
      }
      return jsonApi(
        request,
        {
          error:
            "Backend error while creating the short link. Check Worker logs and MongoDB Data API settings.",
        },
        500,
      );
    }
  }

  if (!slug) {
    return jsonApi(
      request,
      { error: "Could not generate a unique short link. Try again." },
      500,
    );
  }

  return jsonApi(request, {
    slug,
    shortPath: `/r/${slug}`,
    destination,
    expiresAt,
  });
}

async function handleStats(request, url, env) {
  const slug = url.searchParams.get("slug");
  if (!slug) return jsonApi(request, { error: "Missing slug." }, 400);

  const doc = await dbFindLink(env, slug, {
    _id: 0,
    slug: 1,
    destination: 1,
    clicks: 1,
    createdAt: 1,
    expiresAt: 1,
  });
  if (!doc) return jsonApi(request, { error: "Not found." }, 404);
  return jsonApi(request, doc);
}

async function handleRedirect(request, url, env) {
  const slug = url.pathname.split("/").filter(Boolean)[1];
  if (!slug) return new Response("Not found", { status: 404 });

  const doc = await dbFindLink(env, slug);
  if (!doc) return new Response("Not found", { status: 404 });

  if (doc.expiresAt && new Date(doc.expiresAt).getTime() <= Date.now()) {
    return new Response("This link has expired.", { status: 410 });
  }

  // Increment clicks (best-effort)
  dbUpdateLink(env, slug, {
    $inc: { clicks: 1 },
    $set: { lastClickedAt: new Date().toISOString() },
  }).catch(() => {});

  if (request.method === "HEAD") {
    return new Response(null, {
      status: 302,
      headers: { location: doc.destination },
    });
  }

  return Response.redirect(doc.destination, 302);
}

const worker = {
  async fetch(request, env) {
    const url = new URL(request.url);

    try {
      if (url.pathname === "/api/url-shortener") {
        if (request.method === "OPTIONS") {
          return new Response(null, {
            status: 204,
            headers: apiCorsHeaders(request),
          });
        }
        if (request.method === "POST") return await handleCreate(request, env);
        if (request.method === "GET") return await handleStats(request, url, env);
        return jsonApi(request, { error: "Method not allowed" }, 405);
      }

      if (url.pathname.startsWith("/r/")) {
        if (request.method === "GET" || request.method === "HEAD") {
          return await handleRedirect(request, url, env);
        }
        return new Response("Method not allowed", { status: 405 });
      }

      return new Response("Not found", { status: 404 });
    } catch (err) {
      if (url.pathname === "/api/url-shortener") {
        return jsonApi(
          request,
          {
            error:
              "Backend error. Check Cloudflare Worker env vars and MongoDB Data API settings.",
          },
          500,
        );
      }

      return json(
        {
          error:
            "Backend error. Check Cloudflare Worker env vars and MongoDB Data API settings.",
        },
        500,
      );
    }
  },
};

export default worker;
