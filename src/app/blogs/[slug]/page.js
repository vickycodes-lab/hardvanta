import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ChevronRight, Calendar, User } from "lucide-react";
import { imageSrc } from "@/utils/imageSrc";

export const dynamic = "force-dynamic";

export default async function BlogDetailPage({ params }) {
  const { slug } = await params;
  const { prisma } = await import("@/lib/prisma");

  const blog = await prisma.blog.findUnique({ where: { slug } });
  if (!blog || !blog.published) notFound();

  // Fire-and-forget view counter.
  prisma.blog.update({ where: { slug }, data: { views: { increment: 1 } } }).catch(() => {});

  const related = await prisma.blog.findMany({
    where: { published: true, category: blog.category, slug: { not: slug } },
    take: 3,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="bg-navy text-white">
        <div className="container-page py-8">
          <nav className="flex items-center gap-1 text-sm text-silver">
            <Link href="/" className="hover:text-royal-light">Home</Link>
            <ChevronRight size={14} />
            <Link href="/blogs" className="hover:text-royal-light">Blogs</Link>
            <ChevronRight size={14} />
            <span className="line-clamp-1 text-white">{blog.title}</span>
          </nav>
        </div>
      </div>

      <div className="container-page py-10">
        <div className="mx-auto max-w-3xl">

          <span className="inline-block rounded-full bg-cloud px-3 py-1 text-xs font-semibold text-royal">
            {blog.category}
          </span>
          <h1 className="mt-3 text-2xl font-bold text-navy sm:text-3xl">{blog.title}</h1>

          <div className="mt-3 flex items-center gap-4 text-sm text-silver-dark">
            <span className="flex items-center gap-1.5">
              <User size={14} /> {blog.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar size={14} />
              {new Date(blog.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>

          <div className="relative mt-6 aspect-[16/9] w-full overflow-hidden rounded-xl bg-cloud">
            <Image
              src={imageSrc(blog.coverImage)}
              alt={blog.title}
              fill
              sizes="768px"
              className="object-cover"
              priority
            />
          </div>

          {/* Content — stored as plain text/markdown-ish paragraphs */}
          <div className="prose-info mt-8 space-y-4 text-sm leading-relaxed text-ink/80">
            {blog.content.split("\n").filter(Boolean).map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mx-auto mt-14 max-w-5xl">
            <h2 className="mb-5 text-xl font-bold text-navy">More in {blog.category}</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {related.map((b) => (
                <Link
                  key={b.id}
                  href={`/blogs/${b.slug}`}
                  className="group overflow-hidden rounded-xl border border-silver-light bg-white transition-shadow hover:shadow-card-hover"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-cloud">
                    <Image
                      src={imageSrc(b.coverImage)}
                      alt={b.title}
                      fill
                      sizes="33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="line-clamp-2 text-sm font-bold text-navy group-hover:text-royal transition-colors">
                      {b.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}