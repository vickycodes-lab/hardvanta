// Server-side data access — used by Server Components to read directly from the DB.
// (Client components should call the /api routes instead.)

import { categories, products } from "./data";

const useDummy =
  process.env.USE_DUMMY_DB === "true" ||
  (process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith("file:"));

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}

export async function getFeaturedProducts() {
  if (useDummy) return products.filter((p) => p.featured);
  const { prisma } = await import("@/lib/prisma");
  return prisma.product.findMany({ where: { featured: true }, orderBy: { createdAt: "desc" } });
}

export async function getDeals(limit = 4) {
  if (useDummy) return products.filter((p) => p.salePrice != null).slice(0, limit);
  const { prisma } = await import("@/lib/prisma");
  return prisma.product.findMany({ where: { salePrice: { not: null } }, take: limit, orderBy: { createdAt: "desc" } });
}

export async function getAllProducts() {
  if (useDummy) return products;
  const { prisma } = await import("@/lib/prisma");
  return prisma.product.findMany({ orderBy: { createdAt: "desc" } });
}

export async function searchProducts(q) {
  if (useDummy) {
    const qq = q.toLowerCase();
    return products.filter((p) => (p.name + " " + p.brand + " " + p.description).toLowerCase().includes(qq));
  }
  const { prisma } = await import("@/lib/prisma");
  return prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { brand: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ],
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getProductsByCategory(category) {
  if (useDummy) return products.filter((p) => p.category === category);
  const { prisma } = await import("@/lib/prisma");
  return prisma.product.findMany({ where: { category }, orderBy: { createdAt: "desc" } });
}

export async function getCategories() {
  if (useDummy) return categories;
  const { prisma } = await import("@/lib/prisma");
  return prisma.category.findMany();
}

export async function getProductById(idOrSlug) {
  if (useDummy) {
    const byId = products.find((p) => p.id === idOrSlug);
    if (byId) return byId;
    return products.find((p) => slugify(p.name) === idOrSlug);
  }
  const { prisma } = await import("@/lib/prisma");
  return prisma.product.findFirst({ where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }] } });
}

export async function getRelatedProducts(category, excludeId, limit = 4) {
  if (useDummy) return products.filter((p) => p.category === category && p.id !== excludeId).slice(0, limit);
  const { prisma } = await import("@/lib/prisma");
  return prisma.product.findMany({ where: { category, NOT: { id: excludeId } }, take: limit, orderBy: { createdAt: "desc" } });
}
