import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowRight, Bike, CalendarDays, Clock, Mail, MapPin, Music, Phone, Quote, Sofa, Star, Users, UtensilsCrossed, Wine,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { directionsHref, formatDateParts, formatTime, mapEmbedSrc, telHref } from "@/lib/format";
import type { MenuItem } from "@/lib/types";
import { SmartImage } from "@/components/site/SmartImage";
import { DemoNote, SectionHeading } from "@/components/site/bits";
import { DishCard, DishModal } from "@/components/site/DishCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aryan's Family Restaurant & Bar | Indian Dining & Bar in Mundhwa, Pune" },
      {
        name: "description",
        content:
          "Family dining, premium bar, sports screenings and live entertainment in Mundhwa, Pune. Explore the menu and book a table at Aryan's.",
      },
      { property: "og:title", content: "Aryan's Family Restaurant & Bar — Where Great Food Meets Great Moments" },
      {
        property: "og:description",
        content: "Indian casual dining restaurant and full-service bar in Keshav Nagar, Mundhwa, Pune.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const WHY_ICONS = [UtensilsCrossed, Users, Wine, Sofa, Music, Bike];

function Home() {
  const { data } = useStore();
  const h = data.homepage;
  const s = data.settings;
  const [viewing, setViewing] = useState<MenuItem | null>(null);
  const catName = (id: string) => data.categories.find((c) => c.id === id)?.name;

  const featured = useMemo(() => {
    const picked = h.featuredDishIds
      .map((id) => data.menu.find((m) => m.id === id))
      .filter((m): m is MenuItem => !!m);
    return (picked.length ? picked : data.menu.filter((m) => m.isChefSpecial)).slice(0, 6);
  }, [h.featuredDishIds, data.menu]);

  const homeCats = [...data.categories].filter((c) => c.showOnHome).sort((a, b) => a.order - b.order).slice(0, 8);

  const galleryPreview = useMemo(() => {
    const seen = new Set<string>();
    const out = [];
    for (const g of data.gallery) {
      if (!seen.has(g.category)) {
        seen.add(g.category);
        out.push(g);
      }
      if (out.length === 6) break;
    }
    return out;
  }, [data.gallery]);

  const events = data.events.filter((e) => e.status !== "Draft").slice(0, 4);
  const testimonials = data.testimonials.filter((t) => t.visible).slice(0, 3);

  return (
    <>
      {/* HERO */}
      <section className="relative flex min-h-[100svh] items-center overflow-hidden">
        <SmartImage src={h.heroImage} alt="Aryan's dining room" loading="eager" className="absolute inset-0 h-full w-full animate-ken-burns object-cover" />
        <div className="absolute inset-0 overlay-side" />
        <div className="absolute inset-0 overlay-hero opacity-70" />
        <div className="container-lux relative pb-28 pt-36">
          <p className="eyebrow animate-fade-up">{h.heroBrand}</p>
          <h1 className="mt-6 max-w-4xl animate-fade-up text-[3.2rem] leading-[0.98] text-foreground [animation-delay:150ms] sm:text-7xl lg:text-[6.2rem]">
            {h.heroHeading.split(" ").slice(0, -2).join(" ")}{" "}
            <em className="text-gradient-gold not-italic md:italic">{h.heroHeading.split(" ").slice(-2).join(" ")}</em>
          </h1>
          <p className="mt-7 max-w-xl animate-fade-up text-base leading-relaxed text-muted-foreground [animation-delay:300ms] md:text-lg">
            {h.heroDescription}
          </p>
          <div className="mt-10 flex animate-fade-up flex-wrap gap-4 [animation-delay:450ms]">
            <Link to="/menu" className="btn-gold">
              Explore Our Menu <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/reservations" className="btn-outline-gold">
              Book a Table
            </Link>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 hidden border-t border-border glass md:block">
          <div className="container-lux flex items-center justify-between gap-6 py-5 text-[0.72rem] uppercase tracking-[0.22em] text-muted-foreground">
            {["Family Dining", "Full-Service Bar", "Sports Screenings", "Takeaway & Delivery"].map((t) => (
              <span key={t} className="flex items-center gap-3">
                <span className="h-1 w-1 rounded-full bg-gold" /> {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* A. WELCOME */}
      <section className="section-y">
        <div className="container-lux grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
          <div className="gold-frame mx-auto w-full max-w-md lg:max-w-none">
            <SmartImage src={h.welcomeImage} alt="A table set at Aryan's" className="aspect-[4/5] w-full rounded-2xl object-cover" />
            <div className="absolute -bottom-6 -right-4 hidden rounded-xl border border-border-strong bg-surface px-6 py-5 md:block">
              <p className="font-display text-4xl text-champagne">Dine · Drink</p>
              <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">Celebrate together</p>
            </div>
          </div>
          <div>
            <SectionHeading align="left" eyebrow="Welcome to Aryan's" title={h.welcomeTitle} />
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">{h.welcomeText}</p>
            <div className="mt-8 grid grid-cols-3 gap-4 border-y border-border py-6">
              {[
                ["Dine-in", "Family sections"],
                ["Bar", "Private areas"],
                ["Home", "Takeaway & delivery"],
              ].map(([a, b]) => (
                <div key={a}>
                  <p className="font-display text-3xl text-champagne">{a}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{b}</p>
                </div>
              ))}
            </div>
            <Link to="/about" className="btn-outline-gold mt-10">
              Read More <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* B. DINING EXPERIENCE */}
      <section className="section-y bg-surface">
        <div className="container-lux">
          <SectionHeading
            eyebrow="Our Dining Experience"
            title="Four ways to enjoy Aryan's"
            description="From relaxed family lunches to match nights at the bar — choose your kind of evening."
          />
          <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {h.diningExperiences.map((d, i) => (
              <article key={d.id} className={`img-zoom group relative overflow-hidden rounded-2xl border border-border ${i % 2 ? "lg:mt-12" : ""}`}>
                <SmartImage src={d.image} alt={d.title} className="aspect-[3/4] w-full object-cover" />
                <div className="absolute inset-0 overlay-card" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <span className="text-xs tracking-[0.3em] text-gold">0{i + 1}</span>
                  <h3 className="mt-2 text-3xl text-foreground">{d.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{d.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* C. CHEF'S SPECIAL */}
      <section className="section-y">
        <div className="container-lux">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <SectionHeading align="left" eyebrow="Chef's Special" title="Plates our kitchen is proud of" />
            <Link to="/menu" className="btn-link-gold shrink-0">
              See the full menu <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((item) => (
              <DishCard key={item.id} item={{ ...item, isChefSpecial: true }} categoryName={catName(item.categoryId)} onView={() => setViewing(item)} />
            ))}
          </div>
        </div>
      </section>

      {/* D. EXPLORE MENU */}
      <section className="section-y relative overflow-hidden bg-surface">
        <div className="container-lux">
          <SectionHeading eyebrow="Explore Our Menu" title="Something for every craving" />
          <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-4">
            {homeCats.map((c) => {
              const count = data.menu.filter((m) => m.categoryId === c.id).length;
              return (
                <Link
                  key={c.id}
                  to="/menu"
                  search={{ category: c.slug }}
                  className="img-zoom group relative overflow-hidden rounded-xl border border-border"
                >
                  <SmartImage src={c.image} alt={c.name} className="aspect-square w-full object-cover" />
                  <div className="absolute inset-0 overlay-card transition-opacity duration-500 group-hover:opacity-90" />
                  <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
                    <h3 className="text-xl text-foreground md:text-2xl">{c.name}</h3>
                    <p className="mt-1 text-xs text-champagne">{count} dishes</p>
                  </div>
                </Link>
              );
            })}
          </div>
          <div className="mt-12 text-center">
            <Link to="/menu" className="btn-gold">
              Explore Full Menu <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* E. GALLERY PREVIEW */}
      <section className="section-y">
        <div className="container-lux">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <SectionHeading align="left" eyebrow="Gallery" title="A glimpse inside Aryan's" />
            <Link to="/gallery" className="btn-outline-gold shrink-0">
              View Full Gallery
            </Link>
          </div>
          <div className="mt-14 grid auto-rows-[180px] grid-cols-2 gap-4 md:auto-rows-[220px] md:grid-cols-4">
            {galleryPreview.map((g, i) => (
              <Link
                to="/gallery"
                key={g.id}
                className={`img-zoom group relative overflow-hidden rounded-xl border border-border ${
                  i === 0 ? "col-span-2 row-span-2" : i === 3 ? "md:col-span-2" : ""
                }`}
              >
                <SmartImage src={g.image} alt={g.title} className="h-full w-full object-cover" />
                <div className="absolute inset-0 overlay-card opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <span className="absolute bottom-3 left-3 rounded-full glass px-3 py-1 text-[0.65rem] uppercase tracking-[0.16em] text-champagne">
                  {g.category}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* F. EVENTS */}
      <section className="section-y bg-surface">
        <div className="container-lux">
          <SectionHeading eyebrow="Entertainment & Events" title="Evenings worth coming back for" />
          <div className="mt-6 text-center">
            <DemoNote>Sample schedule shown for demonstration — call to confirm dates.</DemoNote>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {events.map((e) => {
              const d = formatDateParts(e.date);
              return (
                <article key={e.id} className="img-zoom group card-lux flex overflow-hidden">
                  <div className="relative w-2/5 shrink-0">
                    <SmartImage src={e.image} alt={e.title} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col p-5 md:p-6">
                    <p className="eyebrow !text-[0.62rem]">{e.category}</p>
                    <h3 className="mt-2 text-2xl text-foreground md:text-3xl">{e.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{e.description}</p>
                    <div className="mt-auto flex flex-wrap items-center gap-4 pt-4 text-xs text-champagne">
                      <span className="flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" /> {d.day} {d.month}</span>
                      <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {formatTime(e.time)}</span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
          <div className="mt-12 text-center">
            <Link to="/events" className="btn-outline-gold">
              View All Events
            </Link>
          </div>
        </div>
      </section>

      {/* G. WHY CHOOSE */}
      <section className="section-y">
        <div className="container-lux">
          <SectionHeading eyebrow="Why Choose Aryan's?" title="Made for families, friends and fans" />
          <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {h.whyChoose.map((w, i) => {
              const Icon = WHY_ICONS[i % WHY_ICONS.length];
              return (
                <div key={w.id} className="group bg-background p-8 transition-colors duration-500 hover:bg-card md:p-10">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full border border-border-strong text-gold transition-all duration-500 group-hover:bg-gold group-hover:text-primary-foreground">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-6 text-2xl text-foreground">{w.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{w.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* H. TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section className="section-y bg-surface">
          <div className="container-lux">
            <SectionHeading eyebrow="Guest Stories" title="Moments shared at our tables" />
            <div className="mt-6 text-center">
              <DemoNote>Sample testimonials for demonstration — not verified reviews.</DemoNote>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {testimonials.map((t) => (
                <figure key={t.id} className="card-lux flex flex-col p-8">
                  <Quote className="h-8 w-8 text-gold" />
                  <blockquote className="mt-5 flex-1 font-display text-2xl leading-snug text-foreground">“{t.quote}”</blockquote>
                  <div className="mt-6 flex gap-1 text-gold">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-4 w-4 ${i < t.rating ? "fill-current" : "opacity-30"}`} />
                    ))}
                  </div>
                  <figcaption className="mt-3 text-sm">
                    <span className="text-champagne">{t.name}</span>
                    <span className="text-muted-foreground"> · {t.occasion}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* I. RESERVATION BANNER */}
      <section className="relative overflow-hidden">
        <SmartImage src={h.reservationImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 overlay-scrim" />
        <div className="container-lux relative py-28 text-center md:py-36">
          <p className="eyebrow gold-rule">Reservations</p>
          <h2 className="mx-auto mt-5 max-w-3xl text-5xl text-foreground md:text-7xl">{h.reservationHeading}</h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">{h.reservationDescription}</p>
          <Link to="/reservations" className="btn-gold mt-10">
            {h.reservationButton}
          </Link>
        </div>
      </section>

      {/* J. LOCATION & CONTACT */}
      <section className="section-y">
        <div className="container-lux grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <SectionHeading align="left" eyebrow="Find Us" title="Visit Aryan's in Mundhwa" />
            <ul className="mt-8 space-y-5 text-muted-foreground">
              <li className="flex gap-4"><MapPin className="mt-1 h-5 w-5 shrink-0 text-gold" /> {s.address}</li>
              <li className="flex gap-4">
                <Phone className="mt-1 h-5 w-5 shrink-0 text-gold" />
                <span className="flex flex-col">
                  {[s.phone1, s.phone2].filter(Boolean).map((p) => (
                    <a key={p} href={telHref(p)} className="transition-colors hover:text-champagne">{p}</a>
                  ))}
                </span>
              </li>
              <li className="flex gap-4">
                <Mail className="mt-1 h-5 w-5 shrink-0 text-gold" />
                <a href={`mailto:${s.email}`} className="break-all transition-colors hover:text-champagne">{s.email}</a>
              </li>
              <li className="flex gap-4"><Clock className="mt-1 h-5 w-5 shrink-0 text-gold" /> {s.hours}</li>
            </ul>
            <div className="mt-10 flex flex-wrap gap-3">
              <a href={directionsHref(s.name, s.address)} target="_blank" rel="noopener noreferrer" className="btn-gold">
                Get Directions
              </a>
              <Link to="/contact" className="btn-outline-gold">Contact Us</Link>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl border border-border lg:col-span-3">
            <iframe
              title="Map to Aryan's Family Restaurant & Bar"
              src={mapEmbedSrc(`${s.name}, ${s.address}`)}
              className="h-[380px] w-full grayscale-[0.6] invert-[0.92] hue-rotate-180 lg:h-full lg:min-h-[460px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      <DishModal item={viewing} categoryName={viewing ? catName(viewing.categoryId) : undefined} onClose={() => setViewing(null)} />
    </>
  );
}
