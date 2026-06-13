import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/utils/formatPrice";
import { Package, ShoppingCart, Users, IndianRupee } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [productCount, orderCount, userCount, orders] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.user.count(),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { items: true },
    }),
  ]);

  const revenue = await prisma.order.aggregate({ _sum: { total: true } });

  const stats = [
    { label: "Revenue", value: formatPrice(revenue._sum.total || 0), icon: IndianRupee },
    { label: "Orders", value: orderCount, icon: ShoppingCart },
    { label: "Products", value: productCount, icon: Package },
    { label: "Customers", value: userCount, icon: Users },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-navy">Dashboard</h1>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-xl border border-silver-light bg-white p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-silver-dark">{label}</span>
              <Icon size={18} className="text-royal" />
            </div>
            <p className="mt-2 text-2xl font-bold text-navy">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-silver-light bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-navy">Recent Orders</h2>
          <Link href="/admin/orders" className="text-sm font-semibold text-royal hover:underline">
            View all
          </Link>
        </div>
        {orders.length === 0 ? (
          <p className="py-6 text-center text-sm text-silver-dark">No orders yet.</p>
        ) : (
          <div className="space-y-2">
            {orders.map((o) => (
              <div
                key={o.id}
                className="flex items-center justify-between border-b border-silver-light py-2 text-sm last:border-0"
              >
                <span className="font-medium text-navy">
                  #{o.id.slice(-8).toUpperCase()}
                </span>
                <span className="text-silver-dark">
                  {o.items.length} item{o.items.length !== 1 ? "s" : ""}
                </span>
                <span className="rounded-full bg-cloud px-2 py-0.5 text-xs font-semibold text-navy">
                  {o.status}
                </span>
                <span className="font-bold text-navy">{formatPrice(o.total)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
