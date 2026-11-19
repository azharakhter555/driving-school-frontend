import { ContentBlock } from "@/components/shared/ContentBlock";
import { FeatureGrid } from "@/components/shared/FeatureGrid";

export  function DrivingSections() {
  return (
    <main>
      {/* 1st: Learn to drive – image left */}
      <ContentBlock
        heading="Learn to drive Driving Lessons Dublin"
        subheading="Learn to drive with Driving Lessons in Dublin"
        paragraphs={[
          "You must be seeing others finding difficulty in either learning to drive or passing the test later. But why does that happen? What are the shortcomings that create issues which further restricts us to get on the road?",
          "Well, we know the answer. It is different for everyone. Everyone learns with driving lessons Dublin at a different pace and speed, some are quick to learn others not so quick.",
          "Here, we work on that basis and make you learn every bit of what is required. We identify the shortcomings and then help you solve it and then excel. Be quicker than others and pass the driving test in least amount of time.",
          "Book your driving lessons in Dublin. We have the most professional instructors to help you with the excitement of driving for the first time. We make sure that you are updated with all the latest features of a car and know how to use them as well.",
          "We provide you with the vehicle most suitable for you to learn which would comfort you coupled with a friendly instructor who will keep you relaxed and will instruct you each step of the way.",
          "Book your driving lessons today in Dublin and get started now with your EDT driving lessons which will eventually make you pass the test easily, with a greater score and at your first attempt.",
        ]}
        imageSrc="https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&q=80" // Replace with your own
        imageAlt="Driving lessons in Dublin"
        layout="left"
        variant="light"
        cta={{
          label: "Book Your Lessons",
          href: "/book-now",
        }}
      />

      {/* 2nd: Become a Driving Instructor – image right */}
      <ContentBlock
        heading="Become a Driving Instructor"
        subheading="Become a Qualified RSA ADI instructor and Change Your Life"
        paragraphs={[
          "We have a specially designed driver training program who all who are aspiring to become driving instructors. Our program is fully RSA accredited for which you need to qualify.",
          "Also, there are many requirements that you need to fulfil to become an instructor like the person must have the clean driving license experience for at least 2 years and have tax clearance.",
          "But if you are not aware of the specifications then don't worry, we will guide you for the procedure and even help you get through all the criteria.",
        ]}
        imageSrc="https://images.unsplash.com/photo-1605456547901-20d1d8c947a4?w=800&q=80" // Replace
        imageAlt="Driving instructor training"
        layout="right"
        variant="muted"
        cta={{
          label: "Start Your Journey",
          href: "/become-instructor",
        }}
      />

      {/* 3rd optional: Feature Grid (three columns) */}
      <FeatureGrid
        heading="Why become an instructor with us"
        subheading="Your path to a rewarding career"
        description="Join our RSA-approved programme and start a new career with flexibility and purpose."
        features={[
          {
            icon: "fa-certificate",
            title: "RSA Accredited",
            description: "Our programme is fully approved by the Road Safety Authority.",
          },
          {
            icon: "fa-chalkboard-teacher",
            title: "Expert Trainers",
            description: "Learn from the best with decades of experience in driver training.",
          },
          {
            icon: "fa-hand-holding-heart",
            title: "Ongoing Support",
            description: "We provide guidance through every step, from application to qualification.",
          },
        ]}
        variant="light"
      />
    </main>
  );
}