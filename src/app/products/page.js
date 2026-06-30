import ProductGrid from "@/components/products/ProductGrid";
import {
  getAllProducts,
  getProductsByCategory,
  getCategories,
  searchProducts,
} from "@/lib/queries";

export const metadata = { title: "All Products — hardvanta" };
export const dynamic = "force-dynamic";

export default async function ProductsPage({ searchParams }) {
  const activeCat = searchParams?.category;
  const q = searchParams?.q?.trim();
  const [list] = await Promise.all([
    q
      ? searchProducts(q)
      : activeCat
        ? getProductsByCategory(activeCat)
        : getAllProducts(),
    getCategories(),
  ]);

  return (
    <div className="container-page py-8">
      <ProductGrid products={list} />
    </div>
  );
}