import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { getAuthOptions } from "@/lib/auth";

import { Package, User as UserIcon } from "lucide-react";
import SignOutButton from "@/components/auth/SignOutButton";

export const dynamic = "force-dynamic";
export const metadata = { title: "My Account — hardvanta" };

export default async function AccountPage() {
  const authOptions = await getAuthOptions();
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login?callbackUrl=/account");

  const { prisma } = await import("@/lib/prisma");
  const orderCount = await prisma.order.count({ where: { userId: session.user.id } });

  return (
    <div className="container-page py-8">
      <h1 className="mb-6 text-2xl font-bold text-navy">My Account</h1>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-xl border border-silver-light bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-royal/10 text-royal">
              <UserIcon size={24} />
            </div>
            <div>
              <p className="font-semibold text-navy">
                {session.user.name || "Hardvanta Customer"}
              </p>
              <p className="text-sm text-silver-dark">{session.user.email}</p>
            </div>
          </div>
          <div className="mt-6">
            <SignOutButton />
          </div>
        </div>

        <Link
          href="/orders"
          className="flex items-center justify-between rounded-xl border border-silver-light bg-white p-6 hover:border-royal"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-royal/10 text-royal">
              <Package size={24} />
            </div>
            <div>
              <p className="font-semibold text-navy">My Orders</p>
              <p className="text-sm text-silver-dark">
                {orderCount} order{orderCount !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
