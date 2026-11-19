"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------
interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface PartnerLogo {
  id: string;
  src: string;
  alt: string;
}

interface WhyChooseUsProps {
  heading?: string;
  subheading?: string;
  description?: string;
  features?: Feature[];
  logos?: PartnerLogo[];
  className?: string;
}

// ------------------------------------------------------------------
// Default data
// ------------------------------------------------------------------
const defaultFeatures: Feature[] = [
  {
    icon: "fa-clock",
    title: "Experience",
    description:
      "Our level of experience in the driving instructor industry spans over 30 years. We have been there and done that.",
  },
  {
    icon: "fa-user-graduate",
    title: "Instructors",
    description:
      "Our driving instructor trainers are some of the best trained instructors in Ireland that we bring to our training courses.",
  },
  {
    icon: "fa-award",
    title: "Quality",
    description:
      "Been an approved training organisation with the RSA you can be sure your training is safe guarded.",
  },
  {
    icon: "fa-headset",
    title: "Support",
    description:
      "We provide free Phone, Text and Email support during the entire process of becoming a driving instructor.",
  },
];

const defaultLogos: PartnerLogo[] = [
  { id: "adi", src: "https://placehold.co/120x60/1a56db/white?text=ADI", alt: "ADI Logo" },
  { id: "qqi", src: "https://placehold.co/120x60/10b981/white?text=QQI", alt: "QQI Logo" },
  { id: "dsa", src: "https://placehold.co/120x60/ef4444/white?text=DSA", alt: "DSA Logo" },
  { id: "iam", src: "https://placehold.co/120x60/8b5cf6/white?text=IAM", alt: "IAM Logo" },
  { id: "diamond", src: "https://placehold.co/120x60/f59e0b/white?text=Diamond", alt: "Diamond Advanced Driver" },
  { id: "advanced", src: "https://placehold.co/120x60/3b82f6/white?text=Advanced", alt: "Advanced Drivers" },
  { id: "rospa", src: "https://placehold.co/120x60/64748b/white?text=RoSPA", alt: "ROSPA Diploma" },
];

// ------------------------------------------------------------------
// Component
// ------------------------------------------------------------------
export function WhyChooseUsSection({
  heading = "Why Choose Us",
  subheading = "Driving Excellence",
  description = "We are not just your normal run of the mill driving school providing driving lessons Dublin. We are a driving school of excellence. We ensure our pupils get the best value for money for the best driving instruction in the business. This is how:",
  features = defaultFeatures,
  logos = defaultLogos,
  className,
}: WhyChooseUsProps) {
  return (
    <section
      className={cn(
        "py-20 px-6 transition-colors duration-300 bg-muted/30",
        className
      )}
    >
      <div className="max-w-6xl mx-auto">
        {/* ---------- HEADER ---------- */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 text-xs font-semibold tracking-wider rounded-full mb-4 bg-accent text-accent-foreground">
            {subheading}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-4 text-foreground">
            {heading}
          </h2>
          <p className="text-lg max-w-2xl mx-auto text-muted-foreground">
            {description}
          </p>
        </div>

        {/* ---------- FEATURES GRID ---------- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card
              key={index}
              className={cn(
                "group relative overflow-hidden transition-all duration-300",
                "hover:shadow-xl hover:scale-[1.03]",
                "bg-card border-border",
                "hover:shadow-primary/10 dark:hover:shadow-primary/20"
              )}
            >
              {/* Icon background glow */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none" />

              <CardContent className="p-6 text-center relative z-10">
                <div
                  className={cn(
                    "w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4",
                    "bg-primary/10 text-primary",
                    "transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                  )}
                >
                  <i className={`fas ${feature.icon} text-2xl`} />
                </div>
                <h3 className="text-xl font-bold mb-2 text-card-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
                {/* Decorative line */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-primary to-secondary transition-all duration-500 group-hover:w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ---------- LOGOS / ACCREDITATIONS ---------- */}
        <div className="pt-8 border-t border-border">
          <h4 className="text-center text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-8">
            Proudly Accredited & Recognised
          </h4>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {logos.map((logo) => (
              <div
                key={logo.id}
                className="relative h-12 w-auto grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              >
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={120}
                  height={60}
                  className="h-full w-auto object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}