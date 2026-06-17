import Link from "next/link";
import {
  Facebook,
  Instagram,
  Youtube,
  Twitter,
  Linkedin,
  Mail,
  Phone,
} from "lucide-react";
import Logo from "./Logo";

const columns = [
  {
    title: "Information",
    links: [
      { label: "Track Your Order", href: "/orders" },
      { label: "Videos", href: "#" },
      { label: "FAQ", href: "#" },
      { label: "Careers", href: "#" },
      { label: "My Account", href: "/account" },
      { label: "Cart", href: "/cart" },
      { label: "Checkout", href: "/checkout" },
      { label: "Payment Options", href: "#" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Contact Us", href: "/contact" },
      { label: "Hardvanta B2B", href: "/b2b" },
      { label: "Bulk Orders", href: "/b2b#bulk" },
      { label: "Prototyping Services", href: "/b2b#prototyping" },
    ],
  },
  {
    title: "Policies",
    links: [
      { label: "Investor Relations", href: "#" },
      { label: "CSR", href: "#" },
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Shipping & Refund", href: "#" },
      { label: "E-Waste Collection", href: "#" },
    ],
  },
];

const socials = [
  { Icon: Facebook, href: "#" },
  { Icon: Twitter, href: "#" },
  {
    Icon: Linkedin,
    href: "https://www.linkedin.com/company/hardvanta-technologies-llp/posts/?feedView=all",
  },
  {
    Icon: Instagram,
    href: "https://www.instagram.com/hardvantatechnology",
  },
  { Icon: Youtube, href: "#" },
];

export default function Footer() {
  return (
    <footer className="mt-16 bg-navy text-silver-light">

      {/* Newsletter strip */}
      <div className="border-b border-navy-light bg-navy-dark">
        <div className="container-page grid items-center gap-6 py-8 md:grid-cols-2">
          <div>
            <h3 className="text-lg font-bold text-white">
              Subscribe to our Newsletter
            </h3>
            <p className="text-sm text-silver">
              Get promotional offers &amp; discounts straight to your inbox.
            </p>
          </div>
          <form className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              placeholder="First Name"
              className="w-full rounded-lg px-4 py-2.5 text-sm text-navy outline-none sm:w-1/3"
            />
            <input
              type="email"
              placeholder="Email Id"
              className="w-full flex-1 rounded-lg px-4 py-2.5 text-sm text-navy outline-none"
            />
            <button
              type="button"
              className="flex items-center justify-center gap-2 rounded-lg bg-royal px-5 py-2.5 text-sm font-semibold text-white hover:bg-royal-light"
            >
              <Mail size={16} /> Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Main columns */}
      <div className="container-page grid grid-cols-2 gap-8 py-12 md:grid-cols-5">

        {/* Brand + contact */}
        <div className="col-span-2">
          <Logo size={44} />
          <p className="mt-4 max-w-xs text-sm text-silver">
            India&apos;s store for robotics, electronics and DIY engineering
            products. Your ideas, our parts!
          </p>
          <p className="mt-1 text-xs text-silver">
            A unit of Hardvanta Technologies LLP
          </p>

          <div className="mt-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-silver">
              Got Questions?
            </p>
            <p className="text-xs text-silver">
              Call us 9:15 AM – 6:15 PM, Mon–Sat
            </p>
            <a
              href="tel:+919170546395"
              className="mt-2 flex items-center gap-2 text-white hover:text-royal-light"
            >
              <Phone size={16} className="text-royal-light" />
              <span className="font-semibold">+91 91705 46395</span>
            </a>
          </div>

          <div className="mt-5 flex gap-3">
            <span className="cursor-pointer rounded-lg border border-navy-light bg-navy-light px-3 py-2 text-xs text-white hover:border-royal">
              ▶ Google Play
            </span>
            <span className="cursor-pointer rounded-lg border border-navy-light bg-navy-light px-3 py-2 text-xs text-white hover:border-royal">
               App Store
            </span>
          </div>
        </div>

        {/* Link Columns */}
        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="mb-4 font-semibold text-white">{col.title}</h4>
            <ul className="space-y-2 text-sm">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="hover:text-royal-light transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="border-t border-navy-light">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-4 text-xs text-silver sm:flex-row">
          <p>© 2026 hardvanta — All Rights Reserved.</p>
          <div className="flex gap-3">
            {socials.map(({ Icon, href }, i) => (
              <a
                key={i}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-navy-light hover:bg-royal transition-colors"
              >
                <Icon size={16} className="text-white" />
              </a>
            ))}
          </div>
        </div>
      </div>

    </footer>
  );
}