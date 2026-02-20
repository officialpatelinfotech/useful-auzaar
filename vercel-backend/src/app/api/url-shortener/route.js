import { NextResponse } from "next/server";
import { corsHeaders } from "@/lib/cors";
import { getCollectionName, getDbName, getMongoClient } from "@/lib/mongodb";

export const runtime = "nodejs";

const BASE62 = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
function randomSlug(length = 7) {
  // Node runtime on Vercel supports WebCrypto
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  let out = "";
  for (let i = 0; i < bytes.length; i++) out += BASE62[bytes[i] % BASE62.length];
  return out;
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

async function getCollection() {
  const client = await getMongoClient();
  const db = client.db(getDbName());
  const collection = db.collection(getCollectionName());
  // Best-effort unique index
  await collection.createIndex({ slug: 1 }, { unique: true }).catch(() => {});
  return collection;
}

function classifyBackendError(err) {
  const name = String(err?.name || "");
  const message = String(err?.message || "");

  if (message.includes("MONGODB_URI")) {
    return "Backend is missing MongoDB config (MONGODB_URI). Add it in Vercel env vars and redeploy.";
  }

  // Common MongoDB driver failures (keep messages actionable but non-sensitive)
  const combined = `${name} ${message}`;
  if (/authentication failed|bad auth|auth failed/i.test(combined)) {
    return "MongoDB authentication failed. Double-check username/password in MONGODB_URI (URL-encode special characters in the password).";
  }
  if (/ip.*not authorized|not authorized|ECONNREFUSED|ETIMEDOUT|server selection|MongoServerSelectionError/i.test(
    combined,
  )) {
    return "MongoDB connection failed. In MongoDB Atlas, add Network Access allowlist 0.0.0.0/0 (or allow Vercel egress IPs) and ensure the cluster is running.";
  }
  if (/ENOTFOUND|EAI_AGAIN|querySrv/i.test(combined)) {
    return "MongoDB DNS lookup failed. Verify the cluster hostname in MONGODB_URI (mongodb+srv URL) and that the cluster exists.";
  }

  return "Backend error. Check Vercel logs.";
}

export function OPTIONS(request) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(request) });
}

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const slug = url.searchParams.get("slug");
    if (!slug) {
      return NextResponse.json(
        { error: "Missing slug." },
        { status: 400, headers: corsHeaders(request) },
      );
    }

    const collection = await getCollection();
    const doc = await collection.findOne(
      { slug },
      {
        projection: {
          _id: 0,
          slug: 1,
          destination: 1,
          clicks: 1,
          createdAt: 1,
          expiresAt: 1,
        },
      },
    );

    if (!doc) {
      return NextResponse.json(
        { error: "Not found." },
        { status: 404, headers: corsHeaders(request) },
      );
    }

    return NextResponse.json(doc, { headers: corsHeaders(request) });
  } catch (err) {
    return NextResponse.json(
      {
        error: classifyBackendError(err),
      },
      { status: 500, headers: corsHeaders(request) },
    );
  }
}

export async function POST(request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON." },
        { status: 400, headers: corsHeaders(request) },
      );
    }

    const destination = normalizeUrl(body?.url);
    const expiresAtRaw = body?.expiresAt;

    if (!destination) {
      return NextResponse.json(
        { error: "Please enter a valid http(s) URL." },
        { status: 400, headers: corsHeaders(request) },
      );
    }

    let expiresAt = null;
    if (expiresAtRaw) {
      const d = new Date(expiresAtRaw);
      if (Number.isNaN(d.getTime())) {
        return NextResponse.json(
          { error: "Expiry must be a valid date/time." },
          { status: 400, headers: corsHeaders(request) },
        );
      }
      if (d.getTime() <= Date.now()) {
        return NextResponse.json(
          { error: "Expiry must be in the future." },
          { status: 400, headers: corsHeaders(request) },
        );
      }
      expiresAt = d.toISOString();
    }

    const collection = await getCollection();

    let slug = null;
    for (let i = 0; i < 5; i++) {
      const candidate = randomSlug(7);
      try {
        await collection.insertOne({
          slug: candidate,
          destination,
          createdAt: new Date().toISOString(),
          expiresAt,
          clicks: 0,
        });
        slug = candidate;
        break;
      } catch {
        // duplicate slug -> retry
      }
    }

    if (!slug) {
      return NextResponse.json(
        { error: "Could not generate a unique short link. Try again." },
        { status: 500, headers: corsHeaders(request) },
      );
    }

    return NextResponse.json(
      { slug, shortPath: `/r/${slug}`, destination, expiresAt },
      { headers: corsHeaders(request) },
    );
  } catch (err) {
    return NextResponse.json(
      {
        error: classifyBackendError(err),
      },
      { status: 500, headers: corsHeaders(request) },
    );
  }
}
