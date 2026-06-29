"use client";

import { useState, useEffect } from "react";
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
  AlignJustify,
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
  { label: "ATL Kits Enquiry", href: "/atl-kits-enquiry" },
  { label: "Blogs", href: "#", dropdown: true },
  { label: "BOM Tool", href: "#" },
];

const shopMenu = [
  { label: "Shop", href: "/products" },
  { label: "Track your order", href: "/orders" },
  { label: "Featured Brands", href: "/products" },
  { label: "Payment Options", href: "/checkout" },
];

const socials = [
  { Icon: Facebook, href: "#" },
  { Icon: Twitter, href: "#" },
  { Icon: Linkedin, href: "https://www.linkedin.com/company/hardvanta-technologies-llp/posts/?feedView=all" },
  { Icon: Instagram, href: "https://www.instagram.com/hardvantatechnology" },
  { Icon: Youtube, href: "#" },
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
  const [mobileCatOpen, setMobileCatOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);

  // Track scroll position to add subtle shadow on scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change / resize
  useEffect(() => {
    const close = () => setMobileOpen(false);
    window.addEventListener("resize", close);
    return () => window.removeEventListener("resize", close);
  }, []);

  function handleSearch(e) {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/products?q=${encodeURIComponent(q)}` : "/products");
    setMobileOpen(false);
  }

  return (
    // ✅ KEY CHANGE: "relative" instead of "sticky top-0" — navbar now scrolls with the page
    <header className={`relative z-50 w-full bg-white transition-shadow duration-300 ${scrolled ? "shadow-md" : "shadow-sm"}`}>

      {/* ── Utility bar: phone + socials ── */}
      <div className="border-b border-silver-light bg-white">
        <div className="container-page flex items-center justify-between py-2 text-sm">
          <a
            href="tel:+919170546395"
            className="flex items-center gap-2 text-navy hover:text-royal transition-colors"
          >
            <Phone size={15} className="text-royal" />
            <span className="font-semibold text-navy">+91 91705 46395</span>
            <span className="text-silver-dark hidden sm:inline">· Customer Support</span>
          </a>
          <div className="flex items-center gap-4 text-silver-dark">
            {socials.map(({ Icon, href }, i) => (
              <a
                key={i}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-royal transition-colors duration-150"
              >
                <Icon size={17} />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main bar: logo + search + action icons ── */}
      <div className="border-b border-silver-light bg-white">
        <div className="container-page flex items-center gap-4 py-3">

          {/* Logo */}
          <Logo size={48} />

          {/* Search — desktop */}
          <form
            onSubmit={handleSearch}
            className="hidden flex-1 md:flex items-center overflow-hidden rounded-full border border-silver bg-white shadow-sm focus-within:border-royal focus-within:ring-2 focus-within:ring-royal/20 transition-all duration-200"
          >
            <span className="pl-4 text-silver-dark">
              <Search size={17} />
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for Products..."
              className="w-full px-3 py-2.5 text-sm text-navy outline-none bg-transparent placeholder:text-silver-dark"
            />
            <button
              type="submit"
              className="m-1 rounded-full bg-royal px-5 py-2 text-sm font-semibold text-white hover:bg-royal-dark active:scale-95 transition-all duration-150"
            >
              Search
            </button>
          </form>

          {/* Desktop action icons */}
          <div className="hidden md:flex items-center gap-5 text-navy">
            <Link href="#" className="group flex flex-col items-center text-xs hover:text-royal transition-colors duration-150">
              <Repeat size={20} className="group-hover:scale-110 transition-transform duration-150" />
              <span className="mt-0.5">Compare</span>
            </Link>
            <Link href="/orders" className="group flex flex-col items-center text-xs hover:text-royal transition-colors duration-150">
              <Package size={20} className="group-hover:scale-110 transition-transform duration-150" />
              <span className="mt-0.5">Orders</span>
            </Link>
            {isAdmin && (
              <Link href="/admin" className="group flex flex-col items-center text-xs font-semibold text-royal hover:text-royal-dark transition-colors duration-150">
                <LayoutDashboard size={20} className="group-hover:scale-110 transition-transform duration-150" />
                <span className="mt-0.5">Admin</span>
              </Link>
            )}
            <Link href={loggedIn ? "/account" : "/login"} className="group flex flex-col items-center text-xs hover:text-royal transition-colors duration-150">
              <User size={20} className="group-hover:scale-110 transition-transform duration-150" />
              <span className="mt-0.5">{loggedIn ? "Account" : "Login"}</span>
            </Link>
            {loggedIn && (
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="group flex flex-col items-center text-xs hover:text-royal transition-colors duration-150"
              >
                <LogOut size={20} className="group-hover:scale-110 transition-transform duration-150" />
                <span className="mt-0.5">Logout</span>
              </button>
            )}
            <Link href="#" className="group flex flex-col items-center text-xs hover:text-royal transition-colors duration-150">
              <Heart size={20} className="group-hover:scale-110 group-hover:fill-royal/20 transition-all duration-150" />
              <span className="mt-0.5">Wishlist</span>
            </Link>
            <Link href="/cart" className="group relative flex flex-col items-center text-xs hover:text-royal transition-colors duration-150">
              <ShoppingBag size={20} className="group-hover:scale-110 transition-transform duration-150" />
              <span className="mt-0.5">Cart</span>
              {count > 0 && (
                <span className="absolute -right-2 -top-1.5 flex min-w-[18px] h-[18px] items-center justify-center rounded-full bg-royal px-1 text-[10px] font-bold text-white animate-pulse">
                  {count}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile: User + Cart + Hamburger */}
          <div className="flex md:hidden items-center gap-3 ml-auto">
            <Link href={loggedIn ? "/account" : "/login"} className="text-navy hover:text-royal transition-colors">
              <User size={22} />
            </Link>
            <Link href="/cart" className="relative text-navy hover:text-royal transition-colors">
              <ShoppingBag size={22} />
              {count > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex min-w-[17px] h-[17px] items-center justify-center rounded-full bg-royal px-1 text-[10px] font-bold text-white">
                  {count}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="rounded-lg p-1.5 text-navy hover:bg-silver-light active:bg-silver transition-colors"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? <X size={24} /> : <AlignJustify size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Category nav bar — desktop ── */}
      <div className="hidden border-b border-silver-light bg-white md:block">
        <div className="container-page flex items-stretch">

          {/* All Categories dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setCatOpen(true)}
            onMouseLeave={() => setCatOpen(false)}
          >
            <button className="flex h-full items-center gap-2 bg-navy px-5 py-3 text-sm font-semibold text-white hover:bg-navy-dark active:bg-navy-dark transition-colors duration-150">
              <AlignJustify size={16} />
              <span>All Categories</span>
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${catOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* Categories dropdown panel */}
            <div
              className={`absolute left-0 top-full z-50 max-h-[70vh] w-72 overflow-y-auto overscroll-contain rounded-b-lg border border-silver-light bg-white py-2 shadow-xl transition-all duration-200 origin-top ${
                catOpen ? "opacity-100 scale-y-100 pointer-events-auto" : "opacity-0 scale-y-95 pointer-events-none"
              }`}
            >
              {categories.map((c) => (
                <Link
                  key={c.slug}
                  href={`/products?category=${c.slug}`}
                  className="block px-4 py-2 text-sm text-navy hover:bg-cloud hover:text-royal hover:pl-5 transition-all duration-150"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Nav links */}
          <nav className="flex flex-1 flex-wrap items-center">
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
                    className="flex items-center gap-1 whitespace-nowrap px-3 py-3 text-sm font-medium text-navy hover:text-royal transition-colors duration-150 relative after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:bg-royal after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200"
                  >
                    {l.label}
                    <ChevronDown
                      size={13}
                      className={`transition-transform duration-200 ${shopOpen ? "rotate-180" : ""}`}
                    />
                  </Link>

                  {/* Shop dropdown panel */}
                  <div
                    className={`absolute left-0 top-full z-50 w-52 rounded-b-lg border border-silver-light bg-white py-2 shadow-xl transition-all duration-200 origin-top ${
                      shopOpen ? "opacity-100 scale-y-100 pointer-events-auto" : "opacity-0 scale-y-95 pointer-events-none"
                    }`}
                  >
                    {shopMenu.map((m) => (
                      <Link
                        key={m.label}
                        href={m.href}
                        className="block px-4 py-2.5 text-sm text-navy hover:bg-cloud hover:text-royal hover:pl-6 transition-all duration-150"
                      >
                        {m.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={l.label}
                  href={l.href}
                  className="flex items-center gap-1 whitespace-nowrap px-3 py-3 text-sm font-medium text-navy hover:text-royal transition-colors duration-150 relative after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:bg-royal after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200"
                >
                  {l.label}
                  {l.dropdown && (
                    <ChevronDown size={13} className="text-silver-dark" />
                  )}
                </Link>
              )
            )}
          </nav>

          {/* Sell on Hardvanta */}
          <Link
            href="#"
            className="flex items-center gap-2 border-l border-silver-light bg-cloud px-5 py-3 text-sm font-semibold text-navy hover:text-royal hover:bg-silver-light transition-colors duration-150"
          >
            <ShoppingBag size={16} />
            Sell on Hardvanta
          </Link>
        </div>
      </div>

      {/* ── Mobile menu (full drawer) ── */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out md:hidden ${
          mobileOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="border-t border-silver-light bg-white px-4 pb-8 pt-3">

          {/* Mobile Search */}
          <form
            onSubmit={handleSearch}
            className="mb-4 flex items-center overflow-hidden rounded-full border border-silver shadow-sm focus-within:border-royal focus-within:ring-2 focus-within:ring-royal/20 transition-all duration-200"
          >
            <span className="pl-4 text-silver-dark">
              <Search size={16} />
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for Products..."
              className="w-full px-3 py-2.5 text-sm outline-none bg-transparent"
            />
            <button
              type="submit"
              className="m-1 rounded-full bg-royal px-4 py-2 text-white hover:bg-royal-dark transition-colors"
            >
              <Search size={16} />
            </button>
          </form>

          {/* Nav Links */}
          <div className="mb-4 rounded-xl border border-silver-light overflow-hidden">
            {navLinks.map((l, i) => (
              <Link
                key={l.label}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center justify-between px-4 py-3 text-sm font-medium text-navy hover:bg-cloud hover:text-royal transition-colors duration-150 ${
                  i !== navLinks.length - 1 ? "border-b border-silver-light" : ""
                }`}
              >
                <span>{l.label}</span>
                {l.dropdown && <ChevronDown size={14} className="text-silver-dark" />}
              </Link>
            ))}
          </div>

          {/* All Categories accordion */}
          <div className="mb-4 rounded-xl border border-silver-light overflow-hidden">
            <button
              onClick={() => setMobileCatOpen((v) => !v)}
              className="flex w-full items-center justify-between bg-navy px-4 py-3 text-sm font-semibold text-white"
            >
              <span className="flex items-center gap-2">
                <AlignJustify size={15} /> All Categories
              </span>
              <ChevronDown
                size={15}
                className={`transition-transform duration-300 ${mobileCatOpen ? "rotate-180" : ""}`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${
                mobileCatOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="overflow-y-auto max-h-60">
                {categories.map((c, i) => (
                  <Link
                    key={c.slug}
                    href={`/products?category=${c.slug}`}
                    onClick={() => setMobileOpen(false)}
                    className={`block px-4 py-2.5 text-sm text-navy hover:bg-cloud hover:text-royal transition-colors duration-150 ${
                      i !== categories.length - 1 ? "border-b border-silver-light" : ""
                    }`}
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Account actions */}
          <div className="mb-4 rounded-xl border border-silver-light overflow-hidden">
            <Link
              href={loggedIn ? "/account" : "/login"}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 border-b border-silver-light px-4 py-3 text-sm font-medium text-navy hover:bg-cloud hover:text-royal transition-colors duration-150"
            >
              <User size={18} className="text-royal" />
              {loggedIn ? "My Account" : "Login / Register"}
            </Link>
            <Link
              href="/orders"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 border-b border-silver-light px-4 py-3 text-sm font-medium text-navy hover:bg-cloud hover:text-royal transition-colors duration-150"
            >
              <Package size={18} className="text-royal" />
              My Orders
            </Link>
            <Link
              href="#"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-navy hover:bg-cloud hover:text-royal transition-colors duration-150"
            >
              <Heart size={18} className="text-royal" />
              Wishlist
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 border-t border-silver-light px-4 py-3 text-sm font-semibold text-royal hover:bg-cloud transition-colors duration-150"
              >
                <LayoutDashboard size={18} />
                Admin Dashboard
              </Link>
            )}
            {loggedIn && (
              <button
                onClick={() => { signOut({ callbackUrl: "/" }); setMobileOpen(false); }}
                className="flex w-full items-center gap-3 border-t border-silver-light px-4 py-3 text-sm font-medium text-navy hover:bg-cloud hover:text-royal transition-colors duration-150"
              >
                <LogOut size={18} className="text-royal" />
                Logout
              </button>
            )}
          </div>

          {/* Social links */}
          <div className="flex items-center justify-center gap-4 pt-2">
            {socials.map(({ Icon, href }, i) => (
              <a
                key={i}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-silver-light text-navy hover:border-royal hover:text-royal hover:bg-cloud transition-colors duration-150"
              >
                <Icon size={17} />
              </a>
            ))}
          </div>

          {/* Contact */}
          <div className="mt-4 rounded-xl border border-silver-light bg-cloud px-4 py-3 text-center">
            <p className="text-xs text-silver-dark">Customer Support · 9:15 AM – 6:15 PM, Mon–Sat</p>
            <a
              href="tel:+919170546395"
              className="mt-1 flex items-center justify-center gap-2 font-semibold text-navy hover:text-royal transition-colors"
            >
              <Phone size={15} className="text-royal" />
              +91 91705 46395
            </a>
          </div>
        </div>
      </div>

    </header>
  );
}