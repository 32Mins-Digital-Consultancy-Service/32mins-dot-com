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
      setIsMobile(window.innerWidth < 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className="flex gap-30 items-center justify-center fixed top-0 left-0 right-0 z-50 bg-transparent mt-9">
      <img src={Badge} alt="badge" className="w-15 h-20" />

      {!isMobile && (
        <nav
          className={`flex gap-8 py-4 px-6 rounded-2xl transition-all duration-300 border border-[#1B1B1B] ${
            isScrolled
              ? "bg-white/10 backdrop-blur-sm shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] hover:bg-white/15"
              : "bg-white/5 backdrop-blur-none hover:bg-white/10"
          }`}
        >
          {menuItems.map((item) => (
            <a
              key={item.name}
              href={`#${item.id}`}
              className="text-white/90 hover:text-white transition-colors duration-200"
            >
              {item.name}
            </a>
          ))}
        </nav>
      )}
      {activeBrochure ? (
        <CtaButton variant="secondary" onClick={() => setActiveBrochure(false)}>
          Brochure
        </CtaButton>
      ) : (
        <CtaButton variant="primary" onClick={() => setActiveBrochure(true)}>
          Brochure
        </CtaButton>
      )}
    </header>
  );
};
