var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// .wrangler/tmp/bundle-NGVWxk/strip-cf-connecting-ip-header.js
function stripCfConnectingIPHeader(input, init) {
  const request = new Request(input, init);
  request.headers.delete("CF-Connecting-IP");
  return request;
}
__name(stripCfConnectingIPHeader, "stripCfConnectingIPHeader");
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    return Reflect.apply(target, thisArg, [
      stripCfConnectingIPHeader.apply(null, argArray)
    ]);
  }
});

// src/index.js
var JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8"
};
var LOCAL_LINKS = /* @__PURE__ */ new Map();
var API_CORS_ALLOW_METHODS = "GET,POST,OPTIONS";
var API_CORS_ALLOW_HEADERS = "content-type";
function apiCorsHeaders(request) {
  const origin = request.headers.get("Origin") || "*";
  return {
    "access-control-allow-origin": origin,
    "access-control-allow-methods": API_CORS_ALLOW_METHODS,
    "access-control-allow-headers": API_CORS_ALLOW_HEADERS,
    "access-control-max-age": "86400",
    vary: "Origin"
  };
}
__name(apiCorsHeaders, "apiCorsHeaders");
function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...JSON_HEADERS, ...headers }
  });
}
__name(json, "json");
function jsonApi(request, data, status = 200, headers = {}) {
  return json(data, status, { ...apiCorsHeaders(request), ...headers });
}
__name(jsonApi, "jsonApi");
function normalizeUrl(value) {
  const trimmed = String(value || "").trim();
  if (!trimmed)
    return null;
  try {
    const parsed = new URL(trimmed);
    if (!parsed.protocol.startsWith("http"))
      return null;
    return parsed.toString();
  } catch {
    return null;
  }
}
__name(normalizeUrl, "normalizeUrl");
var BASE62 = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
function randomSlug(length = 7) {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  let out = "";
  for (let i = 0; i < bytes.length; i++) {
    out += BASE62[bytes[i] % BASE62.length];
  }
  return out;
}
__name(randomSlug, "randomSlug");
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
      "api-key": env.MONGO_DATA_API_KEY
    },
    body: JSON.stringify({
      dataSource: env.MONGO_DATA_SOURCE,
      database: env.MONGO_DB,
      collection: env.MONGO_COLLECTION,
      ...payload
    })
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
__name(dataApiFetch, "dataApiFetch");
function isDataApiConfigured(env) {
  return Boolean(env.MONGO_DATA_API_BASE && env.MONGO_DATA_API_KEY);
}
__name(isDataApiConfigured, "isDataApiConfigured");
function projectLocal(doc, projection) {
  if (!doc || !projection)
    return doc;
  const out = {};
  for (const [key, include] of Object.entries(projection)) {
    if (key === "_id")
      continue;
    if (include)
      out[key] = doc[key];
  }
  return out;
}
__name(projectLocal, "projectLocal");
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
__name(dbInsertLink, "dbInsertLink");
async function dbFindLink(env, slug, projection = null) {
  if (isDataApiConfigured(env)) {
    const result = await dataApiFetch(env, "findOne", {
      filter: { slug },
      ...projection ? { projection } : {}
    });
    return result?.document || null;
  }
  const doc = LOCAL_LINKS.get(slug) || null;
  return projectLocal(doc, projection);
}
__name(dbFindLink, "dbFindLink");
async function dbUpdateLink(env, slug, update) {
  if (isDataApiConfigured(env)) {
    return dataApiFetch(env, "updateOne", {
      filter: { slug },
      update
    });
  }
  const existing = LOCAL_LINKS.get(slug);
  if (!existing)
    return { matchedCount: 0, modifiedCount: 0 };
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
__name(dbUpdateLink, "dbUpdateLink");
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
  let slug = null;
  for (let i = 0; i < 5; i++) {
    const candidate = randomSlug(7);
    try {
      await dbInsertLink(env, {
        slug: candidate,
        destination,
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        expiresAt,
        clicks: 0
      });
      slug = candidate;
      break;
    } catch (err) {
      if (err?.code === "DUPLICATE")
        continue;
      if (err?.message === "Missing MongoDB Data API configuration") {
        return jsonApi(
          request,
          {
            error: "MongoDB Data API is not configured for this Worker. For local-only use, you can leave it unconfigured and restart the Worker; it will use in-memory storage."
          },
          500
        );
      }
      return jsonApi(
        request,
        {
          error: "Backend error while creating the short link. Check Worker logs and MongoDB Data API settings."
        },
        500
      );
    }
  }
  if (!slug) {
    return jsonApi(
      request,
      { error: "Could not generate a unique short link. Try again." },
      500
    );
  }
  return jsonApi(request, {
    slug,
    shortPath: `/r/${slug}`,
    destination,
    expiresAt
  });
}
__name(handleCreate, "handleCreate");
async function handleStats(request, url, env) {
  const slug = url.searchParams.get("slug");
  if (!slug)
    return jsonApi(request, { error: "Missing slug." }, 400);
  const doc = await dbFindLink(env, slug, {
    _id: 0,
    slug: 1,
    destination: 1,
    clicks: 1,
    createdAt: 1,
    expiresAt: 1
  });
  if (!doc)
    return jsonApi(request, { error: "Not found." }, 404);
  return jsonApi(request, doc);
}
__name(handleStats, "handleStats");
async function handleRedirect(request, url, env) {
  const slug = url.pathname.split("/").filter(Boolean)[1];
  if (!slug)
    return new Response("Not found", { status: 404 });
  const doc = await dbFindLink(env, slug);
  if (!doc)
    return new Response("Not found", { status: 404 });
  if (doc.expiresAt && new Date(doc.expiresAt).getTime() <= Date.now()) {
    return new Response("This link has expired.", { status: 410 });
  }
  dbUpdateLink(env, slug, {
    $inc: { clicks: 1 },
    $set: { lastClickedAt: (/* @__PURE__ */ new Date()).toISOString() }
  }).catch(() => {
  });
  if (request.method === "HEAD") {
    return new Response(null, {
      status: 302,
      headers: { location: doc.destination }
    });
  }
  return Response.redirect(doc.destination, 302);
}
__name(handleRedirect, "handleRedirect");
var worker = {
  async fetch(request, env) {
    const url = new URL(request.url);
    try {
      if (url.pathname === "/api/url-shortener") {
        if (request.method === "OPTIONS") {
          return new Response(null, {
            status: 204,
            headers: apiCorsHeaders(request)
          });
        }
        if (request.method === "POST")
          return await handleCreate(request, env);
        if (request.method === "GET")
          return await handleStats(request, url, env);
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
            error: "Backend error. Check Cloudflare Worker env vars and MongoDB Data API settings."
          },
          500
        );
      }
      return json(
        {
          error: "Backend error. Check Cloudflare Worker env vars and MongoDB Data API settings."
        },
        500
      );
    }
  }
};
var src_default = worker;

// node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-NGVWxk/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = src_default;

// node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-NGVWxk/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof __Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
__name(__Facade_ScheduledController__, "__Facade_ScheduledController__");
function wrapExportedHandler(worker2) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker2;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker2.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker2.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker2,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker2.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker2.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = (request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    };
    #dispatcher = (type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    };
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map
