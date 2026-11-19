"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------
interface DrivingLessonsProps {
  title: string;
  description: string;
  videoId: string;
  ctaLabel?: string;
  ctaHref?: string;
  phoneNumber?: string;
  badge?: string;
  trustLine?: string;
  curveStyle?: "wave" | "angle";
  className?: string;
}

// ------------------------------------------------------------------
// Component
// ------------------------------------------------------------------
export function DrivingLessons({
  title,
  description,
  videoId,
  ctaLabel = "Get Prices",
  ctaHref = "/prices",
  phoneNumber = "085 118 1111",
  badge = "5.0 ★ (1,200+ reviews)",
  trustLine = "Fully insured · RSA approved instructors",
  curveStyle = "wave",
  className,
}: DrivingLessonsProps) {
  const embedUrl = `https://www.youtube.com/embed/${videoId}?si=Hkz6Yz5cT8Yz3A2B`;
  const curveClass = curveStyle === "angle" ? "section-bottom-angle" : "section-bottom-wave";

  return (
    <section
      className={cn(
        "relative bg-background py-20 px-6 transition-colors duration-300",
        curveClass,
        className
      )}
      style={{ "--wave-color": "var(--background)" } as React.CSSProperties}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* LEFT */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-accent text-accent-foreground text-sm font-semibold px-4 py-1.5 rounded-full">
              <i className="fas fa-star text-secondary"></i>
              <span>{badge}</span>
            </div>

            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight"
              dangerouslySetInnerHTML={{ __html: title }}
            />

            <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
              {description}
            </p>

            <div className="flex items-center gap-3">
              <span className="stars text-xl">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
              </span>
              <span className="text-sm text-muted-foreground">
                &quot;Exceptional instruction – highly recommend!&quot;
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button asChild size="lg" className="font-semibold btn-pulse">
                <Link href={ctaHref}>
                  <i className="fas fa-chevron-right text-sm mr-2"></i>
                  {ctaLabel}
                </Link>
              </Button>

              <a
                href={`tel:${phoneNumber.replace(/\s/g, "")}`}
                className="phone-bounce inline-flex items-center gap-3 text-foreground bg-card hover:bg-muted px-6 py-3.5 rounded-full transition border border-border shadow-sm font-medium"
              >
                <i className="fas fa-phone-alt text-primary text-lg"></i>
                <span>{phoneNumber}</span>
              </a>
            </div>

            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <i className="fas fa-shield-alt text-green-500"></i>
              {trustLine}
            </p>
          </div>

          {/* RIGHT */}
          <div className="relative">
            <div className="video-wrapper">
              <iframe
                src={embedUrl}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>

            {/* floating badge */}
            <div className="absolute -bottom-4 -left-4 bg-card rounded-xl shadow-xl px-4 py-2.5 flex items-center gap-3 border border-border">
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-primary">
                <i className="fas fa-video"></i>
              </div>
              <div>
                <p className="text-xs font-semibold text-card-foreground">
                  Watch intro
                </p>
                <p className="text-[10px] text-muted-foreground">2 min · HD</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}