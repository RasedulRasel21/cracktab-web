import { loadEnvFile } from "node:process";
import { defineConfig, env } from "prisma/config";

// Prisma 7 does not read .env on its own once a config file is present, and the
// CLI runs outside Next's env loading. Node's built-in loader covers it without
// pulling in dotenv; in CI the variables are already exported, hence the catch.
try {
  loadEnvFile(".env");
} catch {
  // no .env on disk — expected on Vercel and in CI
}

/**
 * Prisma 7 reads migration/introspection settings from here rather than from
 * `datasource` blocks in the schema.
 *
 * The URL below is deliberately the *direct* one. PgBouncer fronts this
 * database in transaction mode on 6432, which hands each transaction whatever
 * backend connection happens to be free — Migrate needs a session-level
 * connection that stays put, so it talks to Postgres on 5432 instead.
 * Application queries take the opposite route; see app/lib/db.ts.
 */
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: env("DIRECT_URL"),
    // `migrate dev` builds a throwaway copy of the schema to detect drift, and
    // creates a database to do it in. The cracktab_web role deliberately has
    // no CREATEDB on a box with five production databases, so it points at a
    // pre-made empty one instead. Optional: without it, `migrate dev` fails
    // with P3014 and the workflow is `migrate diff` + `migrate deploy`.
    ...(process.env.SHADOW_DATABASE_URL
      ? { shadowDatabaseUrl: process.env.SHADOW_DATABASE_URL }
      : {}),
  },
  migrations: {
    path: "prisma/migrations",
    seed: "npx tsx prisma/seed.ts",
  },
});
