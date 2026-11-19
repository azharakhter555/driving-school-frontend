import { ServiceHero } from "@/components/sections/ServiceHero";
import { DrivingLessons } from "@/components/sections/DrivingLessons";
import { EDTReasonsSection } from "@/components/sections/EDTReasonsSection";
import { EDTLessonsSection } from "@/components/sections/EDTLessonsSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { VideoGallery } from "@/components/sections/VideoGallery";
import { YOUTUBEVIDEOIDS } from "@/lib/constants";

export default function EDT() {
  return (
    <>
      <ServiceHero
        backgroundImage="/assets/hero-background.avif"
        overlaySide="left"
        alignment="left"
        title="Start Your Driving Lessons with National Driving School."
        subtitle="Time to kick start your driving lessons Dublin with one of the highest rated driving schools around."
        ctaPrimary={{ label: "Prices", href: "/prices" }}
        ctaPhone="085 118 1111"
      />
      <DrivingLessons
        title='Become a confident <span class="text-[#1a56db] dark:text-[#3b82f6]">safe driver</span> with our expert driving lessons Dublin.'
        description="Time to kick start your driving lessons Dublin with one of the highest rated driving schools around town and Dublin City."
        videoId="dQw4w9WgXcQ"
        ctaLabel="Get Prices"
        ctaHref="/prices"
        phoneNumber="085 118 1111"
        badge="5.0 ★ (1,200+ reviews)"
        trustLine="Fully insured · RSA approved instructors"
        curveStyle="wave"
      />

      {/* 2. Why EDT + Automatic cars explanation */}
      <EDTReasonsSection variant="light" />

      {/* 3. The 12 EDT lessons grid */}
      <EDTLessonsSection variant="muted" />
      <VideoGallery
        heading="Driving Techniques"
        subheading="Master essential manoeuvres with our step‑by‑step video guides"
        videos={YOUTUBEVIDEOIDS}
        columns={2}
        variant="light"
      />
      <FAQSection variant="light" />
    </>
  );
}
