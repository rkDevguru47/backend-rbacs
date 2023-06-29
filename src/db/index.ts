//pg is for postgresql
//drizzle-orm is for postgresql database
//env is for environment variables

import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "../config/env";

const pool = new Pool({
  connectionString: env.DATABASE_CONNECTION,
  //not true then error when we connect to our database
  ssl: true,
});

export const db = drizzle(pool);
