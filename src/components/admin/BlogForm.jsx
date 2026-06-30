"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function BlogForm({ initial }) {
  const router = useRouter();
  const isEdit = Boolean(initial?.id);

  const [form, setForm] = useState({
    title: initial?.title || "",
    slug: initial?.slug || "",
    excerpt: initial?.excerpt || "",
    content: initial?.content || "",
    coverImage: initial?.coverImage || "",
    category: initial?.category || "General",
    author: initial?.author || "Hardvanta Team",
    published: initial?.published ?? true,
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function update(field, value) {
    setForm((f) => {
      const next = { ...f, [field]: value };
      // Auto-generate slug from title only if user hasn't edited it manually (new blogs only).
      if (field === "title" && !isEdit) {
        next.slug = slugify(value);
      }
      return next;
    });
  }

  async function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Upload failed.");
      update("coverImage", data.url);
    } catch (err) {
      setError(err?.message || "Could not upload image.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const url = isEdit ? `/api/blogs/${initial.id}` : "/api/blogs";
      const method = isEdit ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Could not save blog.");
      router.push("/admin/blogs");
      router.refresh();
    } catch (err) {
      setError(err?.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-5 rounded-xl border border-silver-light bg-white p-6">

      <div>
        <label className="mb-1.5 block text-sm font-medium text-navy">Title *</label>
        <input
          required
          type="text"
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
          className="w-full rounded-lg border border-silver px-3.5 py-2.5 text-sm text-navy outline-none focus:border-royal"
          placeholder="e.g. Getting Started with ESP32"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-navy">Slug *</label>
        <input
          required
          type="text"
          value={form.slug}
          onChange={(e) => update("slug", slugify(e.target.value))}
          className="w-full rounded-lg border border-silver px-3.5 py-2.5 text-sm text-navy outline-none focus:border-royal"
          placeholder="getting-started-with-esp32"
        />
        <p className="mt-1 text-xs text-silver-dark">URL: /blogs/{form.slug || "..."}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-navy">Category</label>
          <input
            type="text"
            value={form.category}
            onChange={(e) => update("category", e.target.value)}
            className="w-full rounded-lg border border-silver px-3.5 py-2.5 text-sm text-navy outline-none focus:border-royal"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-navy">Author</label>
          <input
            type="text"
            value={form.author}
            onChange={(e) => update("author", e.target.value)}
            className="w-full rounded-lg border border-silver px-3.5 py-2.5 text-sm text-navy outline-none focus:border-royal"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-navy">Excerpt *</label>
        <textarea
          required
          rows={2}
          value={form.excerpt}
          onChange={(e) => update("excerpt", e.target.value)}
          className="w-full resize-none rounded-lg border border-silver px-3.5 py-2.5 text-sm text-navy outline-none focus:border-royal"
          placeholder="Short summary shown on the blog card"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-navy">Content *</label>
        <textarea
          required
          rows={10}
          value={form.content}
          onChange={(e) => update("content", e.target.value)}
          className="w-full rounded-lg border border-silver px-3.5 py-2.5 text-sm text-navy outline-none focus:border-royal"
          placeholder="Write the full blog content. Separate paragraphs with a blank line."
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-navy">Cover Image</label>
        {form.coverImage && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={form.coverImage} alt="Preview" className="mb-3 h-32 w-full rounded-lg object-cover" />
        )}
        <div className="flex items-center gap-3">
          <label className="flex cursor-pointer items-center gap-2 rounded-lg bg-royal px-4 py-2.5 text-sm font-semibold text-white hover:bg-royal-dark">
            {uploading && <Loader2 size={15} className="animate-spin" />}
            {uploading ? "Uploading..." : "Upload photo from device"}
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </label>
        </div>
        <input
          type="text"
          value={form.coverImage}
          onChange={(e) => update("coverImage", e.target.value)}
          className="mt-3 w-full rounded-lg border border-silver px-3.5 py-2.5 text-sm text-navy outline-none focus:border-royal"
          placeholder="Or paste an image URL"
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-navy">
        <input
          type="checkbox"
          checked={form.published}
          onChange={(e) => update("published", e.target.checked)}
          className="h-4 w-4 rounded border-silver text-royal focus:ring-royal"
        />
        Published (visible on the site)
      </label>

      {error && <p className="text-sm font-medium text-red-600">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-royal px-5 py-2.5 text-sm font-semibold text-white hover:bg-royal-dark disabled:opacity-60"
        >
          {saving ? "Saving..." : isEdit ? "Save changes" : "Create Blog"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/blogs")}
          className="rounded-lg border border-silver px-5 py-2.5 text-sm font-semibold text-navy hover:bg-cloud"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}