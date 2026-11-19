import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ChefHat, Leaf, Search, X } from "lucide-react";
import { useStore } from "@/lib/store";
import type { MenuItem } from "@/lib/types";
import { PageBanner, SectionHeading } from "@/components/site/bits";
import { DishCard, DishModal } from "@/components/site/DishCard";
import { cn } from "@/lib/utils";

interface MenuSearch {
  category?: string | undefined;
}

export const Route = createFileRoute("/menu")({
  validateSearch: (search: Record<string, unknown>): MenuSearch => ({
    category: typeof search["category"] === "string" && search["category"] ? search["category"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Our Menu | Aryan's Family Restaurant & Bar" },
      {
        name: "description",
        content: "Starters, tandoor, biryani, Indian main course, Indo-Chinese, desserts, beverages and the bar menu at Aryan's, Mundhwa, Pune.",
      },
      { property: "og:title", content: "The Aryan's Menu — Indian, Tandoor, Biryani & Bar" },
      { property: "og:description", content: "Browse every dish and drink with prices in INR, veg/non-veg markers and chef's specials." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MenuPage,
});

function MenuPage() {
  const { data } = useStore();
  const { category } = Route.useSearch();
  const navigate = useNavigate({ from: "/menu" });
  const [query, setQuery] = useState("");
  const [vegOnly, setVegOnly] = useState(false);
  const [viewing, setViewing] = useState<MenuItem | null>(null);

  const categories = useMemo(() => [...data.categories].sort((a, b) => a.order - b.order), [data.categories]);
  const active = categories.find((c) => c.slug === category);
  const catName = (id: string) => data.categories.find((c) => c.id === id)?.name;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const catIds = new Set(categories.map((c) => c.id));
    return data.menu.filter(
      (m) =>
        catIds.has(m.categoryId) &&
        (!active || m.categoryId === active.id) &&
        (!vegOnly || m.isVeg) &&
        (!q || m.name.toLowerCase().includes(q) || m.description.toLowerCase().includes(q)),
    );
  }, [data.menu, categories, active, vegOnly, query]);

  const grouped = categories
    .map((c) => ({ cat: c, items: filtered.filter((m) => m.categoryId === c.id) }))
    .filter((g) => g.items.length > 0);

  const specials = data.menu.filter((m) => m.isChefSpecial && categories.some((c) => c.id === m.categoryId));
  const showSpecials = !active && !query && !vegOnly && specials.length > 0;
  const setCategory = (slug?: string) => navigate({ search: { category: slug }, resetScroll: false });

  return (
    <>
      <PageBanner
        image="/images/menu-banner.jpg"
        eyebrow="Our Menu"
        title={<>A feast of <em className="text-gradient-gold">Indian flavours</em></>}
        description="From tandoor and biryani to Indo-Chinese and the bar — everything is made fresh. Prices in INR, taxes extra."
      />

      {/* Filter bar */}
      <div className="sticky top-[72px] z-30 border-y border-border glass">
        <div className="container-lux flex flex-col gap-3 py-4 lg:flex-row lg:items-center">
          <div className="relative lg:w-72">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gold" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search dishes or drinks…"
              aria-label="Search menu"
              className="input-lux !rounded-full !py-2.5 !pl-10 !pr-9"
            />
            {query && (
              <button aria-label="Clear search" onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-champagne">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="no-scrollbar -mx-1 flex flex-1 gap-2 overflow-x-auto px-1">
            <button className="chip" data-active={!active} onClick={() => setCategory(undefined)}>
              All
            </button>
            {categories.map((c) => (
              <button key={c.id} className="chip" data-active={active?.id === c.id} onClick={() => setCategory(c.slug)}>
                {c.name}
              </button>
            ))}
          </div>
          <button
            onClick={() => setVegOnly((v) => !v)}
            className="chip shrink-0 self-start lg:self-auto"
            data-active={vegOnly}
            aria-pressed={vegOnly}
          >
            <Leaf className="h-3.5 w-3.5" /> Veg only
          </button>
        </div>
      </div>

      {showSpecials && (
        <section className="bg-surface py-16 md:py-20">
          <div className="container-lux">
            <div className="flex items-center gap-3">
              <ChefHat className="h-6 w-6 text-gold" />
              <p className="eyebrow">Chef's Specials</p>
            </div>
            <div className="no-scrollbar -mx-5 mt-8 flex snap-x gap-5 overflow-x-auto px-5 pb-2 md:mx-0 md:px-0">
              {specials.map((m) => (
                <div key={m.id} className="w-[80%] shrink-0 snap-start sm:w-[45%] lg:w-[31%]">
                  <DishCard item={m} categoryName={catName(m.categoryId)} onView={() => setViewing(m)} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="container-lux py-16 md:py-20">
        {grouped.length === 0 && (
          <div className="mx-auto max-w-md py-20 text-center">
            <Search className="mx-auto h-10 w-10 text-gold-deep" />
            <h3 className="mt-5 text-3xl text-foreground">No dishes found</h3>
            <p className="mt-3 text-muted-foreground">Try a different search or category.</p>
            <button
              className="btn-outline-gold mt-8"
              onClick={() => {
                setQuery("");
                setVegOnly(false);
                setCategory(undefined);
              }}
            >
              Reset filters
            </button>
          </div>
        )}

        {grouped.map(({ cat, items }, gi) => (
          <section key={cat.id} className={cn(gi > 0 && "mt-20")} id={cat.slug}>
            <div className="flex flex-col gap-3 border-b border-border pb-6 md:flex-row md:items-end md:justify-between">
              <SectionHeading align="left" eyebrow={`${String(cat.order).padStart(2, "0")} · ${items.length} items`} title={cat.name} />
              <p className="max-w-sm text-sm text-muted-foreground md:text-right">{cat.description}</p>
            </div>
            {cat.id === "bar" && (
              <p className="mt-4 text-xs text-muted-foreground">Alcoholic beverages are served only to guests of legal drinking age. Please drink responsibly.</p>
            )}
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((m) => (
                <DishCard key={m.id} item={m} onView={() => setViewing(m)} />
              ))}
            </div>
          </section>
        ))}
      </div>

      <DishModal item={viewing} categoryName={viewing ? catName(viewing.categoryId) : undefined} onClose={() => setViewing(null)} />
    </>
  );
}
