import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";
dotenv.config();

const uri = process.env.MONGO_URI!;
const dbName = process.env.MONGO_DB || "lastman";

export const client = new MongoClient(uri);

export async function getDb() {
  if (!client.topology?.isConnected()) await client.connect();
  return client.db(dbName);
}
