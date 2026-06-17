import Link from "next/link";
import Hero from "@/components/home/Hero";
import CategoryTiles from "@/components/home/CategoryTiles";
import GoogleReviews from "@/components/home/GoogleReviews";
import ProductGrid from "@/components/products/ProductGrid";
import { getFeaturedProducts, getDeals } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [featured, deals] = await Promise.all([
    getFeaturedProducts(),
    getDeals(4),
  ]);

  return (
    <>
      <Hero />
      <CategoryTiles />

      {/* Deals strip */}
      <section className="bg-white py-12">
        <div className="container-page">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="heading-accent">🔥 Hot Deals</h2>
            <Link href="/products" className="text-sm font-semibold text-royal hover:underline">
              View all
            </Link>
          </div>
          <ProductGrid products={deals} />
        </div>
      </section>

      {/* Featured products */}
      <section className="container-page py-12">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="heading-accent">Featured Products</h2>
          <Link href="/products" className="text-sm font-semibold text-royal hover:underline">
            Shop all
          </Link>
        </div>
        <ProductGrid products={featured} />
      </section>

      {/* Google reviews */}
      <GoogleReviews />

      {/* Promo banner */}
      <section className="container-page pb-12">
        <div className="flex flex-col items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-royal to-navy p-8 text-white sm:flex-row">
          <div>
            <h3 className="text-xl font-bold">Bulk &amp; Educational Orders</h3>
            <p className="text-sm text-silver-light">
              Special pricing for schools, colleges and makerspaces.
            </p>
          </div>
          <Link
            href="/products"
            className="rounded-lg bg-white px-6 py-3 font-semibold text-navy hover:bg-silver-light"
          >
            Get a Quote
          </Link>
        </div>
      </section>
    </>
  );
}
