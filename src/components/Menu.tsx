// Menu.tsx
import { useState, useEffect } from "react";
import Badge from "../images/Badge.png";
import CtaButton from "./CtaButton";

const menuItems = [
  { name: "Updates", id: "updates" },
  { name: "Solutions", id: "solutions" },
  { name: "About Us", id: "aboutus" },
  { name: "Clients", id: "clients" },
  { name: "Why Us", id: "whyus" },
  { name: "Contact Us", id: "contactus" },
];

export const Menu = () => {
  const [activeBrochure, setActiveBrochure] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize(); // Call on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close mobile menu when clicking on a menu item
  const handleMenuItemClick = () => {
    setIsMobileMenuOpen(false);
  };

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header className="flex gap-4 md:gap-6 lg:gap-30 items-center justify-between md:justify-center fixed top-0 left-0 right-0 z-50 bg-transparent mt-5 md:mt-7 lg:mt-9 px-4 md:px-0">
        <img
          src={Badge}
          alt="badge"
          className="w-12 h-16 md:w-14 md:h-18 lg:w-15 lg:h-20"
        />

        {/* Desktop and Tablet Navigation */}
        {!isMobile && (
          <nav
            className={`flex gap-3 md:gap-4 lg:gap-8 py-3 md:py-3.5 lg:py-4 px-4 md:px-5 lg:px-6 rounded-2xl transition-all duration-300 border border-[#1B1B1B] ${
              isScrolled
                ? "bg-white/10 backdrop-blur-sm shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] hover:bg-white/15"
                : "bg-white/5 backdrop-blur-none hover:bg-white/10"
            }`}
          >
            {menuItems.map((item) => (
              <a
                key={item.name}
                href={`#${item.id}`}
                className="text-white/90 hover:text-white transition-colors duration-200 text-sm md:text-sm lg:text-base whitespace-nowrap"
              >
                {item.name}
              </a>
            ))}
          </nav>
        )}

        {/* Mobile Hamburger Button */}
        <div className="flex gap-2 items-center justify-center">
          {activeBrochure ? (
            <CtaButton
              variant="secondary"
              onClick={() => setActiveBrochure(false)}
            >
              Brochure
            </CtaButton>
          ) : (
            <CtaButton
              variant="primary"
              onClick={() => setActiveBrochure(true)}
            >
              Brochure
            </CtaButton>
          )}
          {isMobile && (
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`flex flex-col gap-1.5 p-3 rounded-xl transition-all duration-300 border border-[#1B1B1B] ${
                isScrolled
                  ? "bg-white/10 backdrop-blur-sm shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]"
                  : "bg-white/5 backdrop-blur-none"
              }`}
              aria-label="Toggle menu"
            >
              <span
                className={`w-6 h-0.5 bg-white transition-all duration-300 ${
                  isMobileMenuOpen ? "rotate-45 translate-y-2" : ""
                }`}
              />
              <span
                className={`w-6 h-0.5 bg-white transition-all duration-300 ${
                  isMobileMenuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`w-6 h-0.5 bg-white transition-all duration-300 ${
                  isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
                }`}
              />
            </button>
          )}
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobile && (
        <div
          className={`fixed inset-0 z-40 transition-all duration-300 ${
            isMobileMenuOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Menu Panel */}
          <nav
            className={`absolute top-0 right-0 h-full w-72 bg-[#0A0A0A]/95 backdrop-blur-lg border-l border-[#1B1B1B] shadow-2xl transition-transform duration-300 ${
              isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex flex-col gap-2 p-8 pt-32">
              {menuItems.map((item) => (
                <a
                  key={item.name}
                  href={`#${item.id}`}
                  onClick={handleMenuItemClick}
                  className="text-white/90 hover:text-white hover:bg-white/5 transition-all duration-200 py-4 px-6 rounded-xl text-lg"
                >
                  {item.name}
                </a>
              ))}
            </div>
          </nav>
        </div>
      )}
    </>
  );
};
