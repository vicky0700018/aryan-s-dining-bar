import { Link } from "@tanstack/react-router";
import { ChefHat, Star } from "lucide-react";
import type { MenuItem } from "@/lib/types";
import { formatINR } from "@/lib/format";
import { SmartImage } from "./SmartImage";
import { VegMark } from "./bits";
import { Modal } from "./Modal";

export function DishCard({ item, categoryName, onView }: { item: MenuItem; categoryName?: string; onView: () => void }) {
  return (
    <article className="group card-lux flex flex-col overflow-hidden transition-transform duration-500 hover:-translate-y-1.5">
      <div className="img-zoom relative aspect-[4/3]">
        <SmartImage src={item.image} alt={item.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 overlay-card opacity-60" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {item.isChefSpecial && (
            <span className="inline-flex items-center gap-1 rounded-full bg-gold px-2.5 py-1 text-[0.65rem] font-medium uppercase tracking-[0.14em] text-primary-foreground">
              <ChefHat className="h-3 w-3" /> Chef's Special
            </span>
          )}
          {item.isFeatured && !item.isChefSpecial && (
            <span className="inline-flex items-center gap-1 rounded-full border border-border-strong glass px-2.5 py-1 text-[0.65rem] font-medium uppercase tracking-[0.14em] text-champagne">
              <Star className="h-3 w-3" /> Featured
            </span>
          )}
        </div>
        {!item.available && (
          <span className="absolute bottom-3 left-3 rounded-full glass px-2.5 py-1 text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">
            Currently unavailable
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-2">
            <VegMark isVeg={item.isVeg} className="mt-1.5" />
            <h3 className="text-2xl leading-tight text-foreground">{item.name}</h3>
          </div>
          <span className="shrink-0 font-display text-2xl text-champagne">{formatINR(item.price)}</span>
        </div>
        {categoryName && <p className="mt-1 pl-6 text-[0.68rem] uppercase tracking-[0.2em] text-gold-deep">{categoryName}</p>}
        <p className="mt-3 line-clamp-2 flex-1 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
        <button onClick={onView} className="btn-link-gold mt-5 self-start">
          View Details
        </button>
      </div>
    </article>
  );
}

export function DishModal({
  item,
  categoryName,
  onClose,
}: {
  item: MenuItem | null;
  categoryName?: string;
  onClose: () => void;
}) {
  return (
    <Modal open={!!item} onClose={onClose} size="lg" bare>
      {item && (
        <div className="grid md:grid-cols-2">
          <SmartImage src={item.image} alt={item.name} className="aspect-[4/3] h-full w-full object-cover md:aspect-auto" />
          <div className="flex flex-col p-6 md:p-8">
            <p className="eyebrow">{categoryName ?? "Menu"}</p>
            <h3 className="mt-3 text-4xl text-foreground">{item.name}</h3>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <VegMark isVeg={item.isVeg} /> {item.isVeg ? "Vegetarian" : "Non-Vegetarian"}
              </span>
              {item.isChefSpecial && <span className="text-champagne">· Chef's Special</span>}
              {item.isFeatured && <span className="text-champagne">· Featured</span>}
            </div>
            <p className="mt-5 leading-relaxed text-muted-foreground">{item.description}</p>
            <p className="mt-6 font-display text-4xl text-champagne">{formatINR(item.price)}</p>
            <p className="mt-1 text-xs text-muted-foreground">Prices are indicative and may vary. Taxes extra.</p>
            <div className="mt-auto flex flex-wrap gap-3 pt-8">
              <Link to="/reservations" className="btn-gold" onClick={onClose}>
                Book a Table
              </Link>
              <Link to="/menu" className="btn-outline-gold" onClick={onClose}>
                Full Menu
              </Link>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
