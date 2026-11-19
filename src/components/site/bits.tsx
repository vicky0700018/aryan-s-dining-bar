import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { SmartImage } from "./SmartImage";

export function VegMark({ isVeg, className }: { isVeg: boolean; className?: string }) {
  return (
    <span
      title={isVeg ? "Vegetarian" : "Non-vegetarian"}
      aria-label={isVeg ? "Vegetarian" : "Non-vegetarian"}
      className={cn(
        "inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-[3px] border-[1.5px]",
        isVeg ? "border-veg" : "border-nonveg",
        className,
      )}
    >
      <span className={cn("h-2 w-2 rounded-full", isVeg ? "bg-veg" : "bg-nonveg")} />
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div className={cn(align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-xl", className)}>
      <p className={cn("eyebrow", align === "center" && "gold-rule")}>{eyebrow}</p>
      <h2 className="mt-4 text-4xl text-foreground md:text-5xl lg:text-[3.4rem]">{title}</h2>
      {description && <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">{description}</p>}
    </div>
  );
}

export function PageBanner({
  image,
  eyebrow,
  title,
  description,
  height = "md",
  children,
}: {
  image: string;
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  height?: "md" | "lg";
  children?: ReactNode;
}) {
  return (
    <section
      className={cn(
        "relative flex items-end overflow-hidden",
        height === "lg" ? "min-h-[78vh]" : "min-h-[62vh] md:min-h-[58vh]",
      )}
    >
      <SmartImage src={image} alt="" loading="eager" className="absolute inset-0 h-full w-full animate-ken-burns object-cover" />
      <div className="absolute inset-0 overlay-hero" />
      <div className="container-lux relative pb-16 pt-36 md:pb-20">
        <p className="eyebrow animate-fade-up">{eyebrow}</p>
        <h1 className="mt-4 max-w-3xl animate-fade-up text-5xl text-foreground [animation-delay:120ms] md:text-7xl">{title}</h1>
        {description && (
          <p className="mt-5 max-w-xl animate-fade-up text-base leading-relaxed text-muted-foreground [animation-delay:240ms] md:text-lg">
            {description}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}

export function DemoNote({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("inline-flex items-center gap-2 rounded-full border border-border px-4 py-1.5 text-xs text-muted-foreground", className)}>
      <span className="h-1.5 w-1.5 rounded-full bg-gold" />
      {children}
    </p>
  );
}
