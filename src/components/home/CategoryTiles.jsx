import Link from "next/link";
import {
  Cpu,
  CircuitBoard,
  Radio,
  Cog,
  Plane,
  Box,
  Boxes,
  BatteryCharging,
  Wrench,
  Bike,
  Gauge,
  RotateCcw,
  MonitorSmartphone,
} from "lucide-react";
import { categories } from "@/lib/data";

const iconMap = {
  Cpu,
  CircuitBoard,
  Radio,
  Cog,
  Plane,
  Box,
  Boxes,
  BatteryCharging,
  Wrench,
  Bike,
  Gauge,
  RotateCcw,
  MonitorSmartphone,
};

export default function CategoryTiles() {
  return (
    <section className="container-page py-12">
      <h2 className="heading-accent mb-8">Shop by Category</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
        {categories.map((c) => {
          const Icon = iconMap[c.icon] ?? Box;
          return (
            <Link
              key={c.slug}
              href={`/products?category=${c.slug}`}
              className="group flex flex-col items-center gap-3 rounded-xl border border-silver-light bg-white p-4 text-center shadow-card transition-all hover:-translate-y-1 hover:border-royal hover:shadow-card-hover"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-cloud text-royal transition-colors group-hover:bg-royal group-hover:text-white">
                <Icon size={26} />
              </span>
              <span className="text-xs font-semibold text-navy">{c.name}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
