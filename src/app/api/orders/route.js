// Orders API.
//   GET  /api/orders → current user's orders (newest first)
//   POST /api/orders → create order from server cart { address }
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendOrderConfirmationEmail } from "@/lib/email";

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const orders = await prisma.order.findMany({
    where: { userId },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ orders });
}

export async function POST(request) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { address } = await request.json();
  if (!address) {
    return NextResponse.json({ error: "Shipping address required." }, { status: 400 });
  }

  const cartItems = await prisma.cartItem.findMany({
    where: { userId },
    include: { product: true },
  });
  if (cartItems.length === 0) {
    return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
  }

  const total = cartItems.reduce(
    (sum, it) => sum + (it.product.salePrice ?? it.product.price) * it.quantity,
    0
  );

  // Create order + items, then clear the cart, atomically.
  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        userId,
        total,
        address,
        items: {
          create: cartItems.map((it) => ({
            productId: it.productId,
            name: it.product.name,
            quantity: it.quantity,
            price: it.product.salePrice ?? it.product.price,
          })),
        },
      },
      include: { items: true },
    });
    await tx.cartItem.deleteMany({ where: { userId } });
    return created;
  });

  // Send confirmation email (best-effort — never block the order on email).
  if (session.user?.email) {
    try {
      await sendOrderConfirmationEmail(session.user.email, order);
    } catch (err) {
      console.error("[orders] confirmation email failed:", err?.message || err);
    }
  }

  return NextResponse.json({ order }, { status: 201 });
}
