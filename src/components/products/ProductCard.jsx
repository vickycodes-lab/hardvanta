"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingCart } from "lucide-react";
import { formatPrice } from "@/utils/formatPrice";
import { imageSrc } from "@/utils/imageSrc";
import { useCart } from "@/context/CartContext";

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const price = product.salePrice ?? product.price;
  const hasDiscount = product.salePrice != null;
  const discountPct = hasDiscount
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-silver-light bg-white shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover">
      <Link href={`/products/${product.id}`} className="relative block">
        <div className="relative aspect-square overflow-hidden bg-cloud">
          <Image
            src={imageSrc(product.image)}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {hasDiscount && (
            <span className="absolute left-2 top-2 rounded-md bg-royal px-2 py-1 text-xs font-bold text-white">
              -{discountPct}%
            </span>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <span className="mb-1 text-xs font-medium uppercase tracking-wide text-silver-dark">
          {product.brand}
        </span>
        <Link href={`/products/${product.id}`}>
          <h3 className="mb-2 line-clamp-2 text-sm font-semibold text-navy hover:text-royal">
            {product.name}
          </h3>
        </Link>

        <div className="mb-3 flex items-center gap-1 text-xs text-silver-dark">
          <Star size={14} className="fill-yellow-400 text-yellow-400" />
          <span className="font-medium text-navy">{product.rating}</span>
          <span>({product.reviewCount})</span>
        </div>

        <div className="mt-auto flex items-end justify-between">
          <div>
            <span className="text-lg font-bold text-navy">
              {formatPrice(price)}
            </span>
            {hasDiscount && (
              <span className="ml-2 text-xs text-silver-dark line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
          <button
            onClick={() => addItem(product)}
            aria-label="Add to cart"
            className="rounded-lg bg-royal p-2 text-white transition-colors hover:bg-royal-dark"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
