// components/layout/MobileMenu.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { MobileNavItem } from "./MobileNavItem";
import { MOBILE_NAV_ITEMS } from "@/lib/constants";

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[350px]">
        <SheetHeader>
          <SheetTitle className="text-left">Menu</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col space-y-4 mt-6">
          {/* Mobile nav items */}
          <nav className="flex flex-col space-y-1">
            {MOBILE_NAV_ITEMS.map((item) => (
              <MobileNavItem
                key={item.label}
                item={item}
                onItemClick={() => setOpen(false)}
              />
            ))}
          </nav>

          <div className="border-t border-border" />

          {/* Auth Buttons */}
          <div className="flex flex-col space-y-3">
            <Link
              href="/login"
              className="text-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              onClick={() => setOpen(false)}
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="text-center bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
              onClick={() => setOpen(false)}
            >
              Sign Up
            </Link>
          </div>

          {/* Theme Toggle in Mobile */}
          <div className="flex justify-center pt-4 border-t border-border">
            <ThemeToggle variant="minimal" />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}