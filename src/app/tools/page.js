"use client";

import { useState, useMemo } from "react";

/* ---------------------------------------------------------
   src/app/tools/page.js
   Renders PAGE CONTENT only — breadcrumb, banner, filters,
   and product grid. Assumes the global Navbar/Footer already
   come from src/app/layout.js. If you don't have a shared
   layout, import your <Navbar /> / <Footer /> and wrap the
   return value below with them.
--------------------------------------------------------- */

const CATEGORIES = [
  "All",
  "Soldering",
  "Measuring & Testing",
  "Hand Tools",
  "ESD & Safety",
  "Kits",
];

const PRICE_BANDS = [
  { id: "u300", label: "Under ₹300", test: (p) => p < 300 },
  { id: "300-600", label: "₹300 – ₹600", test: (p) => p >= 300 && p <= 600 },
  { id: "600-1000", label: "₹600 – ₹1,000", test: (p) => p > 600 && p <= 1000 },
  { id: "above1000", label: "Above ₹1,000", test: (p) => p > 1000 },
];

const products = [
  { id: "t1", icon: "solder", brand: "Hardvanta Tools", category: "Soldering", title: "60W Adjustable Temperature Soldering Iron Kit", price: 649, old: 899, rating: 4.6, reviews: 212, stock: "In Stock" },
  { id: "t2", icon: "meter", brand: "Mastech", category: "Measuring & Testing", title: "MS8268 Digital Multimeter — AC/DC, Continuity", price: 799, old: 999, rating: 4.5, reviews: 340, stock: "In Stock" },
  { id: "t3", icon: "screwdriver", brand: "Generic", category: "Hand Tools", title: "32-in-1 Precision Screwdriver Set with Case", price: 399, old: 549, rating: 4.4, reviews: 178, stock: "In Stock" },
  { id: "t4", icon: "wirestrip", brand: "Robu Tech", category: "Hand Tools", title: "Automatic Wire Stripper & Cutter Tool", price: 329, old: 449, rating: 4.3, reviews: 96, stock: "Only 6 left" },
  { id: "t5", icon: "helpinghands", brand: "MakerLab", category: "Soldering", title: "Soldering Helping Hands with Magnifier & LED", price: 549, old: 699, rating: 4.7, reviews: 154, stock: "In Stock" },
  { id: "t6", icon: "gluegun", brand: "Generic", category: "Hand Tools", title: "40W Mini Hot Glue Gun with 10 Glue Sticks", price: 249, old: 329, rating: 4.2, reviews: 88, stock: "In Stock" },
  { id: "t7", icon: "desolder", brand: "Generic", category: "Soldering", title: "Anti-Static Solder Sucker Desoldering Pump", price: 179, old: 229, rating: 4.1, reviews: 67, stock: "In Stock" },
  { id: "t8", icon: "toolkit", brand: "Hardvanta Tools", category: "Kits", title: "46-in-1 Electronics Repair Tool Kit", price: 899, old: 1199, rating: 4.8, reviews: 301, stock: "In Stock" },
  { id: "t9", icon: "crimp", brand: "Robu Tech", category: "Hand Tools", title: "Ratchet Crimping Tool — RJ45 / Dupont / JST", price: 599, old: 799, rating: 4.5, reviews: 120, stock: "Only 3 left" },
  { id: "t10", icon: "wriststrap", brand: "Generic", category: "ESD & Safety", title: "ESD Anti-Static Wrist Strap, Adjustable", price: 99, old: 149, rating: 4.3, reviews: 210, stock: "In Stock" },
  { id: "t11", icon: "tweezers", brand: "Generic", category: "ESD & Safety", title: "Anti-Static ESD Tweezers Set (5 pcs)", price: 199, old: 259, rating: 4.4, reviews: 74, stock: "In Stock" },
  { id: "t12", icon: "hotair", brand: "SG Flash", category: "Measuring & Testing", title: "858D Hot Air Rework Station, 700W", price: 2499, old: 2999, rating: 4.6, reviews: 142, stock: "In Stock" },
];

const BRANDS = [...new Set(products.map((p) => p.brand))];

const ICONS = {
  solder: (
    <>
      <circle cx="32" cy="32" r="30" fill="#eef2ff" />
      <g stroke="#3b55e8" strokeWidth="2" fill="none" strokeLinecap="round">
        <path d="M18 46l16-16" />
        <path d="M34 30l9-9 4 4-9 9" />
        <path d="M44 18l3 3" />
        <circle cx="16" cy="48" r="3" fill="#3b55e8" stroke="none" />
      </g>
    </>
  ),
  meter: (
    <>
      <circle cx="32" cy="32" r="30" fill="#fef3e7" />
      <g stroke="#e07a1f" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <rect x="18" y="16" width="28" height="34" rx="4" />
        <circle cx="32" cy="28" r="8" />
        <path d="M32 28l4-5" />
        <line x1="24" y1="42" x2="24" y2="46" />
        <line x1="32" y1="42" x2="32" y2="46" />
        <line x1="40" y1="42" x2="40" y2="46" />
      </g>
    </>
  ),
  screwdriver: (
    <>
      <circle cx="32" cy="32" r="30" fill="#e9f9f1" />
      <g stroke="#16a34a" strokeWidth="2" fill="none" strokeLinecap="round">
        <path d="M22 42l14-14" />
        <path d="M40 24l-4-4-6 6 4 4z" />
        <rect x="40" y="14" width="10" height="10" rx="2" />
        <path d="M18 46l4-4" />
      </g>
    </>
  ),
  wirestrip: (
    <>
      <circle cx="32" cy="32" r="30" fill="#fdeef0" />
      <g stroke="#d6336c" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 20l10 10-6 14-8-8 14-6 10 10" />
        <circle cx="44" cy="44" r="3" />
      </g>
    </>
  ),
  helpinghands: (
    <>
      <circle cx="32" cy="32" r="30" fill="#eaf6fb" />
      <g stroke="#1c7ed6" strokeWidth="2" fill="none" strokeLinecap="round">
        <rect x="16" y="42" width="32" height="8" rx="2" />
        <path d="M22 42V28a4 4 0 0 1 8 0v6" />
        <path d="M42 42V24a4 4 0 0 0-8 0v10" />
        <circle cx="32" cy="20" r="5" />
      </g>
    </>
  ),
  gluegun: (
    <>
      <circle cx="32" cy="32" r="30" fill="#f5f0fb" />
      <g stroke="#7c4dd6" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 36l16-10 6 4-14 16z" />
        <rect x="38" y="16" width="10" height="14" rx="2" />
        <path d="M20 38l-4 8" />
      </g>
    </>
  ),
  desolder: (
    <>
      <circle cx="32" cy="32" r="30" fill="#eef2ff" />
      <g stroke="#3b55e8" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <rect x="26" y="14" width="12" height="22" rx="6" />
        <path d="M32 36v12" />
        <path d="M24 48h16" />
      </g>
    </>
  ),
  toolkit: (
    <>
      <circle cx="32" cy="32" r="30" fill="#fef3e7" />
      <g stroke="#e07a1f" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <rect x="14" y="26" width="36" height="20" rx="3" />
        <path d="M24 26v-6a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v6" />
        <line x1="14" y1="34" x2="50" y2="34" />
      </g>
    </>
  ),
  crimp: (
    <>
      <circle cx="32" cy="32" r="30" fill="#e9f9f1" />
      <g stroke="#16a34a" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 18l14 14" />
        <path d="M44 18L30 32" />
        <path d="M30 32l-12 12 4 4 12-12" />
        <circle cx="40" cy="44" r="2" />
      </g>
    </>
  ),
  wriststrap: (
    <>
      <circle cx="32" cy="32" r="30" fill="#fdeef0" />
      <g stroke="#d6336c" strokeWidth="2" fill="none" strokeLinecap="round">
        <circle cx="26" cy="30" r="10" />
        <path d="M36 36l12 12" />
        <circle cx="49" cy="49" r="3" />
      </g>
    </>
  ),
  tweezers: (
    <>
      <circle cx="32" cy="32" r="30" fill="#eaf6fb" />
      <g stroke="#1c7ed6" strokeWidth="2" fill="none" strokeLinecap="round">
        <path d="M26 16l4 26-4 6" />
        <path d="M38 16l-4 26 4 6" />
        <path d="M26 16h12" />
      </g>
    </>
  ),
  hotair: (
    <>
      <circle cx="32" cy="32" r="30" fill="#f5f0fb" />
      <g stroke="#7c4dd6" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <rect x="14" y="22" width="20" height="12" rx="3" />
        <path d="M34 28h6l8-6" />
        <path d="M38 38c2 2 2 4 0 6M44 38c2 2 2 4 0 6" />
      </g>
    </>
  ),
};

function inr(n) {
  return "₹" + n.toLocaleString("en-IN");
}

function Stars({ rating }) {
  const full = Math.round(rating);
  return (
    <span className="text-[#f5a623] text-xs tracking-wider">
      {"★".repeat(full)}
      {"☆".repeat(5 - full)}
    </span>
  );
}

function HeartIcon({ filled }) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill={filled ? "#e11d48" : "none"} stroke={filled ? "#e11d48" : "#9aa3ba"} strokeWidth="1.8">
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
    </svg>
  );
}

function ProductCard({ p }) {
  const [added, setAdded] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const off = Math.round((1 - p.price / p.old) * 100);

  return (
    <div className="group bg-white border border-[#e6e9f1] rounded-2xl overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(16,24,43,0.10)]">
      <div className="relative h-44 flex items-center justify-center bg-gradient-to-b from-[#fafbff] to-white">
        <span className="absolute top-3 left-3 bg-[#e11d48] text-white text-[11px] font-bold px-2 py-1 rounded-md shadow-sm">
          -{off}%
        </span>
        <button
          onClick={() => setWishlisted((w) => !w)}
          aria-label="Add to wishlist"
          className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white border border-[#e6e9f1] flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
        >
          <HeartIcon filled={wishlisted} />
        </button>
        <svg viewBox="0 0 64 64" className="w-[72px] h-[72px] transition-transform duration-200 group-hover:scale-105">
          {ICONS[p.icon]}
        </svg>
      </div>

      <div className="px-4 pb-4 pt-3.5 flex flex-col gap-1.5 flex-1">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-[#6b7280] uppercase tracking-wide font-semibold">
            {p.brand}
          </span>
          <span
            className={`text-[11px] font-semibold ${
              p.stock === "In Stock" ? "text-green-600" : "text-amber-600"
            }`}
          >
            {p.stock}
          </span>
        </div>

        <div className="text-sm font-semibold text-[#1c2541] leading-snug min-h-[38px]">
          {p.title}
        </div>

        <div className="flex items-center gap-1.5 text-xs text-[#6b7280]">
          <Stars rating={p.rating} /> {p.rating} ({p.reviews})
        </div>

        <div className="flex items-baseline gap-2 mt-0.5">
          <span className="text-[17px] font-extrabold text-[#10182b]">{inr(p.price)}</span>
          <span className="text-[13px] text-[#6b7280] line-through">{inr(p.old)}</span>
          <span className="text-xs text-green-600 font-semibold">{off}% off</span>
        </div>

        <div className="text-[11px] text-[#6b7280]">Free Delivery · 3–5 days</div>

        <button
          onClick={() => {
            setAdded(true);
            setTimeout(() => setAdded(false), 1400);
          }}
          className={`mt-2.5 flex items-center justify-center gap-2 rounded-lg py-2.5 text-[13px] font-semibold text-white transition-colors ${
            added ? "bg-green-600" : "bg-[#10182b] hover:bg-[#3b55e8]"
          }`}
        >
          {added ? "Added ✓" : (
            <>
              <CartIcon /> Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function FilterSection({ title, children }) {
  return (
    <div className="border-b border-[#e6e9f1] py-5 first:pt-0 last:border-b-0">
      <h3 className="text-[13px] font-bold text-[#10182b] uppercase tracking-wide mb-3">
        {title}
      </h3>
      {children}
    </div>
  );
}

function Checkbox({ label, checked, onChange, count }) {
  return (
    <label className="flex items-center justify-between gap-2 text-sm text-[#374151] py-1 cursor-pointer select-none">
      <span className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="w-4 h-4 rounded border-[#cbd3e6] text-[#3b55e8] focus:ring-[#3b55e8]"
        />
        {label}
      </span>
      {count !== undefined && <span className="text-xs text-[#9aa3ba]">{count}</span>}
    </label>
  );
}

export default function ToolsPage() {
  const [category, setCategory] = useState("All");
  const [priceBands, setPriceBands] = useState([]);
  const [brands, setBrands] = useState([]);
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState("popularity");

  const togglePriceBand = (id) =>
    setPriceBands((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  const toggleBrand = (b) =>
    setBrands((s) => (s.includes(b) ? s.filter((x) => x !== b) : [...s, b]));
  const clearFilters = () => {
    setCategory("All");
    setPriceBands([]);
    setBrands([]);
    setMinRating(0);
  };

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      if (category !== "All" && p.category !== category) return false;
      if (brands.length && !brands.includes(p.brand)) return false;
      if (priceBands.length) {
        const matches = priceBands.some((id) =>
          PRICE_BANDS.find((b) => b.id === id).test(p.price)
        );
        if (!matches) return false;
      }
      if (p.rating < minRating) return false;
      return true;
    });

    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);

    return list;
  }, [category, priceBands, brands, minRating, sort]);

  const activeFilterCount = priceBands.length + brands.length + (minRating > 0 ? 1 : 0);

  return (
    <main className="bg-[#f3f5f9] min-h-screen">
      {/* Promo strip */}
      <div className="bg-[#10182b] text-white text-center text-[13px] py-2 px-4">
        Up to 30% off on Workbench Tools — limited stock
      </div>

      {/* Breadcrumb */}
      <div className="max-w-[1280px] mx-auto px-6 pt-5 text-[13px] text-[#6b7280] flex items-center gap-1.5">
        <span>Home</span>
        <span>›</span>
        <span className="font-semibold text-[#1c2541]">Tools</span>
      </div>

      {/* Page header */}
      <div className="max-w-[1280px] mx-auto px-6 mt-3.5">
        <h1 className="text-[28px] font-extrabold text-[#10182b]">
          Workbench Tools & Equipment
        </h1>
        <p className="mt-1.5 text-sm text-[#6b7280] max-w-[560px]">
          Soldering, measuring and repair tools for makers — everything you
          need on the bench, picked for reliability and value.
        </p>
      </div>

      {/* Category tabs */}
      <div className="max-w-[1280px] mx-auto px-6 mt-5 flex gap-2 flex-wrap">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-4 py-2 rounded-full text-[13px] font-medium border transition-colors ${
              category === c
                ? "bg-[#10182b] border-[#10182b] text-white"
                : "bg-white border-[#e6e9f1] text-[#374151] hover:border-[#3b55e8] hover:text-[#3b55e8]"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Body: sidebar + grid */}
      <div className="max-w-[1280px] mx-auto px-6 mt-6 mb-16 flex gap-7 items-start">
        {/* Sidebar */}
        <aside className="hidden lg:block w-[240px] shrink-0 bg-white border border-[#e6e9f1] rounded-2xl p-5 sticky top-5">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-sm font-bold text-[#10182b]">Filters</h2>
            {activeFilterCount > 0 && (
              <button onClick={clearFilters} className="text-xs text-[#3b55e8] font-semibold hover:underline">
                Clear all
              </button>
            )}
          </div>

          <FilterSection title="Price">
            {PRICE_BANDS.map((b) => (
              <Checkbox
                key={b.id}
                label={b.label}
                checked={priceBands.includes(b.id)}
                onChange={() => togglePriceBand(b.id)}
              />
            ))}
          </FilterSection>

          <FilterSection title="Brand">
            {BRANDS.map((b) => (
              <Checkbox
                key={b}
                label={b}
                checked={brands.includes(b)}
                onChange={() => toggleBrand(b)}
                count={products.filter((p) => p.brand === b).length}
              />
            ))}
          </FilterSection>

          <FilterSection title="Rating">
            {[4.5, 4, 3].map((r) => (
              <label key={r} className="flex items-center gap-2 text-sm text-[#374151] py-1 cursor-pointer">
                <input
                  type="radio"
                  name="rating"
                  checked={minRating === r}
                  onChange={() => setMinRating(minRating === r ? 0 : r)}
                  className="w-4 h-4 text-[#3b55e8] focus:ring-[#3b55e8]"
                />
                {r}★ & above
              </label>
            ))}
          </FilterSection>
        </aside>

        {/* Grid column */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <span className="text-[13px] text-[#6b7280]">
              {filtered.length} of {products.length} products
            </span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="border border-[#e6e9f1] bg-white rounded-lg px-3 py-2 text-[13px] text-[#1c2541]"
            >
              <option value="popularity">Sort: Popularity</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Rating</option>
            </select>
          </div>

          {filtered.length === 0 ? (
            <div className="bg-white border border-[#e6e9f1] rounded-2xl py-16 text-center text-sm text-[#6b7280]">
              No tools match these filters.{" "}
              <button onClick={clearFilters} className="text-[#3b55e8] font-semibold hover:underline">
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((p) => (
                <ProductCard key={p.id} p={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}