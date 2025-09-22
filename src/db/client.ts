import { drizzle } from "drizzle-orm/libsql"; // Cambiar a libsql
import { createClient } from "@libsql/client"; // Usar el cliente de libsql
import * as schema from "./schema.js";
import "dotenv/config";

const client = createClient({
  url: process.env.TURSO_DB_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export const db = drizzle(client, { schema, logger: true });