import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Star, ChevronRight, Truck, ShieldCheck, RotateCcw } from "lucide-react";
import { getProductById, getRelatedProducts } from "@/lib/queries";
import { formatPrice } from "@/utils/formatPrice";
import { imageSrc } from "@/utils/imageSrc";
import ProductGrid from "@/components/products/ProductGrid";
import AddToCart from "@/components/products/AddToCart";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const product = await getProductById(params.id);
  return { title: product ? `${product.name} — hardvanta` : "Product — hardvanta" };
}

export default async function ProductDetailPage({ params }) {
  const product = await getProductById(params.id);
  if (!product) notFound();

  const related = await getRelatedProducts(product.category, product.id, 4);
  const price = product.salePrice ?? product.price;
  const hasDiscount = product.salePrice != null;
  const discountPct = hasDiscount
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  return (
    <div className="container-page py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1 text-sm text-silver-dark">
        <Link href="/" className="hover:text-royal">Home</Link>
        <ChevronRight size={14} />
        <Link href="/products" className="hover:text-royal">Products</Link>
        <ChevronRight size={14} />
        <Link href={`/products?category=${product.category}`} className="hover:text-royal">
          {product.category}
        </Link>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden rounded-2xl border border-silver-light bg-white">
          <Image
            src={imageSrc(product.image)}
            alt={product.name}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
            priority
          />
          {hasDiscount && (
            <span className="absolute left-4 top-4 rounded-md bg-royal px-3 py-1 text-sm font-bold text-white">
              -{discountPct}%
            </span>
          )}
        </div>

        {/* Info */}
        <div>
          <span className="text-xs font-semibold uppercase tracking-wide text-silver-dark">
            {product.brand}
          </span>
          <h1 className="mt-1 text-2xl font-bold text-navy sm:text-3xl">
            {product.name}
          </h1>

          <div className="mt-3 flex items-center gap-2 text-sm">
            <span className="inline-flex items-center gap-1 rounded bg-green-50 px-2 py-0.5 font-semibold text-green-700">
              <Star size={14} className="fill-green-600 text-green-600" />
              {product.rating}
            </span>
            <span className="text-silver-dark">
              {product.reviewCount} ratings
            </span>
          </div>

          <div className="mt-5 flex items-end gap-3">
            <span className="text-3xl font-bold text-navy">
              {formatPrice(price)}
            </span>
            {hasDiscount && (
              <span className="mb-1 text-lg text-silver-dark line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          <p className="mt-1 text-sm font-medium">
            {product.stock > 0 ? (
              <span className="text-green-600">In stock ({product.stock} available)</span>
            ) : (
              <span className="text-red-500">Out of stock</span>
            )}
          </p>

          <p className="mt-5 leading-relaxed text-ink/80">
            {product.description}
          </p>

          <div className="mt-8">
            <AddToCart product={product} />
          </div>

          {/* Trust badges */}
          <div className="mt-8 grid grid-cols-3 gap-4 border-t border-silver-light pt-6 text-center text-xs text-silver-dark">
            {[
              [Truck, "Fast delivery"],
              [ShieldCheck, "Genuine products"],
              [RotateCcw, "7-day returns"],
            ].map(([Icon, label], i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <Icon size={20} className="text-royal" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-xl font-bold text-navy">Related Products</h2>
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}
