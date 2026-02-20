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

export function OPTIONS(request) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(request) });
}

export async function GET(request) {
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
    { projection: { _id: 0, slug: 1, destination: 1, clicks: 1, createdAt: 1, expiresAt: 1 } },
  );

  if (!doc) {
    return NextResponse.json(
      { error: "Not found." },
      { status: 404, headers: corsHeaders(request) },
    );
  }

  return NextResponse.json(doc, { headers: corsHeaders(request) });
}

export async function POST(request) {
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
}
