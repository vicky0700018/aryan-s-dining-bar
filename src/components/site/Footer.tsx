import { Link } from "@tanstack/react-router";
import { Lock, Mail, MapPin, Phone } from "lucide-react";
import { useStore } from "@/lib/store";
import { directionsHref, telHref } from "@/lib/format";
import { NAV_LINKS, Logo } from "./Navbar";
import { FacebookIcon, GoogleIcon, InstagramIcon, YouTubeIcon } from "./BrandIcons";

export function SocialLinks({ className = "" }: { className?: string }) {
  const { data } = useStore();
  const s = data.settings;
  const links = [
    { href: s.instagram, label: "Instagram", Icon: InstagramIcon },
    { href: s.facebook, label: "Facebook", Icon: FacebookIcon },
    { href: s.youtube, label: "YouTube", Icon: YouTubeIcon },
    { href: s.google, label: "Google", Icon: GoogleIcon },
  ].filter((l) => l.href);
  return (
    <div className={`flex gap-2.5 ${className}`}>
      {links.map(({ href, label, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-champagne transition-all duration-300 hover:-translate-y-0.5 hover:border-gold hover:bg-gold hover:text-primary-foreground"
        >
          <Icon className="h-4 w-4" />
        </a>
      ))}
    </div>
  );
}

export function Footer() {
  const { data } = useStore();
  const s = data.settings;
  const cats = [...data.categories].sort((a, b) => a.order - b.order).slice(0, 8);

  return (
    <footer className="relative border-t border-border bg-surface">
      <div className="container-lux grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-12 lg:py-20">
        <div className="lg:col-span-4">
          <Logo />
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted-foreground">{s.about}</p>
          <SocialLinks className="mt-6" />
        </div>

        <div className="lg:col-span-2">
          <h4 className="eyebrow">Explore</h4>
          <ul className="mt-5 space-y-3 text-sm">
            {NAV_LINKS.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-muted-foreground transition-colors hover:text-champagne">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-2">
          <h4 className="eyebrow">Menu</h4>
          <ul className="mt-5 space-y-3 text-sm">
            {cats.map((c) => (
              <li key={c.id}>
                <Link to="/menu" search={{ category: c.slug }} className="text-muted-foreground transition-colors hover:text-champagne">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-4">
          <h4 className="eyebrow">Visit & Contact</h4>
          <ul className="mt-5 space-y-4 text-sm text-muted-foreground">
            <li>
              <a href={directionsHref(s.name, s.address)} target="_blank" rel="noopener noreferrer" className="flex gap-3 transition-colors hover:text-champagne">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" /> {s.address}
              </a>
            </li>
            {[s.phone1, s.phone2].filter(Boolean).map((p) => (
              <li key={p}>
                <a href={telHref(p)} className="flex gap-3 transition-colors hover:text-champagne">
                  <Phone className="h-4 w-4 shrink-0 text-gold" /> {p}
                </a>
              </li>
            ))}
            <li>
              <a href={`mailto:${s.email}`} className="flex gap-3 break-all transition-colors hover:text-champagne">
                <Mail className="h-4 w-4 shrink-0 text-gold" /> {s.email}
              </a>
            </li>
            <li className="pl-7 text-xs">{s.hours}</li>
          </ul>
        </div>
      </div>

      <div className="hairline" />
      <div className="container-lux flex flex-col gap-4 py-6 pr-20 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
        <p>© 2026 {s.name}. All rights reserved.</p>
        <p className="text-champagne">Designed and development by SOSynch Ai Tech</p>
        <Link to="/admin/login" className="inline-flex items-center gap-1.5 transition-colors hover:text-champagne">
          <Lock className="h-3.5 w-3.5" /> Admin Login
        </Link>
      </div>
    </footer>
  );
}
