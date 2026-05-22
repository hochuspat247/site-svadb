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

export async function withTransaction(callback) {
  const client = await getPool().connect();

  try {
    await client.query("begin");
    const result = await callback(client);
    await client.query("commit");
    return result;
  } catch (error) {
    await client.query("rollback");
    throw error;
  } finally {
    client.release();
  }
}
