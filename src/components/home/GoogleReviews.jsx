import { Star } from "lucide-react";
import { getGoogleReviews } from "@/lib/googleReviews";

function Stars({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={16}
          className={
            i <= Math.round(rating)
              ? "fill-yellow-400 text-yellow-400"
              : "text-silver"
          }
        />
      ))}
    </div>
  );
}

export default async function GoogleReviews() {
  const { rating, total, reviews } = await getGoogleReviews();

  return (
    <section className="bg-white py-12">
      <div className="container-page">
        <div className="mb-6 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="heading-accent">What our customers say</h2>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-navy">
              {rating.toFixed(1)}
            </span>
            <Stars rating={rating} />
            <span className="text-sm text-silver-dark">
              ({total} Google reviews)
            </span>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r, idx) => (
            <article
              key={idx}
              className="flex flex-col gap-3 rounded-xl border border-silver-light bg-cloud p-5 shadow-card"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-royal text-sm font-bold text-white">
                  {r.author.charAt(0).toUpperCase()}
                </span>
                <div>
                  <p className="text-sm font-semibold text-navy">{r.author}</p>
                  <p className="text-xs text-silver-dark">{r.relativeTime}</p>
                </div>
              </div>
              <Stars rating={r.rating} />
              <p className="text-sm leading-relaxed text-navy/80">{r.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
