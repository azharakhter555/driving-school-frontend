"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------
export interface EDTReasonsSectionProps {
  heading?: string;
  subheading?: string;
  reasons?: string[];
  whoNeeds?: string[];
  autoHeading?: string;
  autoParagraphs?: string[];
  autoSubHeading?: string;
  autoDescription?: string[];
  ctaLabel?: string;
  ctaHref?: string;
  ctaPhone?: string;
  className?: string;
  variant?: "light" | "muted";
}

// ------------------------------------------------------------------
// Default data (unchanged)
// ------------------------------------------------------------------
const defaultReasons = [
  "To understand the rules and regulations of the road.",
  "The EDT teaches fundamental driving skills to learners.",
  "The 12 EDT lessons are part of RSA's Graduated Driver Licensing (GDL) which aims at road safety.",
  "To be able to maintain road discipline and have respect towards other road users.",
  "To avoid the common mistakes that motorists make while using the road.",
];

const defaultWhoNeeds = [
  "An individual who has attained the age of 16 years or above the age of 16 years.",
  "Any individual who has issued a learner permit on or after 4th April 2011.",
  "Any individual who wishes to acquire a driver's license.",
  "Young inexperienced drivers who have not undergone actual driving lessons from a well-established driving school that has been approved by the Road Safety Authority (RSA).",
  "All motorists that are using the roads to ensure that road safety rules are observed.",
];

const defaultAutoParagraphs = [
  "If you think you want to get those benefits mentioned above, we have the best instructors for the learners. You can enrol for the driving lessons for automatic driving and get the 12 EDT automatic driving lessons after getting the learning permit.",
  "Point to note here that the driving license for the automatic car drivers comes with some restrictions as the driving license and test for the manual and automatic drivers are different. If you want to drive manual cars, you need to give a separate trial.",
];

const defaultAutoDescription = [
  "We deliver the complete EDT Programmes 1-12 in our Automatic driving lessons. We can act as your sponsor if you didn't have one, so there is no need to worry about that.",
  "After completing 12 Lessons, we will assist you in progressing forward to apply for your full driving test after going through the pretest, which will prepare you thoroughly and polish your skills.",
];

// ------------------------------------------------------------------
// Component
// ------------------------------------------------------------------
export function EDTReasonsSection({
  heading = "Still not sure if you need 12 EDT Driving lessons?",
  subheading = "This is why you do:",
  reasons = defaultReasons,
  whoNeeds = defaultWhoNeeds,
  autoHeading = "Feeling nervous and want to switch to automatic cars?",
  autoParagraphs = defaultAutoParagraphs,
  autoSubHeading = "EDT Automatic driving lessons Dublin",
  autoDescription = defaultAutoDescription,
  ctaLabel = "Get Prices",
  ctaHref = "/prices",
  ctaPhone = "085 118 1111",
  className,
  variant = "light",
}: EDTReasonsSectionProps) {
  const bgClass = variant === "muted" ? "bg-muted/30" : "bg-background";

  return (
    <section className={cn("py-20 px-6 transition-colors", bgClass, className)}>
      <div className="max-w-6xl mx-auto">
        {/* Two‑column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* ---------- LEFT COLUMN: Reasons ---------- */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {heading}
            </h2>
            <p className="text-lg text-muted-foreground mb-6">{subheading}</p>

            <ul className="space-y-3 mb-8">
              {reasons.map((reason, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-primary text-lg font-bold mt-0.5">✓</span>
                  <span className="text-foreground/80">{reason}</span>
                </li>
              ))}
            </ul>

            <h3 className="text-xl font-semibold text-foreground mb-3">
              Who needs to complete the 12 EDT lessons?
            </h3>
            <ul className="space-y-2">
              {whoNeeds.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-secondary text-sm mt-1">•</span>
                  <span className="text-foreground/80">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* ---------- RIGHT COLUMN: Automatic Card ---------- */}
          <div className="lg:sticky lg:top-8">
            <div className="rounded-2xl bg-card border border-border shadow-lg p-8 md:p-10 hover:shadow-xl transition-shadow duration-300">
              {/* Decorative top bar */}
              <div className="w-16 h-1 bg-gradient-to-r from-primary to-secondary rounded-full mb-6" />

              <h3 className="text-2xl md:text-3xl font-bold text-card-foreground mb-4">
                {autoHeading}
              </h3>

              {autoParagraphs.map((p, i) => (
                <p key={i} className="text-muted-foreground mb-4">
                  {p}
                </p>
              ))}

              <div className="mt-6 pt-6 border-t border-border">
                <h4 className="text-xl font-semibold text-card-foreground mb-3">
                  {autoSubHeading}
                </h4>
                {autoDescription.map((p, i) => (
                  <p key={i} className="text-muted-foreground mb-4">
                    {p}
                  </p>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 mt-6">
                <Link
                  href={ctaHref}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors shadow-md"
                >
                  {ctaLabel}
                  <i className="fas fa-arrow-right text-sm" />
                </Link>
                <a
                  href={`tel:${ctaPhone.replace(/\s/g, "")}`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-lg font-semibold hover:bg-secondary/90 transition-colors shadow-md"
                >
                  <i className="fas fa-phone-alt" />
                  {ctaPhone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}