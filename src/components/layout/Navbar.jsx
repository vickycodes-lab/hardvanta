"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Search,
  ShoppingBag,
  User,
  Heart,
  Repeat,
  Package,
  Menu,
  X,
  ChevronDown,
  Phone,
  LogOut,
  LayoutDashboard,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
} from "lucide-react";
import { categories } from "@/lib/data";
import { useCart } from "@/context/CartContext";
import Logo from "./Logo";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/products", dropdown: true },
  { label: "Forum", href: "#" },
  { label: "Bulk Enquiry", href: "#" },
  { label: "New Arrivals", href: "/products" },
  { label: "ATL Kits Enquiry", href: "#" },
  { label: "Blogs", href: "#", dropdown: true },
  { label: "BOM Tool", href: "#" },
  { label: "Careers", href: "#" },
];

const shopMenu = [
  { label: "Shop", href: "/products" },
  { label: "Track your order", href: "/orders" },
  { label: "Featured Brands", href: "/products" },
  { label: "Payment Options", href: "/checkout" },
];

export default function Navbar() {
  const { count } = useCart();
  const router = useRouter();
  const { data: session, status } = useSession();
  const loggedIn = status === "authenticated";
  const isAdmin = session?.user?.role === "ADMIN";
  const [mobileOpen, setMobileOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [bannerOpen, setBannerOpen] = useState(true);
  const [query, setQuery] = useState("");

  function handleSearch(e) {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/products?q=${encodeURIComponent(q)}` : "/products");
    setMobileOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white">
      {/* Promo announcement bar */}
      {bannerOpen && (
        <div className="relative bg-gradient-to-r from-navy via-royal-dark to-navy text-white">
          <div className="container-page flex items-center justify-center gap-3 py-2 text-center text-xs sm:text-sm">
            
            <Link
              href="#"
              className="rounded-md bg-white px-3 py-1 text-xs font-bold text-navy hover:bg-silver-light"
            >
              
            </Link>
          </div>
          <button
            onClick={() => setBannerOpen(false)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/80 hover:text-white"
            aria-label="Dismiss"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Utility bar: phone + socials */}
      <div className="hidden border-b border-silver-light md:block">
        <div className="container-page flex items-center justify-between py-2 text-sm">
          <a
            href="tel:+919170546395"
            className="flex items-center gap-2 text-navy"
          >
            <Phone size={16} className="text-royal" />
            <span className="font-semibold">+91 91705 46395</span>
            <span className="text-silver-dark">Customer Support</span>
          </a>
          <div className="flex items-center gap-4 text-navy">
            {[
  { Icon: Facebook, href: "#" },
  { Icon: Twitter, href: "#" },
  { Icon: Linkedin, href: "https://www.linkedin.com/company/hardvanta-technologies-llp/posts/?feedView=all" },
  { Icon: Instagram, href: "https://www.instagram.com/hardvantatechnology" },
  { Icon: Youtube, href: "#" },
].map(({ Icon, href }, i) => (
  <a key={i} href={href} target="_blank" rel="noopener noreferrer" className="hover:text-royal">
    <Icon size={18} />
  </a>
))}
          </div>
        </div>
      </div>

      {/* Main bar: logo + search + actions */}
      <div className="border-b border-silver-light">
        <div className="container-page flex items-center gap-4 py-3">
          <Logo size={52} />

          {/* Search */}
          <form onSubmit={handleSearch} className="hidden flex-1 md:block">
            <div className="flex items-center overflow-hidden rounded-lg border border-silver">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for Products..."
                className="w-full px-4 py-2.5 text-sm text-navy outline-none"
              />
              <button
                type="submit"
                className="flex items-center gap-2 bg-royal px-6 py-2.5 text-sm font-semibold text-white hover:bg-royal-dark"
              >
                <Search size={18} />
                <span className="hidden lg:inline">Search</span>
              </button>
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-3 sm:gap-5">
            <Link
              href="#"
              className="hidden flex-col items-center text-xs text-navy hover:text-royal lg:flex"
            >
              <Repeat size={20} />
              <span className="mt-0.5">Compare</span>
            </Link>
            <Link
              href="/orders"
              className="hidden flex-col items-center text-xs text-navy hover:text-royal lg:flex"
            >
              <Package size={20} />
              <span className="mt-0.5">Orders</span>
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                className="hidden flex-col items-center text-xs font-semibold text-royal hover:text-royal-dark lg:flex"
              >
                <LayoutDashboard size={20} />
                <span className="mt-0.5">Admin</span>
              </Link>
            )}
            <Link
              href={loggedIn ? "/account" : "/login"}
              className="flex flex-col items-center text-xs text-navy hover:text-royal"
            >
              <User size={20} />
              <span className="mt-0.5 hidden sm:block">
                {loggedIn ? "Account" : "Login"}
              </span>
            </Link>
            {loggedIn && (
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="hidden flex-col items-center text-xs text-navy hover:text-royal lg:flex"
              >
                <LogOut size={20} />
                <span className="mt-0.5">Logout</span>
              </button>
            )}
            <Link
              href="#"
              className="hidden flex-col items-center text-xs text-navy hover:text-royal sm:flex"
            >
              <Heart size={20} />
              <span className="mt-0.5">Wishlist</span>
            </Link>
            <Link
              href="/cart"
              className="relative flex flex-col items-center text-xs text-navy hover:text-royal"
            >
              <ShoppingBag size={20} />
              <span className="mt-0.5 hidden sm:block">Cart</span>
              {count > 0 && (
                <span className="absolute -right-2 -top-1.5 flex h-4.5 w-4.5 min-w-[18px] items-center justify-center rounded-full bg-royal px-1 text-[10px] font-bold text-white">
                  {count}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="rounded-lg p-1.5 text-navy hover:bg-silver-light md:hidden"
              aria-label="Menu"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Category nav bar */}
      <div className="hidden border-b border-silver-light bg-white shadow-sm md:block">
        <div className="container-page flex items-stretch">
          {/* All Categories dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setCatOpen(true)}
            onMouseLeave={() => setCatOpen(false)}
          >
            <button className="flex h-full items-center gap-2 rounded-t bg-navy px-5 py-3 text-sm font-semibold text-white">
              <Menu size={18} /> All Categories
              <ChevronDown size={16} />
            </button>
            {catOpen && (
              <div className="absolute left-0 top-full z-50 max-h-[70vh] w-72 overflow-y-auto overscroll-contain rounded-b-lg border border-silver-light bg-white py-2 shadow-card-hover">
                {categories.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/products?category=${c.slug}`}
                    className="block px-4 py-2 text-sm text-navy hover:bg-cloud hover:text-royal"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Nav links */}
          <nav className="flex flex-1 flex-wrap items-center gap-1 px-2">
            {navLinks.map((l) =>
              l.label === "Shop" ? (
                <div
                  key={l.label}
                  className="relative"
                  onMouseEnter={() => setShopOpen(true)}
                  onMouseLeave={() => setShopOpen(false)}
                >
                  <Link
                    href={l.href}
                    className="flex items-center gap-1 whitespace-nowrap px-3 py-3 text-sm font-medium text-navy hover:text-royal"
                  >
                    {l.label}
                    <ChevronDown size={14} />
                  </Link>

                  {/* Shop dropdown */}
                  {shopOpen && (
                    <div className="absolute left-0 top-full z-50 w-56 rounded-b-lg border border-silver-light bg-white py-2 shadow-card-hover">
                      {shopMenu.map((m) => (
                        <Link
                          key={m.label}
                          href={m.href}
                          className="block px-4 py-2.5 text-sm text-navy hover:bg-cloud hover:text-royal"
                        >
                          {m.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={l.label}
                  href={l.href}
                  className="flex items-center gap-1 whitespace-nowrap px-3 py-3 text-sm font-medium text-navy hover:text-royal"
                >
                  {l.label}
                  {l.dropdown && <ChevronDown size={14} />}
                </Link>
              )
            )}
          </nav>

          {/* Sell on Hardvanta */}
          <Link
            href="#"
            className="flex items-center gap-2 border-l border-silver-light bg-cloud px-5 py-3 text-sm font-semibold text-navy hover:text-royal"
          >
            <ShoppingBag size={18} /> Sell on Hardvanta
          </Link>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-b border-silver-light bg-white md:hidden">
          <div className="container-page py-3">
            <form
              onSubmit={handleSearch}
              className="mb-3 flex items-center overflow-hidden rounded-lg border border-silver"
            >
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for Products..."
                className="w-full px-3 py-2 text-sm outline-none"
              />
              <button type="submit" className="bg-royal px-4 py-2 text-white">
                <Search size={18} />
              </button>
            </form>
            {navLinks.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="block border-b border-silver-light py-2.5 text-sm font-medium text-navy"
              >
                {l.label}
              </Link>
            ))}
            <p className="mt-3 mb-1 text-xs font-semibold uppercase text-silver-dark">
              Categories
            </p>
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/products?category=${c.slug}`}
                onClick={() => setMobileOpen(false)}
                className="block border-b border-silver-light py-2.5 text-sm text-navy"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
