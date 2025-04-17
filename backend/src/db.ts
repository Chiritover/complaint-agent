import pg from "pg";
import "dotenv/config";

export const pool = new pg.Pool({
  host: process.env.PGHOST,     // e.g. "localhost"
  port: Number(process.env.PGPORT || 5432),
  user: process.env.PGUSER,     // "postgres"
  password: process.env.PGPASSWORD, // "postgres"
  database: process.env.PGDATABASE // "complaints"
});