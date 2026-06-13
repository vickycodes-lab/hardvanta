import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin";
import { LayoutDashboard, Package, ShoppingCart, Home } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin — hardvanta" };

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
];

export default async function AdminLayout({ children }) {
  const session = await getAdminSession();
  if (!session) redirect("/login?callbackUrl=/admin");

  return (
    <div className="container-page flex flex-col gap-6 py-8 lg:flex-row">
      <aside className="lg:w-56 shrink-0">
        <div className="rounded-xl border border-silver-light bg-white p-3">
          <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-silver-dark">
            Admin Panel
          </p>
          <nav className="space-y-1">
            {NAV.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-navy hover:bg-cloud hover:text-royal"
              >
                <Icon size={18} /> {label}
              </Link>
            ))}
            <Link
              href="/"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-silver-dark hover:bg-cloud hover:text-royal"
            >
              <Home size={18} /> Back to store
            </Link>
          </nav>
        </div>
      </aside>
      <main className="flex-1">{children}</main>
    </div>
  );
}
