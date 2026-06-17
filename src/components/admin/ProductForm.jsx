"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Upload } from "lucide-react";
import Button from "@/components/ui/Button";
import { imageSrc } from "@/utils/imageSrc";

const CATEGORIES = [
  "modules-displays", "diy-kits", "3d-printers", "batteries", "motors",
  "drones", "ev-parts", "components", "dev-boards", "iot-wireless",
  "mechanical-tools", "sensors", "refurbished",
];

export default function ProductForm({ product }) {
  const router = useRouter();
  const isEdit = Boolean(product);

  const [form, setForm] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price ?? "",
    salePrice: product?.salePrice ?? "",
    stock: product?.stock ?? 0,
    category: product?.category || CATEGORIES[0],
    brand: product?.brand || "",
    image: product?.image || "",
    featured: product?.featured || false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleFileUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed.");
      set("image", data.url);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const url = isEdit ? `/api/products/${product.id}` : "/api/products";
    const method = isEdit ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Could not save product.");
      setLoading(false);
      return;
    }
    router.push("/admin/products");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-4 rounded-xl border border-silver-light bg-white p-6">
      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
      )}

      <L label="Name">
        <input className={inputCls} value={form.name} onChange={(e) => set("name", e.target.value)} required />
      </L>

      <L label="Description">
        <textarea className={inputCls} rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} required />
      </L>

      <div className="grid gap-4 sm:grid-cols-3">
        <L label="Price (₹)">
          <input type="number" className={inputCls} value={form.price} onChange={(e) => set("price", e.target.value)} required />
        </L>
        <L label="Sale Price (₹, optional)">
          <input type="number" className={inputCls} value={form.salePrice ?? ""} onChange={(e) => set("salePrice", e.target.value)} />
        </L>
        <L label="Stock">
          <input type="number" className={inputCls} value={form.stock} onChange={(e) => set("stock", e.target.value)} required />
        </L>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <L label="Brand">
          <input className={inputCls} value={form.brand} onChange={(e) => set("brand", e.target.value)} required />
        </L>
        <L label="Category">
          <select className={inputCls} value={form.category} onChange={(e) => set("category", e.target.value)}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </L>
      </div>

      <L label="Product Image">
        <div className="flex flex-wrap items-center gap-4">
          {form.image ? (
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-silver-light bg-cloud">
              <Image src={imageSrc(form.image)} alt="Preview" fill sizes="80px" className="object-cover" />
            </div>
          ) : (
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg border border-dashed border-silver-dark text-xs text-silver-dark">
              No image
            </div>
          )}
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-silver-dark px-4 py-2 text-sm font-semibold text-navy hover:border-royal hover:text-royal">
            <Upload size={16} />
            {uploading ? "Uploading…" : "Upload photo"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploading}
              onChange={handleFileUpload}
            />
          </label>
        </div>
        <input
          className={`${inputCls} mt-2`}
          value={form.image}
          onChange={(e) => set("image", e.target.value)}
          placeholder="…or paste an image URL"
          required
        />
      </L>

      <label className="flex items-center gap-2 text-sm text-navy">
        <input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} />
        Featured product (shows on homepage)
      </label>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving…" : isEdit ? "Save changes" : "Create product"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/products")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

const inputCls =
  "w-full rounded-lg border border-silver-dark px-3 py-2 text-sm outline-none focus:border-royal focus:ring-2 focus:ring-royal/30";

function L({ label, children }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-navy">{label}</label>
      {children}
    </div>
  );
}
