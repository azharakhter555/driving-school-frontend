"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------
export interface FaqItem {
  question: string;
  answer: string;
}

export interface FAQSectionProps {
  heading?: string;
  subheading?: string;
  faqs?: FaqItem[];
  variant?: "light" | "muted";
  className?: string;
}

// ------------------------------------------------------------------
// Default EDT FAQ data
// ------------------------------------------------------------------
const defaultFaqs: FaqItem[] = [
  {
    question: "What is EDT?",
    answer:
      "EDT stands for Essential Driver Training. It's a mandatory programme of 12 one‑hour driving lessons introduced by the RSA to improve road safety and ensure learner drivers gain essential skills before taking their driving test.",
  },
  {
    question: "Is the EDT lesson for every Driving Learner in Ireland?",
    answer:
      "Yes, if you hold a learner permit issued on or after 4th April 2011, you must complete the full 12 EDT lessons before you can sit your driving test. There are some exemptions for certain licence categories, but for cars (Category B), it's mandatory.",
  },
  {
    question: "Does the National Driving School Provide ADI for students?",
    answer:
      "Yes, we have a team of fully qualified RSA Approved Driving Instructors (ADI) who will guide you through each EDT lesson. All our instructors are highly experienced and passionate about teaching safe driving.",
  },
  {
    question: "Am I eligible for EDT?",
    answer:
      "You are eligible if you are at least 17 years old (16 for mopeds) and hold a valid learner permit for Category B (cars). You must also have your permit for at least 6 months before taking the test, and complete the EDT lessons within that period.",
  },
  {
    question: "Do I need all 12 EDT lessons?",
    answer:
      "Yes, you must complete all 12 one‑hour lessons. Each lesson covers a specific module of the RSA syllabus, and you cannot skip any. Your instructor will sign off each lesson in your logbook as you progress.",
  },
  {
    question: "Does my EDT lesson permit expire?",
    answer:
      "Your learner permit itself expires after 2 years (or 5 years if you renew). The EDT lessons don't expire, but you must complete them before your driving test. It's recommended to finish your EDT within a reasonable time while your permit is still valid.",
  },
];

// ------------------------------------------------------------------
// Component
// ------------------------------------------------------------------
export function FAQSection({
  heading = "Frequently Asked EDT Questions",
  subheading = "You can find our most popular frequently asked questions around EDT driving lessons below",
  faqs = defaultFaqs,
  variant = "light",
  className,
}: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const bgClass = variant === "muted" ? "bg-muted/30" : "bg-background";

  return (
    <section className={cn("py-20 px-6 transition-colors", bgClass, className)}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            {heading}
          </h2>
          <p className="text-lg text-muted-foreground">{subheading}</p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 flex items-center gap-4 text-left focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  {/* Plus/Minus icon on the left */}
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold transition-colors duration-200">
                    {isOpen ? (
                      <i className="fas fa-minus" />
                    ) : (
                      <i className="fas fa-plus" />
                    )}
                  </span>
                  <span className="text-base md:text-lg font-semibold text-card-foreground flex-1">
                    {faq.question}
                  </span>
                </button>
                <div
                  className={cn(
                    "px-6 overflow-hidden transition-all duration-300 ease-in-out",
                    isOpen ? "max-h-96 pb-6" : "max-h-0 pb-0"
                  )}
                >
                  <p className="text-muted-foreground leading-relaxed pl-10">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}