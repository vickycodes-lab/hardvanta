import Link from "next/link";
import { ArrowRight, Truck, ShieldCheck, Headphones, Cpu } from "lucide-react";

const stats = [
  ["10k+", "Products"],
  ["50k+", "Happy Makers"],
  ["4.7★", "Avg. Rating"],
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-navy via-navy-light to-royal-dark text-white">
      {/* Decorative glows */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-royal/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 left-1/4 h-72 w-72 rounded-full bg-royal-light/20 blur-3xl" />

      <div className="container-page relative grid items-center gap-10 py-14 md:grid-cols-2 md:py-20">
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-royal-light ring-1 ring-white/15">
            <Cpu size={14} /> New arrivals every week
          </span>
          <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight md:text-5xl lg:text-6xl">
            Your Ideas, <span className="text-royal-light">Our Parts!</span>
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-silver-light">
            India&apos;s largest robotics &amp; engineering store — robot kits,
            drone parts, components, 3D printing, batteries, motors and
            microcontrollers, with start-to-end technical support.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-lg bg-royal px-6 py-3 font-semibold text-white shadow-lg shadow-royal/30 transition-all hover:bg-royal-light active:scale-[0.98]"
            >
              Shop Now <ArrowRight size={18} />
            </Link>
            <Link
              href="/products?category=dev-boards"
              className="inline-flex items-center gap-2 rounded-lg border border-white/25 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10"
            >
              Explore Boards
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-9 flex gap-8">
            {stats.map(([value, label]) => (
              <div key={label}>
                <p className="text-2xl font-bold">{value}</p>
                <p className="text-xs text-silver-light">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Feature cards */}
        <div className="hidden justify-self-end md:block">
          <div className="grid grid-cols-2 gap-4">
            {[
              [Truck, "Fast Delivery", "Across India", "col-span-2"],
              [ShieldCheck, "Genuine Parts", "100% authentic", ""],
              [Headphones, "Expert Support", "We've got you", ""],
            ].map(([Icon, title, sub, span], i) => (
              <div
                key={i}
                className={`rounded-2xl bg-white/10 p-6 ring-1 ring-white/10 backdrop-blur transition-colors hover:bg-white/[0.15] ${span}`}
              >
                <Icon size={28} className="text-royal-light" />
                <p className="mt-3 font-semibold">{title}</p>
                <p className="text-sm text-silver-light">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
