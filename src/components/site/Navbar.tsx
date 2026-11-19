import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu as MenuIcon, Phone, X } from "lucide-react";
import { useStore } from "@/lib/store";
import { telHref } from "@/lib/format";
import { cn } from "@/lib/utils";

export const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/menu", label: "Our Menu" },
  { to: "/gallery", label: "Gallery" },
  { to: "/events", label: "Events" },
  { to: "/reservations", label: "Reservations" },
  { to: "/contact", label: "Contact Us" },
] as const;

export function Logo({ compact }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-3">
      <span className="flex h-11 w-11 items-center justify-center rounded-full border border-border-strong font-display text-2xl text-champagne">
        A
      </span>
      <span className="leading-none">
        <span className="block font-display text-2xl tracking-wide text-foreground">Aryan's</span>
        {!compact && (
          <span className="mt-1 block text-[0.6rem] uppercase tracking-[0.32em] text-gold">Family Restaurant & Bar</span>
        )}
      </span>
    </span>
  );
}

export function Navbar() {
  const { data } = useStore();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled || open ? "glass border-b border-border py-3" : "py-5",
      )}
    >
      <div className="container-lux flex items-center justify-between gap-6">
        <Link to="/" aria-label="Aryan's home">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 xl:flex" aria-label="Main">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              className="group relative px-3 py-2 text-[0.78rem] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-champagne data-[status=active]:text-champagne"
            >
              {l.label}
              <span className="absolute inset-x-3 -bottom-0.5 h-px origin-left scale-x-0 bg-gold transition-transform duration-500 group-hover:scale-x-100 group-data-[status=active]:scale-x-100" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={telHref(data.settings.phone1)}
            className="hidden items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-champagne 2xl:flex"
          >
            <Phone className="h-4 w-4 text-gold" /> {data.settings.phone1}
          </a>
          <Link to="/reservations" className="btn-gold hidden !px-5 !py-3 sm:inline-flex">
            Book a Table
          </Link>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-border-strong text-champagne xl:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "fixed inset-x-0 bottom-0 top-[72px] bg-background transition-all duration-500 xl:hidden",
          open ? "visible opacity-100" : "invisible opacity-0",
        )}
      >
        <nav className="container-lux flex h-full flex-col overflow-y-auto pb-10 pt-6" aria-label="Mobile">
          {NAV_LINKS.map((l, i) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              style={{ transitionDelay: open ? `${i * 40}ms` : "0ms" }}
              className={cn(
                "flex items-center justify-between border-b border-border py-4 font-display text-3xl text-foreground transition-all duration-500 data-[status=active]:text-champagne",
                open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
              )}
            >
              {l.label}
              <span className="text-xs tracking-[0.2em] text-gold-deep">0{i + 1}</span>
            </Link>
          ))}
          <Link to="/reservations" className="btn-gold mt-8">
            Book a Table
          </Link>
          <a href={telHref(data.settings.phone1)} className="btn-outline-gold mt-3">
            <Phone className="h-4 w-4" /> {data.settings.phone1}
          </a>
        </nav>
      </div>
    </header>
  );
}
