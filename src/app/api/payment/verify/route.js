// POST /api/payment/verify
// Verifies the Razorpay signature, then creates the order in our DB and
// clears the cart — only if the payment is genuine.
import { NextResponse } from "next/server";
import crypto from "crypto";
import { getServerSession } from "next-auth";
import { sendOrderConfirmationEmail } from "@/lib/email";

export async function POST(request) {
  const { getAuthOptions } = await import("@/lib/auth");
  const authOptions = await getAuthOptions();
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    address,
  } = await request.json();

  // Recreate the signature with our secret and compare — proves the payment
  // really came from Razorpay and wasn't forged by the client.
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expected !== razorpay_signature) {
    return NextResponse.json(
      { error: "Payment verification failed." },
      { status: 400 }
    );
  }

  const { prisma } = await import("@/lib/prisma");
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

  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        userId,
        total,
        address: address ?? {},
        status: "PROCESSING",
        paymentMethod: "ONLINE",
        paymentId: razorpay_payment_id,
        razorpayOrderId: razorpay_order_id,
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
      console.error("[payment] confirmation email failed:", err?.message || err);
    }
  }

  return NextResponse.json({ order }, { status: 201 });
}
