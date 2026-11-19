// components/sections/Hero.tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative w-full min-h-[100vh] overflow-hidden">
      {/* Background Image (AVIF) */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/assets/hero-background-2.avif')",
        }}
      />

      {/* Optional overlay for better text readability */}
      <div className="absolute inset-0 bg-black/30 dark:bg-black/50" />

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-start justify-center h-full min-h-[90vh] px-6 md:px-12 max-w-4xl mx-auto">
        <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-white bg-primary/80 rounded-full backdrop-blur-sm">
          🚦 Learn to Drive with Confidence | 5 Star rated Driving School on Google
        </span>
        <h1 className="text-5xl md:text-5xl lg:text-5xl font-extrabold leading-tight text-white">
          <span className="text-foreground">Moor</span>{" "}
          <span className="text-white">Start Your Driving Lessons with National Driving School</span>
          <br />
        </h1>
        <p className="mt-4 text-lg md:text-xl text-white/90 max-w-2xl drop-shadow-md">
          Expert driving lessons, mock tests, and car hire – all in one place.
          Book your first lesson today!
              </p>
              
        <div className="mt-8 flex flex-wrap gap-4">
          <Button asChild size="lg" className="font-semibold">
            <Link href="/services">Get Started</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="font-semibold bg-primary text-white border-white/80 hover:bg-white/20"
          >
            <Link href="/about">Learn More</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}