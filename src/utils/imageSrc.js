// next/image requires an absolute URL (http/https) or a root-relative path
// starting with "/". Admin-entered values are sometimes a bare filename
// (e.g. "Raspberry Pi 3 Model B.png"), which crashes the page. This normalizes
// any value to something next/image accepts, falling back to a placeholder.

const PLACEHOLDER = "/placeholder.svg";

export function imageSrc(value) {
  if (typeof value !== "string") return PLACEHOLDER;
  const v = value.trim();
  if (!v) return PLACEHOLDER;
  if (v.startsWith("http://") || v.startsWith("https://")) return v;
  if (v.startsWith("/")) return v;
  return PLACEHOLDER;
}
