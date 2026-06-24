import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { formatPrice } from "@/utils/formatPrice";
import { Package, CheckCircle2 } from "lucide-react";
import OrderTracker from "@/components/orders/OrderTracker";

export const dynamic = "force-dynamic";
export const metadata = { title: "My Orders — hardvanta" };

const STATUS_STYLES = {
  PENDING: "bg-amber-50 text-amber-700",
  PROCESSING: "bg-blue-50 text-blue-700",
  SHIPPED: "bg-indigo-50 text-indigo-700",
  DELIVERED: "bg-green-50 text-green-700",
  CANCELLED: "bg-red-50 text-red-600",
};

export default async function OrdersPage({ searchParams }) {
  const { getAuthOptions } = await import("@/lib/auth");
  const authOptions = await getAuthOptions();
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login?callbackUrl=/orders");

  const { prisma } = await import("@/lib/prisma");
  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  const justPlaced = searchParams?.placed === "1";

  return (
    <div className="container-page py-8">
      <h1 className="heading-accent mb-8">My Orders</h1>

      {justPlaced && (
        <div className="mb-6 flex items-center gap-2 rounded-lg bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          <CheckCircle2 size={18} />
          Order placed successfully! We&apos;ll deliver it soon.
        </div>
      )}

      {orders.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-center">
          <Package size={56} className="text-silver-dark" />
          <h2 className="mt-4 text-xl font-bold text-navy">No orders yet</h2>
          <Link
            href="/products"
            className="mt-6 rounded-lg bg-royal px-6 py-3 font-semibold text-white hover:bg-royal-dark"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-2xl border border-silver-light bg-white p-5 shadow-card"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-silver-light pb-3">
                <div>
                  <p className="text-sm font-semibold text-navy">
                    Order #{order.id.slice(-8).toUpperCase()}
                  </p>
                  <p className="text-xs text-silver-dark">
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    STATUS_STYLES[order.status] || "bg-silver-light text-navy"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              {/* Order progress tracker */}
              <div className="py-5">
                <OrderTracker status={order.status} />
              </div>

              <div className="space-y-1 border-t border-silver-light py-3 text-sm">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span className="text-silver-dark">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="font-medium text-navy">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between border-t border-silver-light pt-3 text-sm font-bold text-navy">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
