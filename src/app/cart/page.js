"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/utils/formatPrice";
import { imageSrc } from "@/utils/imageSrc";

export default function CartPage() {
  const { items, updateQuantity, removeItem, total, count } = useCart();

  if (count === 0) {
    return (
      <div className="container-page flex flex-col items-center py-24 text-center">
        <ShoppingBag size={56} className="text-silver-dark" />
        <h1 className="mt-4 text-2xl font-bold text-navy">Your cart is empty</h1>
        <p className="mt-2 text-silver-dark">
          Add some components to get started.
        </p>
        <Link
          href="/products"
          className="mt-6 rounded-lg bg-royal px-6 py-3 font-semibold text-white hover:bg-royal-dark"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page py-8">
      <h1 className="mb-6 text-2xl font-bold text-navy">
        Shopping Cart ({count})
      </h1>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => {
            const price = item.salePrice ?? item.price;
            return (
              <div
                key={item.id}
                className="flex gap-4 rounded-xl border border-silver-light bg-white p-4"
              >
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-cloud">
                  <Image
                    src={imageSrc(item.image)}
                    alt={item.name}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col">
                  <h3 className="line-clamp-2 text-sm font-semibold text-navy">
                    {item.name}
                  </h3>
                  <span className="text-xs text-silver-dark">{item.brand}</span>
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="rounded border border-silver p-1 hover:border-royal"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="rounded border border-silver p-1 hover:border-royal"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <span className="font-bold text-navy">
                      {formatPrice(price * item.quantity)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="self-start text-silver-dark hover:text-red-500"
                  aria-label="Remove"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="h-fit rounded-xl border border-silver-light bg-white p-6">
          <h2 className="mb-4 text-lg font-bold text-navy">Order Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-silver-dark">Subtotal</span>
              <span className="font-semibold">{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-silver-dark">Shipping</span>
              <span className="font-semibold text-green-600">
                {total > 999 ? "Free" : formatPrice(49)}
              </span>
            </div>
          </div>
          <div className="my-4 border-t border-silver-light" />
          <div className="flex justify-between text-base font-bold text-navy">
            <span>Total</span>
            <span>{formatPrice(total + (total > 999 ? 0 : 49))}</span>
          </div>
          <Link
            href="/checkout"
            className="mt-6 block w-full rounded-lg bg-royal py-3 text-center font-semibold text-white hover:bg-royal-dark"
          >
            Proceed to Checkout
          </Link>
          <Link
            href="/products"
            className="mt-3 block text-center text-sm text-royal hover:underline"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
