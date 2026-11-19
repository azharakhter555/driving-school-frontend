"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------
export interface Step {
  title: string;
  description: string;
  image: string;
  alt: string;
}

interface FirstLessonSectionProps {
  heading?: string;
  subheading?: string;
  description?: string;
  steps?: Step[];
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  className?: string;
}

// ------------------------------------------------------------------
// Default steps with Unsplash images
// ------------------------------------------------------------------
const defaultSteps: Step[] = [
  {
    title: "Learner Permit",
    description:
      "A learner permit allows you to learn to drive on public roads with your driving instructor.",
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=400&fit=crop&q=80",
    alt: "Learner Permit",
  },
  {
    title: "Tax & Insurance",
    description:
      "If you want to learn to drive within your own vehicle you will need to make sure your tax & insurance is valid.",
    image:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&h=400&fit=crop&q=80",
    alt: "Tax and Insurance",
  },
  {
    title: "Good Attitude",
    description:
      "We love our learners and strive to give them the best learning experience there is.",
    image:
      "https://images.unsplash.com/photo-1565689163920-4dfac7c37e8b?w=600&h=400&fit=crop&q=80",
    alt: "Good Attitude",
  },
];

// ------------------------------------------------------------------
// Component
// ------------------------------------------------------------------
export function FirstLessonSection({
  heading = "First Lesson",
  subheading = "Before your first driving lessons you must have the following in order",
  description = "To help get you on the road to passing your test and becoming a safe driver for life, we need to make sure you have everything in order. Find out below!",
  steps = defaultSteps,
  primaryCtaLabel = "Get Prices",
  primaryCtaHref = "/prices",
  secondaryCtaLabel = "Ask a question",
  secondaryCtaHref = "/contact",
  className,
}: FirstLessonSectionProps) {
  return (
    <section
      className={cn(
        "py-20 px-6 bg-primary text-primary-foreground overflow-hidden",
        className
      )}
    >
      <div className="max-w-6xl mx-auto">
        {/* ---------- Centered Header ---------- */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 text-xs font-semibold tracking-wider rounded-full mb-4 bg-white/20 text-white">
            {subheading}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            {heading}
          </h2>
          <p className="text-white/80 text-lg">{description}</p>
        </div>

        {/* ---------- Steps (Alternating Layout) ---------- */}
        <div className="space-y-16">
          {steps.map((step, index) => (
            <div
              key={index}
              className={cn(
                "group flex flex-col gap-8 items-center",
                "md:flex-row",
                // Even index = image on right, text on left
                // Odd index = image on left, text on right
                index % 2 !== 0 ? "md:flex-row-reverse" : "md:flex-row"
              )}
            >
              {/* Image */}
              <div className="relative w-full md:w-1/2 h-64 md:h-80 rounded-2xl overflow-hidden shadow-xl flex-shrink-0">
                <Image
                  src={step.image}
                  alt={step.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-primary/20 mix-blend-overlay" />
              </div>

              {/* Text Content */}
              <div className="w-full md:w-1/2 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-5xl font-black text-white/10 select-none">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-bold">
                    {index + 1}. {step.title}
                  </h3>
                </div>
                <p className="text-white/80 text-lg leading-relaxed pl-14">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ---------- CTAs ---------- */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-16 pt-8 border-t border-white/10">
          <Button
            asChild
            size="lg"
            className="bg-white text-primary hover:bg-white/90 font-semibold px-8"
          >
            <Link href={primaryCtaHref}>{primaryCtaLabel}</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-white text-white hover:bg-white/10 font-semibold px-8"
          >
            <Link href={secondaryCtaHref}>{secondaryCtaLabel}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}