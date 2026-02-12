// Menu.tsx
import { useState, useEffect, useLayoutEffect } from "react";
import { Link } from "react-router-dom";
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
  const [scrollToTop, setScrollToTop] = useState(false);

  useLayoutEffect(() => {
    if (scrollToTop) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setScrollToTop(false);
    }
  }, [scrollToTop]);

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

  // Close mobile menu on Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMobileMenuOpen(false);
    };
    if (isMobileMenuOpen) {
      window.addEventListener("keydown", handleEscape);
      return () => window.removeEventListener("keydown", handleEscape);
    }
  }, [isMobileMenuOpen]);

  return (
    <>
      <header className="flex gap-2 sm:gap-4 md:gap-6 lg:gap-30 items-center justify-between md:justify-center fixed top-0 left-0 right-0 z-50 bg-transparent mt-4 md:mt-7 lg:mt-9 w-full max-w-full min-w-0 overflow-x-hidden box-border pl-[max(0.75rem,env(safe-area-inset-left))] pr-[max(0.75rem,env(safe-area-inset-right))] md:pl-0 md:pr-0">
        <Link to="/" className="flex-shrink-0 min-w-0">
          <img
            src="/Badge.webp"
            alt="badge"
            className={`w-10 h-[2.5rem] sm:w-12 sm:h-16 md:w-14 md:h-[4.5rem] lg:w-16 lg:h-20 ${
              isScrolled ? "scale-80" : "scale-100"
            } transition-all duration-300 object-contain`}
            onClick={() => setScrollToTop(true)}
          />
        </Link>

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
              <Link
                key={item.name}
                to={`/#${item.id}`}
                className="relative text-white/90 hover:text-white transition-colors duration-200 text-sm lg:text-base whitespace-nowrap after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-white after:transition-all after:duration-300 hover:after:w-full "
              >
                {item.name}
              </Link>
            ))}
          </nav>
        )}

        {/* Mobile Hamburger Button */}
        <div className="flex flex-shrink-0 gap-1.5 sm:gap-2 items-center justify-center min-w-0">
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
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`flex flex-col justify-center gap-1.5 min-w-[44px] min-h-[44px] p-3 rounded-xl transition-all duration-300 border border-[#1B1B1B] touch-manipulation ${
                isScrolled
                  ? "bg-white/10 backdrop-blur-sm shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]"
                  : "bg-white/5 backdrop-blur-none"
              }`}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
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
          aria-hidden={!isMobileMenuOpen}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm touch-none"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Menu Panel */}
          <nav
            className={`absolute top-0 right-0 h-full w-[min(18rem,100vw-2rem)] max-w-[85vw] bg-[#0A0A0A]/95 backdrop-blur-lg border-l border-[#1B1B1B] shadow-2xl transition-transform duration-300 flex flex-col pt-[calc(5rem+env(safe-area-inset-top))] pb-[env(safe-area-inset-bottom)] pr-[env(safe-area-inset-right)] ${
              isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
            aria-label="Mobile navigation"
          >
            <div className="flex flex-col gap-1 overflow-y-auto flex-1 px-6 py-4">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  to={`/#${item.id}`}
                  onClick={handleMenuItemClick}
                  className="text-white/90 hover:text-white active:bg-white/10 transition-all duration-200 py-4 px-4 rounded-xl text-lg min-h-[48px] flex items-center touch-manipulation"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      )}
    </>
  );
};
