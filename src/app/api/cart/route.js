// Cart API — server-side cart for logged-in users.
//   GET    /api/cart            → list cart items (with product data)
//   POST   /api/cart            → add { productId, quantity }
//   PATCH  /api/cart            → set quantity { productId, quantity }
//   DELETE /api/cart?productId= → remove one item (or all if omitted)
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

async function requireUser() {
  const { getAuthOptions } = await import("@/lib/auth");
  const authOptions = await getAuthOptions();
  const session = await getServerSession(authOptions);
  return session?.user?.id ?? null;
}

function serialize(items) {
  // Flatten product fields into each cart row for the frontend.
  return items.map((it) => ({
    id: it.product.id,
    name: it.product.name,
    price: it.product.price,
    salePrice: it.product.salePrice,
    image: it.product.image,
    slug: it.product.slug,
    stock: it.product.stock,
    quantity: it.quantity,
  }));
}

export async function GET() {
  const userId = await requireUser();
  if (!userId) return NextResponse.json({ items: [] });
  const { prisma } = await import("@/lib/prisma");
  const items = await prisma.cartItem.findMany({
    where: { userId },
    include: { product: true },
  });
  return NextResponse.json({ items: serialize(items) });
}

export async function POST(request) {
  const userId = await requireUser();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { productId, quantity = 1 } = await request.json();
  if (!productId) {
    return NextResponse.json({ error: "productId required" }, { status: 400 });
  }
  const { prisma } = await import("@/lib/prisma");
  await prisma.cartItem.upsert({
    where: { userId_productId: { userId, productId } },
    create: { userId, productId, quantity },
    update: { quantity: { increment: quantity } },
  });
  const items = await prisma.cartItem.findMany({
    where: { userId },
    include: { product: true },
  });
  return NextResponse.json({ items: serialize(items) });
}

export async function PATCH(request) {
  const userId = await requireUser();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { productId, quantity } = await request.json();
  if (!productId) {
    return NextResponse.json({ error: "productId required" }, { status: 400 });
  }
  const { prisma } = await import("@/lib/prisma");
  if (quantity < 1) {
    await prisma.cartItem.deleteMany({ where: { userId, productId } });
  } else {
    await prisma.cartItem.update({
      where: { userId_productId: { userId, productId } },
      data: { quantity },
    });
  }
  const items = await prisma.cartItem.findMany({
    where: { userId },
    include: { product: true },
  });
  return NextResponse.json({ items: serialize(items) });
}

export async function DELETE(request) {
  const userId = await requireUser();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("productId");
  const { prisma } = await import("@/lib/prisma");
  if (productId) {
    await prisma.cartItem.deleteMany({ where: { userId, productId } });
  } else {
    await prisma.cartItem.deleteMany({ where: { userId } });
  }
  const items = await prisma.cartItem.findMany({
    where: { userId },
    include: { product: true },
  });
  return NextResponse.json({ items: serialize(items) });
}
