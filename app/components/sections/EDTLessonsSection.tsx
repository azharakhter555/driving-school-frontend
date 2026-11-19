"use client";

import { cn } from "@/lib/utils";

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------
export interface Lesson {
  number: number;
  title: string;
  description: string;
}

export interface EDTLessonsSectionProps {
  heading?: string;
  subheading?: string;
  lessons?: Lesson[];
  className?: string;
  variant?: "light" | "muted";
}

// ------------------------------------------------------------------
// Default lessons (RSA syllabus aligned)
// ------------------------------------------------------------------
const defaultLessons: Lesson[] = [
  {
    number: 1,
    title: "Car controls and safety checks",
    description:
      "Familiarise with the rules and regulations of the road and the vehicle. Your sponsor or ADI will assist you in using brakes and steering (primary controls) as well as secondary controls like lights, windscreen wipers. You'll also learn to evaluate vehicle roadworthiness.",
  },
  {
    number: 2,
    title: "Correct positioning",
    description:
      "Learn to position your vehicle correctly on the road, maintain proper lane discipline, and adjust for varying road widths and conditions. This includes understanding road markings and how to use them to your advantage.",
  },
  {
    number: 3,
    title: "Changing direction",
    description:
      "Master turning left and right at junctions, roundabouts, and complex intersections. You'll practice observation, signalling, and accurate steering control to change direction safely and confidently.",
  },
  {
    number: 4,
    title: "Progression management",
    description:
      "Develop the ability to manage speed and space when moving with traffic. This includes joining and leaving motorways, overtaking, and maintaining a safe following distance while keeping up with the flow.",
  },
  {
    number: 5,
    title: "Correct positioning (more complex situations)",
    description:
      "Apply positioning skills in challenging scenarios such as narrow roads, town centres, multi‑lane roundabouts, and one‑way systems. Emphasis is on adapting to changing road layouts and traffic conditions.",
  },
  {
    number: 6,
    title: "Anticipation and reaction",
    description:
      "Train your observation and hazard perception to anticipate the actions of other road users. Learn to react calmly and effectively to unexpected events, reducing the risk of collisions.",
  },
  {
    number: 7,
    title: "Sharing the road",
    description:
      "Understand how to interact safely with all types of road users – pedestrians, cyclists, motorcyclists, and other vehicles. Focus on communication, courtesy, and defensive driving techniques.",
  },
  {
    number: 8,
    title: "Driving safely through traffic",
    description:
      "Practice safe driving in heavy or urban traffic. This includes filtering, lane changes, and managing stop‑start conditions while maintaining awareness of everything happening around you.",
  },
  {
    number: 9,
    title: "Changing direction (more complex situations)",
    description:
      "Extend your turning skills to multi‑lane junctions, box junctions, and traffic‑light controlled crossings. You'll also tackle complex roundabouts and one‑way systems with confidence.",
  },
  {
    number: 10,
    title: "Speed management",
    description:
      "Learn to choose appropriate speeds for different roads and conditions – including motorways, national roads, and residential areas. Understand the impact of weather, visibility, and traffic density on speed.",
  },
  {
    number: 11,
    title: "Driving calmly",
    description:
      "Focus on eco‑driving techniques and smooth vehicle control. Reduce stress and improve fuel efficiency by anticipating changes in traffic flow and driving in a relaxed, controlled manner.",
  },
  {
    number: 12,
    title: "Night driving",
    description:
      "Experience driving in low‑light or night conditions. You'll learn to use lights correctly, adjust to reduced visibility, and handle glare from oncoming vehicles. This lesson is crucial for building confidence after dark.",
  },
];

// ------------------------------------------------------------------
// Component
// ------------------------------------------------------------------
export function EDTLessonsSection({
  heading = "The 12 EDT lessons",
  subheading = "The 12 EDT lessons are discussed below in accordance with the Road Safety Authority (RSA) syllabus.",
  lessons = defaultLessons,
  className,
  variant = "light",
}: EDTLessonsSectionProps) {
  const bgClass = variant === "muted" ? "bg-muted/30" : "bg-background";

  return (
    <section className={cn("py-20 px-6 transition-colors", bgClass, className)}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold leading-tight text-foreground mb-4">
            {heading}
          </h2>
          <p className="text-lg text-muted-foreground">{subheading}</p>
        </div>

        {/* Lessons grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {lessons.map((lesson) => (
            <div
              key={lesson.number}
              className="group relative p-6 rounded-2xl bg-card border border-border shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:border-primary/20"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold text-sm">
                  {String(lesson.number).padStart(2, "0")}
                </span>
                <h3 className="text-lg font-bold text-card-foreground">
                  {lesson.title}
                </h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {lesson.description}
              </p>
              {/* Decorative accent line */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-primary to-secondary transition-all duration-500 group-hover:w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}