import { redirect, notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { formatPrice } from "@/utils/formatPrice";
import { Package, ArrowLeft, Phone, MapPin, CreditCard, CheckCircle2 } from "lucide-react";
import OrderTracker from "@/components/orders/OrderTracker";
import CancelOrderButton from "@/components/orders/CancelOrderButton";

export const dynamic = "force-dynamic";

const STATUS_STYLES = {
  PENDING: "bg-amber-50 text-amber-700 border border-amber-200",
  PROCESSING: "bg-blue-50 text-blue-700 border border-blue-200",
  SHIPPED: "bg-indigo-50 text-indigo-700 border border-indigo-200",
  DELIVERED: "bg-green-50 text-green-700 border border-green-200",
  CANCELLED: "bg-red-50 text-red-600 border border-red-200",
};

export default async function OrderDetailPage({ params, searchParams }) {
  const { getAuthOptions } = await import("@/lib/auth");
  const authOptions = await getAuthOptions();
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login?callbackUrl=/orders");

  const { prisma } = await import("@/lib/prisma");
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { items: true },
  });

  if (!order || order.userId !== session.user.id) notFound();

  const justCancelled = searchParams?.cancelled === "1";

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link href="/orders" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-royal mb-6 transition-colors">
          <ArrowLeft size={15} /> Back to Orders
        </Link>
        {justCancelled && (
          <div className="mb-5 flex items-center gap-2 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm font-medium text-green-700">
            <CheckCircle2 size={16} /> Order cancelled successfully.
          </div>
        )}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-4 overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-royal/10 flex items-center justify-center">
                <Package size={18} className="text-royal" />
              </div>
              <div>
                <p className="text-sm font-bold text-navy">Order #{order.id.slice(-8).toUpperCase()}</p>
                <p className="text-xs text-gray-500">Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
              </div>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[order.status] || "bg-gray-100 text-navy"}`}>
              {order.status}
            </span>
          </div>
          <div className="px-5 py-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-royal mb-4">Order Progress</p>
            <OrderTracker status={order.status} />
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-4 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <p className="text-xs font-semibold uppercase tracking-widest text-royal">Order Items</p>
          </div>
          <div className="divide-y divide-gray-100">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center flex-shrink-0">
                    <Package size={15} className="text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-navy">{item.name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity} x {formatPrice(item.price)}</p>
                  </div>
                </div>
                <p className="text-sm font-bold text-navy">{formatPrice(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center px-5 py-4 bg-gray-50 border-t border-gray-100">
            <span className="text-sm font-bold text-navy">Order Total</span>
            <span className="text-lg font-bold text-navy">{formatPrice(order.total)}</span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-royal mb-3 flex items-center gap-1.5">
              <MapPin size={13} /> Delivery Address
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">{order.address || "Address not available"}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-royal mb-3 flex items-center gap-1.5">
              <CreditCard size={13} /> Payment
            </p>
            <p className="text-sm text-gray-600">{order.paymentMethod || "Online Payment"}</p>
            <p className="text-xs text-gray-400 mt-1">Status: Paid</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {order.status !== "CANCELLED" && order.status !== "DELIVERED" && (
            <CancelOrderButton orderId={order.id} />
          )}
          <a href="tel:+919170546395" className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-navy hover:border-royal hover:text-royal transition-colors">
            <Phone size={15} /> Contact Support
          </a>
          <Link href="/products" className="flex items-center gap-2 rounded-xl bg-royal px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy transition-colors">
            Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  );
}