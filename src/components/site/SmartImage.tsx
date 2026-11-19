import { useState, type ImgHTMLAttributes } from "react";
import { UtensilsCrossed } from "lucide-react";
import { cn } from "@/lib/utils";

/** Image with graceful fallback when a URL is broken or empty. */
export function SmartImage({ src, alt, className, ...rest }: ImgHTMLAttributes<HTMLImageElement>) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn("flex items-center justify-center bg-surface-raised text-gold-deep", className)}
      >
        <UtensilsCrossed className="h-8 w-8" />
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className={className}
      {...rest}
    />
  );
}
