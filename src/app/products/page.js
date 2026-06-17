import ProductGrid from "@/components/products/ProductGrid";
import {
  getAllProducts,
  getProductsByCategory,
  getCategories,
  searchProducts,
} from "@/lib/queries";
import Link from "next/link";

export const metadata = { title: "All Products — hardvanta" };
export const dynamic = "force-dynamic";

export default async function ProductsPage({ searchParams }) {
  const activeCat = searchParams?.category;
  const q = searchParams?.q?.trim();

  const [list, categories] = await Promise.all([
    q
      ? searchProducts(q)
      : activeCat
        ? getProductsByCategory(activeCat)
        : getAllProducts(),
    getCategories(),
  ]);
  const catName = q
    ? `Search results for “${q}”`
    : categories.find((c) => c.slug === activeCat)?.name ?? "All Products";

  return (
    <div className="container-page py-8">
      <div className="mb-6">
        <h1 className="heading-accent">{catName}</h1>
        <p className="mt-3 text-sm text-silver-dark">
          {list.length} product{list.length !== 1 ? "s" : ""} available
        </p>
      </div>

      {/* Category pills */}
      <div className="mb-8 flex flex-wrap gap-2">
        <Link
          href="/products"
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
            !activeCat
              ? "bg-royal text-white shadow-sm"
              : "border border-silver bg-white text-navy hover:border-royal hover:text-royal"
          }`}
        >
          All
        </Link>
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={`/products?category=${c.slug}`}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
              activeCat === c.slug
                ? "bg-royal text-white shadow-sm"
                : "border border-silver bg-white text-navy hover:border-royal hover:text-royal"
            }`}
          >
            {c.name}
          </Link>
        ))}
      </div>

      <ProductGrid products={list} />
    </div>
  );
}
