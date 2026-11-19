"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Calendar, X } from "lucide-react";
import Link from "next/link";

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------
export interface FloatingChatButtonProps {
  /** WhatsApp number (international format, e.g., '353851181111') */
  whatsappNumber?: string;
  /** WhatsApp prefilled message */
  whatsappMessage?: string;
  /** Chat link (e.g., to a live chat widget or contact page) */
  chatLink?: string;
  /** Booking page link */
  bookingLink?: string;
  /** Show after scrolling this many pixels (default: 300) */
  showAfter?: number;
  /** Additional classes */
  className?: string;
}

// ------------------------------------------------------------------
// Component
// ------------------------------------------------------------------
export function FloatingChatButton({
  whatsappNumber = "353851181111",
  whatsappMessage = "Hi, I'd like to book a driving lesson.",
  chatLink = "/contact",
  bookingLink = "/book",
  showAfter = 300,
  className,
}: FloatingChatButtonProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsVisible(scrollY > showAfter);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [showAfter]);

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 transition-all duration-300",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none",
        className
      )}
    >
      {/* Expanded actions */}
      <div
        className={cn(
          "flex flex-col items-end gap-3 transition-all duration-300",
          isExpanded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        )}
      >
        {/* WhatsApp button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
          aria-label="Chat on WhatsApp"
        >
          <i className="fab fa-whatsapp text-xl" />
          <span className="hidden text-sm font-medium sm:inline">WhatsApp</span>
        </a>

        {/* Chat button */}
        <a
          href={chatLink}
          className="group flex items-center gap-2 rounded-full bg-muted px-4 py-3 text-foreground shadow-lg transition-all hover:scale-105 hover:shadow-xl"
          aria-label="Chat with us"
        >
          <i className="fas fa-comment-dots text-xl" />
          <span className="hidden text-sm font-medium sm:inline">Chat</span>
        </a>

        {/* Book Now button — primary CTA */}
        <Link
          href={bookingLink}
          className="group flex items-center gap-2 rounded-full bg-secondary px-5 py-3 text-secondary-foreground shadow-lg transition-all hover:scale-105 hover:shadow-xl"
          aria-label="Book a lesson"
        >
          <Calendar className="h-5 w-5" />
          <span className="text-sm font-semibold">Book Now</span>
        </Link>
      </div>

      {/* Main toggle button */}
      <button
        onClick={() => setIsExpanded((v) => !v)}
        className={cn(
          "flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all hover:scale-105 hover:shadow-xl",
          isExpanded
            ? "bg-muted text-foreground"
            : "bg-secondary text-secondary-foreground btn-pulse"
        )}
        aria-label={isExpanded ? "Close menu" : "Open booking menu"}
      >
        {isExpanded ? <X className="h-6 w-6" /> : <Calendar className="h-6 w-6" />}
      </button>
    </div>
  );
}
