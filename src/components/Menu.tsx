// Menu.tsx
import { useState } from "react";
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
  return (
    <div className="flex gap-30 items-center justify-center sticky top-0 z-50 bg-transparent">
      <img src={Badge} alt="badge" className="w-15 h-20" />
      <div className="flex gap-8 p-6 rounded-2xl  border border-[#1B1B1B] bg-gradient-to-r from-[#1D1D1B]/50 via-white/50 to-[#1D1D1B]/50 bg-blend-soft-light backdrop-blur-md">
        {menuItems.map((item) => (
          <a key={item.name} href={`#${item.id}`}>
            {item.name}
          </a>
        ))}
      </div>
      {activeBrochure ? (
        <CtaButton variant="secondary" onClick={() => setActiveBrochure(false)}>
          Brochure
        </CtaButton>
      ) : (
        <CtaButton variant="primary" onClick={() => setActiveBrochure(true)}>
          Brochure
        </CtaButton>
      )}
    </div>
  );
};
