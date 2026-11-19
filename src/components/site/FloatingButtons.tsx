import { useEffect, useRef, useState } from "react";
import { MapPin, Phone, X } from "lucide-react";
import { useStore } from "@/lib/store";
import { directionsHref, telHref, whatsappHref } from "@/lib/format";
import { WhatsAppIcon } from "./BrandIcons";

const fab =
  "group relative flex h-12 w-12 items-center justify-center rounded-full border border-border-strong bg-background text-champagne shadow-[var(--shadow-gold)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-gold hover:text-primary-foreground md:h-14 md:w-14";

function Tip({ children }: { children: string }) {
  return (
    <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-md border border-border bg-surface px-3 py-1.5 text-xs text-foreground opacity-0 transition-all duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 md:block">
      {children}
    </span>
  );
}

export function FloatingButtons() {
  const { data } = useStore();
  const s = data.settings;
  const [callOpen, setCallOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!callOpen) return;
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setCallOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [callOpen]);

  return (
    <div ref={ref} className="fixed bottom-4 right-3 z-40 flex flex-col items-end gap-3 md:bottom-6 md:right-6">
      <a
        href={whatsappHref(s.whatsapp, "Hello Aryan's! I'd like to know more.")}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className={fab}
      >
        <WhatsAppIcon className="h-5 w-5 md:h-6 md:w-6" />
        <Tip>WhatsApp us</Tip>
      </a>

      <div className="relative">
        {callOpen && (
          <div className="absolute bottom-0 right-full mr-3 w-56 animate-scale-in rounded-xl border border-border-strong bg-surface p-2 shadow-[var(--shadow-lux)]">
            <p className="px-3 pb-1 pt-2 text-[0.65rem] uppercase tracking-[0.2em] text-gold">Call Aryan's</p>
            {[s.phone1, s.phone2].filter(Boolean).map((p) => (
              <a
                key={p}
                href={telHref(p)}
                className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-card hover:text-champagne"
              >
                <Phone className="h-4 w-4 text-gold" /> {p}
              </a>
            ))}
          </div>
        )}
        <button
          onClick={() => setCallOpen((v) => !v)}
          aria-label="Call now"
          aria-expanded={callOpen}
          className={fab}
        >
          {callOpen ? <X className="h-5 w-5" /> : <Phone className="h-5 w-5" />}
          {!callOpen && <Tip>Call now</Tip>}
        </button>
      </div>

      <a
        href={directionsHref(s.name, s.address)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Get directions"
        className={fab}
      >
        <MapPin className="h-5 w-5" />
        <Tip>Get directions</Tip>
      </a>
    </div>
  );
}
