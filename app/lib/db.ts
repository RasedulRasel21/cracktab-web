import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

/**
 * Prisma client for cracktab_web.
 *
 * Two things about this database shape the setup:
 *
 *  1. It lives on a shared 1 GB droplet whose Postgres allows 60 connections
 *     total, across five production Shopify apps and an ops panel. The website
 *     gets a pool of ONE per instance and multiplexes through PgBouncer — a
 *     traffic spike here must not starve anything else on that box.
 *
 *  2. PgBouncer runs in transaction mode, which hands each transaction whatever
 *     backend connection is free. Named prepared statements don't survive that.
 *     node-postgres issues unnamed ones, so the driver adapter is safe here —
 *     the old `?pgbouncer=true` URL flag belonged to Prisma's Rust engine and
 *     no longer applies in v7.
 *
 * The client is a module singleton, cached on globalThis in development so
 * hot reload doesn't open a new pool on every edit.
 */
const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  pool?: Pool;
};

function createClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    // Deliberately loud. The alternative — a client that constructs fine and
    // fails on first query — turns a missing env var into a runtime mystery.
    throw new Error(
      "DATABASE_URL is not set. Copy .env.example to .env and fill in the cracktab_web credentials.",
    );
  }

  const pool =
    globalForPrisma.pool ??
    new Pool({
      connectionString,
      // One connection per instance; PgBouncer does the multiplexing.
      max: 1,
      // Serverless instances are frozen between requests, so a socket left
      // open is a connection held against that 60 ceiling for nothing.
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 10_000,
    });

  if (process.env.NODE_ENV !== "production") globalForPrisma.pool = pool;

  return new PrismaClient({ adapter: new PrismaPg(pool) });
}

export const prisma: PrismaClient = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
