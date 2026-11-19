import { Hero } from "../components/layout/Hero";
import { DrivingLessons } from "../components/sections/DrivingLessons";
import { HowItWorks } from "../components/sections/HowWork";
import { ServicesSection } from "../components/sections/ServicesSection";
import { SERVICESWITHIMAGE,SCHOLINFO,REVIEWS,CLIENTS } from "../lib/constants";
import { FirstLessonSection } from "../components/sections/FirstLessonSection";
import { TestimonialsSection } from "../components/sections/TestimonialsSection";
import { ResourcesSection } from "../components/sections/ResourcesSection";
import { LocationsSection } from "../components/sections/locationsSection";
import { WhyChooseUsSection } from "../components/sections/WhyChooseUsSection";
import { DrivingSections } from "../components/sections/DrivingSections";


export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Hero />
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
      <HowItWorks />
    
      <ServicesSection
        heading="Popular Lessons"
        subheading="Most requested"
        services={SERVICESWITHIMAGE}
      />
      <FirstLessonSection />
      <TestimonialsSection
        heading="What people say"
        subheading="Our Happy Pupils"
        description="We take great pride in our customer reviews across all platforms!"
        school={SCHOLINFO}
        reviews={REVIEWS}
        clients={CLIENTS}
        variant="light" // or "primary"
      />
      <ResourcesSection />
      <LocationsSection />
      <WhyChooseUsSection />
      <DrivingSections/>
    </div>
  )
}