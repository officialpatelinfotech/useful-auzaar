import { MongoClient } from "mongodb";

let cached = globalThis.__usefulauzaarMongo;
if (!cached) {
  cached = globalThis.__usefulauzaarMongo = { client: null, promise: null };
}

export async function getMongoClient() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("Missing MONGODB_URI env var");
  }
  if (cached.client) return cached.client;
  if (!cached.promise) {
    const client = new MongoClient(uri);
    cached.promise = client.connect().then(() => client);
  }
  cached.client = await cached.promise;
  return cached.client;
}

export function getDbName() {
  return process.env.MONGODB_DB || "usefulauzaar";
}

export function getCollectionName() {
  return process.env.MONGODB_COLLECTION || "short_links";
}
