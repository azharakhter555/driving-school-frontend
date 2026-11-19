"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------
interface Step {
  icon: string;
  title: string;
  description: string;
}

interface HowItWorksProps {
  heading?: string;
  subheading?: string;
  description?: string;
  steps?: Step[];
  ctaLabel?: string;
  ctaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  className?: string;
  /** 'light' (default) or 'dark' – uses theme backgrounds */
  variant?: "light" | "dark";
}

// ------------------------------------------------------------------
// Default steps
// ------------------------------------------------------------------
const defaultSteps: Step[] = [
  {
    icon: "fa-flag",
    title: "Start with us",
    description:
      "We will see and assess your starting point and then start with your required driving lessons.",
  },
  {
    icon: "fa-user-plus",
    title: "Find your instructor",
    description:
      "Once you have made contact we will pair you with a local National driving instructor.",
  },
  {
    icon: "fa-check-circle",
    title: "Pass the test",
    description:
      "You will have the same driving instructor all the way from EDT to passing your full driving test.",
  },
];

// ------------------------------------------------------------------
// Component – using theme CSS variables
// ------------------------------------------------------------------
export function HowItWorks({
  heading = "Let's get started",
  subheading = "How it works",
  description = "It's pretty simple to get started with your driving lessons Dublin just follow these steps.",
  steps = defaultSteps,
  ctaLabel = "Get Started",
  ctaHref = "/get-started",
  secondaryCtaLabel = "Find our prices",
  secondaryCtaHref = "/prices",
  className,
  variant = "light",
}: HowItWorksProps) {
  // Use theme backgrounds – no hardcoded hex
  const bgClass = variant === "dark" ? "bg-background" : "bg-muted/30";

  return (
    <section
      className={cn(
        "relative py-20 px-6 transition-colors duration-300 overflow-hidden",
        bgClass,
        className
      )}
    >
      {/* Decorative blobs – optional, can be removed */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* ---------- HEADER (centered) ---------- */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span
            className={cn(
              "inline-block px-4 py-1.5 text-xs font-semibold tracking-wider rounded-full mb-4",
              "bg-accent text-accent-foreground"
            )}
          >
            {subheading}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-4 text-foreground">
            {heading}
          </h2>
          <p className="text-lg max-w-2xl mx-auto text-muted-foreground dark:text-gray-100">
  {description}
</p>
        </div>

        {/* ---------- STEPS ---------- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className={cn(
                "group relative rounded-2xl p-8 transition-all duration-300",
                "hover:scale-[1.02] hover:shadow-xl",
                "bg-card border border-border",
                "hover:shadow-primary/10 dark:hover:shadow-primary/20"
              )}
            >
              {/* Step number */}
              <span className="absolute top-4 right-6 text-7xl font-black select-none pointer-events-none text-border">
                {String(index + 1).padStart(2, "0")}
              </span>

              {/* Icon */}
              <div
                className={cn(
                  "w-16 h-16 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3",
                  "bg-accent text-primary"
                )}
              >
                <i className={`fas ${step.icon} text-2xl`} />
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold mb-3 relative z-10 text-card-foreground">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>

              {/* Decorative line */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-primary to-secondary transition-all duration-500 group-hover:w-3/4" />
            </div>
          ))}
        </div>

        {/* ---------- CTAs ---------- */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-14">
          <Button asChild size="lg" className="font-semibold px-8">
            <Link href={ctaHref}>
              <i className="fas fa-rocket mr-2" />
              {ctaLabel}
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="font-semibold px-8"
          >
            <Link href={secondaryCtaHref}>
              <i className="fas fa-tag mr-2" />
              {secondaryCtaLabel}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}