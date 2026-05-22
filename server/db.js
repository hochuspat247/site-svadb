import pg from "pg";

const { Pool } = pg;

let pool;

export function getPool() {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
      throw new Error("DATABASE_URL is not set");
    }

    const shouldUseSsl =
      process.env.DATABASE_SSL === "true" ||
      connectionString.includes("supabase.com");

    pool = new Pool({
      connectionString,
      ssl: shouldUseSsl ? { rejectUnauthorized: false } : false,
    });
  }

  return pool;
}

export async function query(text, params) {
  return getPool().query(text, params);
}
