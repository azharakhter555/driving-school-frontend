// components/layout/Header.tsx
"use client";

import Link from "next/link";
import { NavLink } from "@/components/shared/NavLink";
import { HeaderDropdown } from "@/components/shared/ServicesDropdown";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { MobileMenu } from "./MobileMenu";
import { SERVICES, ABOUT, LOCATION } from "@/lib/constants";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        {/* Increased header height from h-16 to h-20 */}
        <div className="flex h-20 items-center justify-between">
          {/* Logo - bigger and bolder */}
          <Link href="/" className="flex flex-col items-start justify-center leading-tight">
            <span className="text-4xl font-black text-primary">Moor</span>
            <span className="text-3xl font-extrabold text-foreground">Driving School</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <NavLink href="/">HOME</NavLink>
            <HeaderDropdown services={SERVICES} menuName="SERVICES" />
            <HeaderDropdown services={LOCATION} menuName="LOCATION" />
            <HeaderDropdown services={ABOUT} menuName="ABOUT" />
            <NavLink href="/contact">CONTACT</NavLink>
            <div className="flex items-center space-x-4">
              <NavLink href="/book">BOOK NOW</NavLink>
              <Link
                href="/auth/signup"
                className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Sign Up
              </Link>
              <ThemeToggle variant="icon" />
            </div>
          </nav>

          {/* Mobile */}
          <div className="flex items-center space-x-4 md:hidden">
            <ThemeToggle variant="minimal" />
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
