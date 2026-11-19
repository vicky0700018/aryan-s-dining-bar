import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Users, Wine, Lamp } from "lucide-react";
import { useStore } from "@/lib/store";
import { SmartImage } from "@/components/site/SmartImage";
import { PageBanner, SectionHeading } from "@/components/site/bits";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us | Aryan's Family Restaurant & Bar, Pune" },
      {
        name: "description",
        content: "The story of Aryan's — a family restaurant and full-service bar in Mundhwa, Pune, serving Indian, tandoor and Indo-Chinese cuisine.",
      },
      { property: "og:title", content: "About Aryan's Family Restaurant & Bar" },
      { property: "og:description", content: "Our story, dining philosophy, family sections and bar experience." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: About,
});

function About() {
  const { data } = useStore();
  const a = data.about;

  const pillars = [
    { title: "Family Dining", text: a.familyDining, Icon: Users },
    { title: "The Bar", text: a.barExperience, Icon: Wine },
    { title: "Ambience", text: a.ambience, Icon: Lamp },
  ];

  return (
    <>
      <PageBanner image={a.bannerImage} eyebrow="About Aryan's" title={a.heading} height="lg" />

      {/* Intro — editorial lead */}
      <section className="section-y">
        <div className="container-lux grid gap-10 lg:grid-cols-12">
          <p className="eyebrow lg:col-span-3">Our Restaurant</p>
          <p className="font-display text-3xl leading-snug text-foreground md:text-[2.6rem] lg:col-span-9">
            {a.intro}
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="pb-24">
        <div className="container-lux grid items-center gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="gold-frame">
              <SmartImage src={a.storyImage} alt="Inside Aryan's" className="aspect-[3/4] w-full rounded-2xl object-cover" />
            </div>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <SectionHeading align="left" eyebrow="Our Story" title="Built around the family table" />
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">{a.story}</p>
            <blockquote className="mt-10 border-l-2 border-gold pl-6 font-display text-2xl italic leading-snug text-champagne">
              {a.philosophy}
            </blockquote>
            <p className="mt-3 pl-6 text-xs uppercase tracking-[0.24em] text-muted-foreground">Our dining philosophy</p>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="section-y bg-surface">
        <div className="container-lux">
          <SectionHeading eyebrow="The Aryan's Experience" title="Comfort for families, energy at the bar" />
          <div className="mt-16 grid gap-10 md:grid-cols-3">
            {pillars.map(({ title, text, Icon }, i) => (
              <div key={title} className="relative border-t border-border-strong pt-8">
                <span className="absolute -top-px left-0 h-px w-16 bg-gold" />
                <div className="flex items-center justify-between">
                  <Icon className="h-7 w-7 text-gold" />
                  <span className="font-display text-5xl text-surface-raised">0{i + 1}</span>
                </div>
                <h3 className="mt-6 text-3xl text-foreground">{title}</h3>
                <p className="mt-4 leading-relaxed text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ambience full bleed */}
      <section className="relative">
        <SmartImage src={a.ambienceImage} alt="Restaurant ambience" className="h-[70vh] w-full object-cover" />
        <div className="absolute inset-0 overlay-side" />
        <div className="container-lux absolute inset-0 flex items-center">
          <div className="max-w-lg">
            <p className="eyebrow">Ambience</p>
            <h2 className="mt-4 text-5xl text-foreground md:text-6xl">Warm light, carved wood, easy evenings</h2>
            <p className="mt-5 text-muted-foreground">{a.ambience}</p>
          </div>
        </div>
      </section>

      {/* Food & beverage highlights */}
      <section className="section-y">
        <div className="container-lux">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading align="left" eyebrow="Food & Beverage" title="What we're known for" />
            <Link to="/menu" className="btn-link-gold shrink-0">
              Browse the menu <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {a.highlights.map((hl) => (
              <article key={hl.id} className="img-zoom group">
                <div className="overflow-hidden rounded-xl border border-border">
                  <SmartImage src={hl.image} alt={hl.title} className="aspect-[4/5] w-full object-cover" />
                </div>
                <h3 className="mt-5 text-2xl text-foreground">{hl.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{hl.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Image mosaic */}
      <section className="pb-24">
        <div className="container-lux grid gap-4 md:grid-cols-3">
          {a.images.map((im, i) => (
            <figure key={im.id} className={`img-zoom relative overflow-hidden rounded-xl border border-border ${i === 0 ? "md:row-span-2" : ""}`}>
              <SmartImage src={im.image} alt={im.title} className={`w-full object-cover ${i === 0 ? "h-full min-h-[300px]" : "aspect-[16/10]"}`} />
              <figcaption className="absolute inset-x-0 bottom-0 overlay-card p-5">
                <p className="font-display text-xl text-foreground">{im.title}</p>
                <p className="text-xs text-muted-foreground">{im.description}</p>
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="container-lux mt-16 flex flex-wrap justify-center gap-4">
          <Link to="/reservations" className="btn-gold">Book a Table</Link>
          <Link to="/gallery" className="btn-outline-gold">See the Gallery</Link>
        </div>
      </section>
    </>
  );
}
