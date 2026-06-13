// PATCH /api/orders/[id] — update order status (admin only).
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin";

const VALID = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

export async function PATCH(request, { params }) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { status } = await request.json();
  if (!VALID.includes(status)) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }
  const order = await prisma.order
    .update({ where: { id: params.id }, data: { status } })
    .catch(() => null);
  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }
  return NextResponse.json({ order });
}
