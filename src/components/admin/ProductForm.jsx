"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Upload } from "lucide-react";
import Button from "@/components/ui/Button";
import { imageSrc } from "@/utils/imageSrc";

const NEW_CATEGORY = "__new__";

export default function ProductForm({ product }) {
  const router = useRouter();
  const isEdit = Boolean(product);

  const [form, setForm] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price ?? "",
    salePrice: product?.salePrice ?? "",
    stock: product?.stock ?? 0,
    category: product?.category || "",
    brand: product?.brand || "",
    image: product?.image || "",
    featured: product?.featured || false,
  });
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [error, setError] = useState("");
  const [uploadMsg, setUploadMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Load existing categories from the database.
  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => {
        const list = data.categories || [];
        setCategories(list);
        // Default the select to the first existing category when adding new.
        setForm((f) =>
          f.category || list.length === 0
            ? f
            : { ...f, category: list[0].slug }
        );
      })
      .catch(() => {});
  }, []);

  const creatingCategory = form.category === NEW_CATEGORY;

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleFileUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setUploadMsg("");
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (res.status === 403) {
          throw new Error(
            "You're not signed in as an admin. Log out and log back in with your admin account, then try again."
          );
        }
        throw new Error(data.error || `Upload failed (HTTP ${res.status}).`);
      }
      if (!data.url) throw new Error("Upload returned no image URL.");
      set("image", data.url);
      setUploadMsg("✓ Photo uploaded! You can create the product now.");
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      e.target.value = ""; // let them re-pick the same file if needed
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!form.image) {
      setError("Please upload a photo (or paste an image URL) before saving.");
      return;
    }
    setLoading(true);

    try {
      let category = form.category;

      // If the admin is creating a new category, save it first and use its slug.
      if (creatingCategory) {
        const name = newCategory.trim();
        if (!name) {
          setError("Please enter a name for the new category.");
          setLoading(false);
          return;
        }
        const catRes = await fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name }),
        });
        const catData = await catRes.json();
        if (!catRes.ok) {
          setError(catData.error || "Could not create category.");
          setLoading(false);
          return;
        }
        category = catData.category.slug;
      }

      const url = isEdit ? `/api/products/${product.id}` : "/api/products";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, category }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not save product.");
        setLoading(false);
        return;
      }
      router.push("/admin/products");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
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
          <select
            className={inputCls}
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
          >
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
            <option value={NEW_CATEGORY}>+ Create new category…</option>
          </select>
          {creatingCategory && (
            <input
              className={`${inputCls} mt-2`}
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="New category name (e.g. Soldering Tools)"
              autoFocus
            />
          )}
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
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-royal bg-royal px-4 py-2 text-sm font-semibold text-white hover:bg-royal-dark">
            <Upload size={16} />
            {uploading ? "Uploading…" : "Upload photo from device"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploading}
              onChange={handleFileUpload}
            />
          </label>
        </div>
        {uploadMsg && (
          <p className="mt-2 rounded-lg bg-green-50 px-3 py-2 text-sm font-medium text-green-700">
            {uploadMsg}
          </p>
        )}
        <input
          className={`${inputCls} mt-2`}
          value={form.image}
          onChange={(e) => set("image", e.target.value)}
          placeholder="Auto-fills after upload — or paste an image URL here"
        />
        <p className="mt-1 text-xs text-silver-dark">
          Tip: click “Upload photo from device” to use a photo from your computer/phone.
          You do not need a URL.
        </p>
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
