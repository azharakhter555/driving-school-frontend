// lib/constants.ts

export const SERVICES = [
  { href: "/edt", label: "EDT Lessons" },
  { href: "/pre-test", label: "Pre-Test Lessons" },
  { href: "/mock-test", label: "Mock Test" },
  { href: "/automatic", label: "Automatic Lessons" },
  { href: "/car-hire", label: "Car Hire for Driving Test" },
  { href: "/instructor-training", label: "Driving Instructor Training" },
];

export const STARTED = [
  { href: "/started/rules-of-the-road", label: "Rules of the Road Book" },
  { href: "/started/test-questions", label: "Driving Test Questions" },
  { href: "/started/road-signs", label: "Road Signs Ireland" },
  { href: "/started/mock-theory", label: "Mock Theory Test" },
  { href: "/started/before-test", label: "Before the Test" },
];

export const LOCATION = [
  { href: "/locations/waterford", label: "Waterford" },
  { href: "/locations/dublin", label: "Dublin" },
];

export const YOUTUBEVIDEOIDS = [
  { id: "_Mm7QVHFEPc", title: "How to do the Turnabout" },
  { id: "dQw4w9WgXcQ", title: "How to do the Hill Start" },
  { id: "9bZkp7q19f0", title: "How to reverse around the corner" },
  { id: "kJQP7kiw5Fk", title: "How to check under the bonnet" },
];

export const ABOUT = [
  { href: "/about/pricing", label: "Pricing" },
  { href: "/about/gift-voucher", label: "Gift Voucher" },
  { href: "/about/reviews", label: "Reviews" },
  { href: "/blog", label: "Blog" },
];

export const MOBILE_NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "About", children: ABOUT },
  { label: "Location", children: LOCATION },
  { label: "Getting Started", children: STARTED },
  { label: "Contact", href: "/Contact" },
];

export interface ServiceWITHIMAGETYPE {
  href: string;
  label: string;
  image: string;
  description?: string;
  icon?: string;
}

export const SERVICESWITHIMAGE: ServiceWITHIMAGETYPE[] = [
  {
    href: "/services/edt",
    label: "EDT Lessons",
    image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&h=400&fit=crop&q=80",
    icon: "fa-road",
    description:
      "Essential Driver Training (EDT) with certified instructors. Complete your 12 mandatory lessons.",
  },
  {
    href: "/services/pre-test",
    label: "Pre-Test Lessons",
    image: "https://images.unsplash.com/photo-1549317661-b8ac0d7fe8f4?w=600&h=400&fit=crop&q=80",
    icon: "fa-check-circle",
    description:
      "Focused sessions to polish your skills before the big day. Build confidence and master tricky maneuvers.",
  },
  {
    href: "/services/mock-test",
    label: "Mock Test",
    image: "https://images.unsplash.com/photo-1436262513933-a0b06755c784?w=600&h=400&fit=crop&q=80",
    icon: "fa-clipboard-list",
    description:
      "Full realistic test simulation with detailed feedback. Experience the real test environment.",
  },
  {
    href: "/services/automatic",
    label: "Automatic Lessons",
    image: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&h=400&fit=crop&q=80",
    icon: "fa-car",
    description:
      "Learn to drive with ease in our automatic vehicles. Perfect for city driving and nervous beginners.",
  },
  {
    href: "/services/car-hire",
    label: "Car Hire for Driving Test",
    image: "https://images.unsplash.com/photo-1550355291-bbee04a92027?w=600&h=400&fit=crop&q=80",
    icon: "fa-key",
    description:
      "Hire a reliable, test-ready vehicle for your driving exam. Dual controls included for safety.",
  },
  {
    href: "/services/instructor-training",
    label: "Driving Instructor Training",
    image: "https://images.unsplash.com/photo-1592997656881-3d33b7c2e7c3?w=600&h=400&fit=crop&q=80",
    icon: "fa-chalkboard-teacher",
    description:
      "Train to become a certified driving instructor with our expert program. Start your new career today.",
  },
];

export const SCHOLINFO = {
  name: "National Driving School",
  logo: "/assets/logo.png", // or a URL
  rating: 4.9,
  reviewCount: 2350,
  poweredBy: "Google",
};

// Define your reviews
export const REVIEWS = [
  {
    id: "1",
    name: "Erica Whelan",
    date: "last year",
    text: "I done three pre tests with Damien in Tallaght, and passed first time...",
    avatar: "https://ui-avatars.com/api/?name=Erica+Whelan&background=1a56db&color=fff&size=48",
  },
  {
    id: "2",
    name: "Deepa Sridhar",
    date: "last year",
    text: "Heartfelt Thanks for Your Incredible Support Kevin Veeren!...",
    avatar: "https://ui-avatars.com/api/?name=Deepa+Sridhar&background=1a56db&color=fff&size=48",
  },
  // ... more reviews
];

// Define your clients
export const CLIENTS = [
  { id: "1", name: "Client 1", logo: "/clients/logo1.png" },
  { id: "2", name: "Client 2", logo: "/clients/logo2.png" },
  { id: "3", name: "Client 3", logo: "/clients/logo3.png" },
];

export const WORKDAY_START = "09:00";
export const WORKDAY_END = "17:00";
export const DEFAULT_BREAK_START = "12:00";
export const DEFAULT_BREAK_END = "13:00";
