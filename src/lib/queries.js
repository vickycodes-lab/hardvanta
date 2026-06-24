// Server-side data access — used by Server Components to read directly from the DB.
// (Client components should call the /api routes instead.)

async function getPrisma() {
  const mod = await import("@/lib/prisma");
  return mod.prisma;
}

export async function getFeaturedProducts() {
  const prisma = await getPrisma();
  return prisma.product.findMany({
    where: { featured: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getDeals(limit = 4) {
  const prisma = await getPrisma();
  return prisma.product.findMany({
    where: { salePrice: { not: null } },
    take: limit,
    orderBy: { createdAt: "desc" },
  });
}

export async function getAllProducts() {
  const prisma = await getPrisma();
  return prisma.product.findMany({ orderBy: { createdAt: "desc" } });
}

export async function searchProducts(q) {
  const prisma = await getPrisma();
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
  const prisma = await getPrisma();
  return prisma.product.findMany({
    where: { category },
    orderBy: { createdAt: "desc" },
  });
}

export async function getCategories() {
  const prisma = await getPrisma();
  return prisma.category.findMany();
}

export async function getProductById(idOrSlug) {
  const prisma = await getPrisma();
  return prisma.product.findFirst({
    where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }] },
  });
}

export async function getRelatedProducts(category, excludeId, limit = 4) {
  const prisma = await getPrisma();
  return prisma.product.findMany({
    where: { category, NOT: { id: excludeId } },
    take: limit,
    orderBy: { createdAt: "desc" },
  });
}
