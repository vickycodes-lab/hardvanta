import { PackageSearch } from "lucide-react";
import ProductCard from "./ProductCard";

export default function ProductGrid({ products }) {
  if (!products?.length) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-silver py-16 text-center">
        <PackageSearch size={40} className="text-silver-dark" />
        <p className="font-semibold text-navy">No products found</p>
        <p className="text-sm text-silver-dark">
          Try a different category or search term.
        </p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
