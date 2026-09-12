import { loadEnvFile } from "node:process";
import { randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { blogPosts } from "../app/lib/site";
import { readingMinutes, slugify } from "../app/lib/text";

try {
  loadEnvFile(".env");
} catch {
  // already exported in CI
}

// Seeding is a one-off script, not a serverless function — it may use the
// direct connection and a normal pool.
const pool = new Pool({ connectionString: process.env.DIRECT_URL, max: 2 });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

async function main() {
  // ---- the first account -------------------------------------------------
  const email = process.env.SEED_ADMIN_EMAIL ?? "hello@cracktab.com";
  const name = process.env.SEED_ADMIN_NAME ?? "Cracktab";
  // A generated password is printed once. Better than committing a default
  // like "admin123" that outlives the seed and quietly becomes production.
  const password = process.env.SEED_ADMIN_PASSWORD ?? randomBytes(12).toString("base64url");

  const admin = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name,
      role: "ADMIN",
      passwordHash: await bcrypt.hash(password, 12),
    },
  });

  if (!process.env.SEED_ADMIN_PASSWORD) {
    console.log("\n  Admin account created");
    console.log(`  email:    ${email}`);
    console.log(`  password: ${password}`);
    console.log("  Save this now — it is not stored anywhere and not shown again.\n");
  }

  // ---- categories --------------------------------------------------------
  //
  // Seeded as a two-level tree so the nesting is exercised from day one and
  // there is a working example to copy. Everything here is editable in
  // /admin/categories — nothing about the shape is fixed in code.
  const TREE: { name: string; children?: string[] }[] = [
    { name: "Shopify", children: ["Migration", "Performance", "Apps"] },
    { name: "Growth", children: ["SEO", "CRO"] },
    { name: "Design", children: [] },
    { name: "Studio notes", children: [] },
  ];

  const categories = new Map<string, string>();

  for (const parent of TREE) {
    const created = await prisma.category.upsert({
      where: { slug: slugify(parent.name) },
      update: {},
      create: { name: parent.name, slug: slugify(parent.name) },
    });
    categories.set(parent.name, created.id);

    for (const childName of parent.children ?? []) {
      const child = await prisma.category.upsert({
        where: { slug: slugify(childName) },
        update: {},
        create: {
          name: childName,
          slug: slugify(childName),
          parentId: created.id,
        },
      });
      categories.set(childName, child.id);
    }
  }

  // ---- the posts that used to live in site.ts ----------------------------
  //
  // Seeded as DRAFT on purpose. These five were placeholder marketing copy
  // with stock photography and no body text — publishing them would put thin
  // content on a site whose whole SEO brief is to rank. They are here so the
  // titles aren't lost; fill them in and publish, or delete them.
  for (const post of blogPosts) {
    const slug = slugify(post.title);
    const bodyHtml = `<p>${post.excerpt}</p>`;

    await prisma.post.upsert({
      where: { slug },
      update: {},
      create: {
        slug,
        title: post.title,
        excerpt: post.excerpt,
        bodyHtml,
        coverUrl: post.img,
        coverAlt: post.title,
        status: "DRAFT",
        readingMins: readingMinutes(bodyHtml),
        authorId: admin.id,
        categoryId: categories.get(post.category) ?? null,
      },
    });
  }

  console.log(
    `  Seeded ${categories.size} categories and ${blogPosts.length} draft posts.`,
  );
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
