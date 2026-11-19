import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { useStore } from "@/lib/store";
import { GALLERY_CATEGORIES } from "@/lib/types";
import { SmartImage } from "@/components/site/SmartImage";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery | Aryan's Family Restaurant & Bar" },
      { name: "description", content: "Photos of Aryan's dining room, food, family tables, bar, sports nights and live entertainment." },
      { property: "og:title", content: "Inside Aryan's — Photo Gallery" },
      { property: "og:description", content: "Interiors, dishes, the bar, match nights and celebrations at Aryan's, Pune." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Gallery,
});

const RATIOS = ["aspect-[4/5]", "aspect-[4/3]", "aspect-square", "aspect-[3/4]", "aspect-[16/11]"];

function Gallery() {
  const { data } = useStore();
  const [cat, setCat] = useState<string>("All");
  const [index, setIndex] = useState<number | null>(null);

  const images = useMemo(() => (cat === "All" ? data.gallery : data.gallery.filter((g) => g.category === cat)), [data.gallery, cat]);
  const current = index !== null ? images[index] : null;

  const step = useCallback(
    (dir: number) => setIndex((i) => (i === null ? i : (i + dir + images.length) % images.length)),
    [images.length],
  );

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIndex(null);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [index, step]);

  return (
    <>
      <section className="container-lux pb-10 pt-36 md:pt-44">
        <div className="grid items-end gap-8 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Gallery</p>
            <h1 className="mt-4 text-6xl text-foreground md:text-8xl">
              Moments at <em className="text-gradient-gold">Aryan's</em>
            </h1>
          </div>
          <p className="max-w-md text-lg text-muted-foreground lg:justify-self-end">
            Our dining room, our kitchen's favourites, the bar after dark and the nights that bring everyone together.
          </p>
        </div>
        <div className="hairline mt-12" />
        <div className="no-scrollbar -mx-1 mt-8 flex gap-2 overflow-x-auto px-1">
          {["All", ...GALLERY_CATEGORIES].map((c) => (
            <button key={c} className="chip" data-active={cat === c} onClick={() => setCat(c)}>
              {c}
              <span className="opacity-60">
                {c === "All" ? data.gallery.length : data.gallery.filter((g) => g.category === c).length}
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="container-lux pb-24">
        {images.length === 0 ? (
          <p className="py-20 text-center text-muted-foreground">No images in this category yet.</p>
        ) : (
          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
            {images.map((g, i) => (
              <button
                key={g.id}
                onClick={() => setIndex(i)}
                className="img-zoom group relative mb-4 block w-full animate-fade-in overflow-hidden rounded-xl border border-border text-left break-inside-avoid"
                aria-label={`Open ${g.title}`}
              >
                <SmartImage src={g.image} alt={g.title} className={cn("w-full object-cover", RATIOS[i % RATIOS.length])} />
                <div className="absolute inset-0 overlay-card opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="absolute inset-x-0 bottom-0 translate-y-3 p-5 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  <p className="text-[0.62rem] uppercase tracking-[0.2em] text-gold">{g.category}</p>
                  <p className="mt-1 font-display text-2xl text-foreground">{g.title}</p>
                </div>
                <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full glass text-champagne opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <Expand className="h-4 w-4" />
                </span>
              </button>
            ))}
          </div>
        )}
      </section>

      {current && (
        <div className="fixed inset-0 z-[90] flex animate-fade-in flex-col overlay-scrim backdrop-blur-md" role="dialog" aria-modal="true" aria-label={current.title}>
          <div className="flex items-center justify-between px-4 py-4 md:px-8">
            <p className="text-sm text-muted-foreground">
              {index! + 1} / {images.length}
            </p>
            <button onClick={() => setIndex(null)} aria-label="Close" className="rounded-full border border-border-strong p-2.5 text-champagne transition-colors hover:bg-gold hover:text-primary-foreground">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="relative flex flex-1 items-center justify-center px-4 md:px-20" onClick={() => setIndex(null)}>
            <SmartImage
              key={current.id}
              src={current.image}
              alt={current.title}
              loading="eager"
              onClick={(e) => e.stopPropagation()}
              className="max-h-[72vh] max-w-full animate-scale-in rounded-lg object-contain shadow-[var(--shadow-lux)]"
            />
            <button
              onClick={(e) => { e.stopPropagation(); step(-1); }}
              aria-label="Previous image"
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full border border-border-strong glass p-3 text-champagne transition-colors hover:bg-gold hover:text-primary-foreground md:left-6"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); step(1); }}
              aria-label="Next image"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full border border-border-strong glass p-3 text-champagne transition-colors hover:bg-gold hover:text-primary-foreground md:right-6"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          <div className="px-4 pb-8 pt-4 text-center">
            <p className="eyebrow">{current.category}</p>
            <p className="mt-2 font-display text-3xl text-foreground">{current.title}</p>
            {current.caption && <p className="mt-1 text-sm text-muted-foreground">{current.caption}</p>}
          </div>
        </div>
      )}
    </>
  );
}
