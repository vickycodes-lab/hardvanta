// GET /api/products?category=<slug>&featured=true&q=<search>
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin";

export const dynamic = "force-dynamic";

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const featured = searchParams.get("featured");
  const q = searchParams.get("q");

  const where = {};
  if (category) where.category = category;
  if (featured === "true") where.featured = true;
  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { brand: { contains: q, mode: "insensitive" } },
    ];
  }

  const products = await prisma.product.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ products });
}

// POST /api/products — create a product (admin only).
export async function POST(request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const body = await request.json();
  const { name, description, price, category, brand, image } = body;
  if (!name || !description || !price || !category || !brand || !image) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  let slug = slugify(name);
  // Ensure slug is unique.
  while (await prisma.product.findUnique({ where: { slug } })) {
    slug = `${slug}-${Math.floor(Math.random() * 1000)}`;
  }

  const product = await prisma.product.create({
    data: {
      slug,
      name,
      description,
      price: parseInt(price, 10),
      salePrice: body.salePrice ? parseInt(body.salePrice, 10) : null,
      stock: body.stock ? parseInt(body.stock, 10) : 0,
      category,
      brand,
      image,
      featured: Boolean(body.featured),
    },
  });
  return NextResponse.json({ product }, { status: 201 });
}
