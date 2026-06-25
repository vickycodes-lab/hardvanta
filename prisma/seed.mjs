// Seeds the DB from the existing mock data in src/lib/data.js.
// Run with: npm run seed  (after `npx prisma db push`)
import { PrismaClient } from "@prisma/client";
import { categories, products } from "../src/lib/data.js";

const prisma = new PrismaClient({
  adapter: {
    provider: "sqlite",
    url: process.env.DATABASE_URL,
  },
});

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}

async function main() {
  console.log("Seeding categories...");
  for (const c of categories) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      create: c,
      update: { name: c.name, icon: c.icon },
    });
  }

  console.log("Seeding products...");
  const seenSlugs = new Set();
  for (const p of products) {
    let slug = slugify(p.name);
    while (seenSlugs.has(slug)) slug = `${slug}-x`;
    seenSlugs.add(slug);

    const data = {
      slug,
      name: p.name,
      description: p.description,
      price: p.price,
      salePrice: p.salePrice ?? null,
      stock: p.stock,
      category: p.category,
      brand: p.brand,
      image: p.image,
      rating: p.rating,
      reviewCount: p.reviewCount,
      featured: p.featured,
    };

    await prisma.product.upsert({
      where: { slug },
      create: data,
      update: data,
    });
  }

  console.log(
    `Done — ${categories.length} categories, ${products.length} products.`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
