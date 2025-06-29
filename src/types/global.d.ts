import type { MongoClient } from "mongodb";

declare global {
  // Allow global._mongoClientPromise
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}
