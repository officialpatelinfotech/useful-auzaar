import { NextResponse } from "next/server";
import { getCollectionName, getDbName, getMongoClient } from "@/lib/mongodb";

export const runtime = "nodejs";

async function getCollection() {
  const client = await getMongoClient();
  const db = client.db(getDbName());
  return db.collection(getCollectionName());
}

export async function GET(_request, { params }) {
  const slug = (await Promise.resolve(params))?.slug;
  if (!slug) return new NextResponse("Not found", { status: 404 });

  const collection = await getCollection();
  const doc = await collection.findOne({ slug });
  if (!doc) return new NextResponse("Not found", { status: 404 });

  if (doc.expiresAt && new Date(doc.expiresAt).getTime() <= Date.now()) {
    return new NextResponse("This link has expired.", { status: 410 });
  }

  // Best-effort click count
  collection
    .updateOne(
      { slug },
      { $inc: { clicks: 1 }, $set: { lastClickedAt: new Date().toISOString() } },
    )
    .catch(() => {});

  return NextResponse.redirect(doc.destination, 302);
}

export async function HEAD(request, ctx) {
  return GET(request, ctx);
}
