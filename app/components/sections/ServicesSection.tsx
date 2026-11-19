"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

// ------------------------------------------------------------------
// Typesps
// ------------------------------------------------------------------
export interface Service {
  href: string;
  label: string;
  image: string; // image URL (e.g., from Unsplash)
  icon?: string; // optional fallback icon
}

interface ServicesSectionProps {
  heading?: string;
  subheading?: string;
  services?: Service[];
  className?: string;
  /** 'light' (default) or 'primary' – controls the section background */
  variant?: "light" | "primary";
}

// ------------------------------------------------------------------
// Default services with high-quality Unsplash images
// ------------------------------------------------------------------
export const SERVICES: Service[] = [
  {
    href: "/services/edt",
    label: "EDT Lessons",
    image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&h=400&fit=crop",
    icon: "fa-road",
  },
  {
    href: "/services/pre-test",
    label: "Pre-Test Lessons",
    image: "https://images.unsplash.com/photo-1549317661-b8ac0d7fe8f4?w=600&h=400&fit=crop",
    icon: "fa-check-circle",
  },
  {
    href: "/services/mock-test",
    label: "Mock Test",
    image: "https://images.unsplash.com/photo-1436262513933-a0b06755c784?w=600&h=400&fit=crop",
    icon: "fa-clipboard-list",
  },
  {
    href: "/services/automatic",
    label: "Automatic Lessons",
    image: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&h=400&fit=crop",
    icon: "fa-car",
  },
  {
    href: "/services/car-hire",
    label: "Car Hire for Driving Test",
    image: "https://images.unsplash.com/photo-1550355291-bbee04a92027?w=600&h=400&fit=crop",
    icon: "fa-key",
  },
  {
    href: "/services/instructor-training",
    label: "Driving Instructor Training",
    image: "https://images.unsplash.com/photo-1592997656881-3d33b7c2e7c3?w=600&h=400&fit=crop",
    icon: "fa-chalkboard-teacher",
  },
];

// ------------------------------------------------------------------
// Component
// ------------------------------------------------------------------
export function ServicesSection({
  heading = "What we do",
  subheading = "Driving Lesson Services",
  services = SERVICES,
  className,
  variant = "light",
}: ServicesSectionProps) {
  // Section background
  const sectionBg =
    variant === "primary" ? "bg-primary text-primary-foreground" : "bg-background text-foreground"; // ✅ changed from bg-muted/30

  return (
    <section className={cn("py-20 px-6 transition-colors duration-300", sectionBg, className)}>
      <div className="max-w-6xl mx-auto">
        {/* Centered Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span
            className={cn(
              "inline-block px-4 py-1.5 text-xs font-semibold tracking-wider rounded-full mb-4",
              variant === "primary" ? "bg-white/20 text-white" : "bg-accent text-accent-foreground"
            )}
          >
            {subheading}
          </span>
          <h2
            className={cn(
              "text-4xl md:text-5xl font-bold leading-tight",
              variant === "primary" ? "text-primary-foreground" : "text-foreground"
            )}
          >
            {heading}
          </h2>
        </div>

        {/* Cards grid – each with image + primary background */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Link
              key={service.href}
              href={service.href}
              className={cn(
                "group relative rounded-2xl overflow-hidden transition-all duration-500",
                "hover:scale-[1.03] hover:shadow-2xl",
                "bg-primary text-primary-foreground",
                "border border-primary/20 hover:border-primary/40",
                "flex flex-col"
              )}
            >
              {/* Image on top */}
              <div className="relative w-full h-48 overflow-hidden bg-primary/20">
                <Image
                  src={service.image}
                  alt={service.label}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Overlay gradient for better text contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                {/* Small icon badge on image */}
                {service.icon && (
                  <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-lg">
                    <i className={`fas ${service.icon}`} />
                  </div>
                )}
              </div>

              {/* Content area with primary background */}
              <div className="p-6 flex flex-col flex-1 bg-primary">
                <h3 className="text-xl font-bold text-white group-hover:text-white/90 transition-colors">
                  {service.label}
                </h3>

                {/* Divider line */}
                <div className="w-12 h-0.5 bg-white/30 rounded-full my-3 group-hover:w-16 transition-all duration-300" />

                <p className="text-white/70 text-sm leading-relaxed mb-4">
                  {service.label === "Automatic Lessons"
                    ? "Learn to drive with ease in our automatic vehicles. Perfect for city driving."
                    : service.label === "EDT Lessons"
                      ? "Essential Driver Training (EDT) with certified instructors."
                      : service.label === "Pre-Test Lessons"
                        ? "Focused sessions to polish your skills before the big day."
                        : service.label === "Mock Test"
                          ? "Full realistic test simulation with detailed feedback."
                          : service.label === "Car Hire for Driving Test"
                            ? "Hire a reliable, test-ready vehicle for your driving exam."
                            : "Train to become a certified driving instructor with our expert program."}
                </p>

                {/* Stylish "Learn more" button */}
                <div className="mt-auto flex items-center gap-3 text-white/90 group-hover:text-white transition-all">
                  <span className="text-sm font-medium tracking-wide uppercase">Learn more</span>
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/10 group-hover:bg-white/20 transition-all duration-300 group-hover:translate-x-1">
                    <i className="fas fa-arrow-right text-xs" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
