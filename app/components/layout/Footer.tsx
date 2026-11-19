"use client";

import Link from "next/link";

// ------------------------------------------------------------------
// Component
// ------------------------------------------------------------------
export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand / About */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white">National Driving School</h3>
            <p className="text-sm leading-relaxed text-gray-400">
              Get the best driving lessons from the best trained and skilled
              instructors in Dublin.
            </p>
            {/* Social icons (optional) */}
            <div className="flex space-x-3 pt-2">
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <i className="fab fa-facebook-f text-sm" />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <i className="fab fa-twitter text-sm" />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <i className="fab fa-instagram text-sm" />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-colors"
                aria-label="YouTube"
              >
                <i className="fab fa-youtube text-sm" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-3">Navigation</h4>
            <ul className="space-y-2 text-sm">
              {[
                "Home",
                "Started",
                "Services",
                "About",
                "Vouchers",
                "Prices",
                "Local",
                "Reviews",
                "FAQ",
                "Gallery",
                "Blog",
                "Contact",
              ].map((item) => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase()}`}
                    className="hover:text-white transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Locations & Services combined in one column on desktop, split on large screens */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {/* Locations */}
              <div>
                <h4 className="text-white font-semibold text-lg mb-3">
                  Locations
                </h4>
                <ul className="space-y-1.5 text-sm">
                  {[
                    "Dublin",
                    "Tallaght",
                    "Dun Laoghaire",
                    "Naas",
                    "Navan",
                    "Finglas",
                    "Clondalkin",
                    "Swords",
                    "Raheny",
                    "Drogheda",
                    "Balbriggan",
                    "Bray",
                    "Saggart",
                  ].map((loc) => (
                    <li key={loc}>
                      <Link
                        href={`/locations/${loc.toLowerCase()}`}
                        className="hover:text-white transition-colors"
                      >
                        {loc}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Services */}
              <div>
                <h4 className="text-white font-semibold text-lg mb-3">
                  Services
                </h4>
                <ul className="space-y-1.5 text-sm">
                  {[
                    "EDT Lessons",
                    "Pretest Lessons",
                    "Manual",
                    "Automatic",
                    "Test Car Hire",
                    "Mock Test Lessons",
                    "RSA Test Centres",
                    "Instructor Training",
                  ].map((service) => (
                    <li key={service}>
                      <Link
                        href={`/services/${service
                          .toLowerCase()
                          .replace(/ /g, "-")}`}
                        className="hover:text-white transition-colors"
                      >
                        {service}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Contact & Opening Hours row */}
        <div className="mt-12 pt-8 border-t border-gray-800 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div className="flex items-center gap-3">
            <i className="fas fa-phone-alt text-primary text-lg w-6" />
            <span>085 118 1111</span>
          </div>
          <div className="flex items-center gap-3">
            <i className="fas fa-envelope text-primary text-lg w-6" />
            <a href="mailto:info@nationaldrivingschool.ie" className="hover:text-white transition-colors">
              info@nationaldrivingschool.ie
            </a>
          </div>
          <div className="flex items-start gap-3">
            <i className="fas fa-clock text-primary text-lg w-6 mt-0.5" />
            <div>
              <div>Monday – Friday (7am – 6pm)</div>
              <div>Saturday – Sunday (7am – 6pm)</div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-gray-800 text-center text-xs text-gray-500">
          <p>
            © {new Date().getFullYear()} National Driving School. All rights
            reserved.
          </p>
          <p className="mt-1">
            Designed with <i className="fas fa-heart text-primary text-xs" /> in
            Dublin
          </p>
        </div>
      </div>
    </footer>
  );
}