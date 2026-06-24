// GET /api/products/[id] — single product by id or slug.
import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin";

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  const { id } = params;
  const { prisma } = await import("@/lib/prisma");
  const product = await prisma.product.findFirst({
    where: { OR: [{ id }, { slug: id }] },
  });
  if (!product) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }
  return NextResponse.json({ product });
}

// PUT /api/products/[id] — update a product (admin only).
export async function PUT(request, { params }) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const body = await request.json();
  const data = {};
  for (const key of ["name", "description", "category", "brand", "image"]) {
    if (body[key] !== undefined) data[key] = body[key];
  }
  if (body.price !== undefined) data.price = parseInt(body.price, 10);
  if (body.salePrice !== undefined)
    data.salePrice = body.salePrice ? parseInt(body.salePrice, 10) : null;
  if (body.stock !== undefined) data.stock = parseInt(body.stock, 10);
  if (body.featured !== undefined) data.featured = Boolean(body.featured);

  const { prisma } = await import("@/lib/prisma");
  const product = await prisma.product
    .update({ where: { id: params.id }, data })
    .catch(() => null);
  if (!product) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }
  return NextResponse.json({ product });
}

// DELETE /api/products/[id] — delete a product (admin only).
export async function DELETE(request, { params }) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { prisma } = await import("@/lib/prisma");
  const deleted = await prisma.product
    .delete({ where: { id: params.id } })
    .catch(() => null);
  if (!deleted) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
