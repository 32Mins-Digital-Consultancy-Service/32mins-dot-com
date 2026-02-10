import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Menu } from "../../components/Menu";
import { ContactUsPage } from "../../components/ContactUs";
import Footer from "../../components/Footer";
import AboutUsSection from "./subpage/AboutUsSection";
import EmployeesSection from "./subpage/EmployeesSection";

const SECTION_IDS = ["aboutus", "employees", "contactus"];
const REVEAL_SECTION_IDS = ["aboutus", "employees", "contactus"] as const;

export const AboutPage = () => {
  const { hash } = useLocation();

  const aboutusRef = useRef<HTMLElement>(null);
  const employeesRef = useRef<HTMLElement>(null);
  const contactusRef = useRef<HTMLElement>(null);

  const sectionRefsMap: Record<
    (typeof REVEAL_SECTION_IDS)[number],
    React.RefObject<HTMLElement | null>
  > = {
    aboutus: aboutusRef,
    employees: employeesRef,
    contactus: contactusRef,
  };

  const [visibleSections, setVisibleSections] = useState<
    Record<string, boolean>
  >(Object.fromEntries(REVEAL_SECTION_IDS.map((id) => [id, false])));

  // Observe sections for reveal animation
  useEffect(() => {
    const elements: Element[] = [];
    REVEAL_SECTION_IDS.forEach((id) => {
      const el = sectionRefsMap[id].current;
      if (el) elements.push(el);
    });
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.getAttribute("data-reveal-section");
          if (id && entry.isIntersecting) {
            setVisibleSections((prev) =>
              prev[id] ? prev : { ...prev, [id]: true }
            );
          }
        });
      },
      { threshold: 0.15 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Scroll to top before paint to avoid glitchy jump
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (hash) {
      const id = hash.slice(1);
      if (SECTION_IDS.includes(id)) {
        const el = document.getElementById(id);
        el?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [hash]);

  return (
    <div className="w-full bg-[#000016] items-center justify-center gap-10 sm:gap-14 md:gap-18 lg:gap-24 flex flex-col max-w-full min-w-0 overflow-x-hidden">
      <Menu />
      <main className="pt-24 sm:pt-28 md:pt-32 lg:pt-36 flex flex-col items-center justify-center w-full gap-10 sm:gap-14 md:gap-18 lg:gap-24">
        <section
          ref={aboutusRef}
          data-reveal-section="aboutus"
          id="aboutus"
          className="scroll-mt-24 w-full flex flex-col items-center justify-center"
        >
          <AboutUsSection isVisible={visibleSections.aboutus} />
        </section>
        <section
          ref={employeesRef}
          data-reveal-section="employees"
          id="employees"
          className="scroll-mt-24 w-full flex flex-col items-center justify-center"
        >
          <EmployeesSection isVisible={visibleSections.employees} />
        </section>
        <section
          ref={contactusRef}
          data-reveal-section="contactus"
          id="contactus"
          className="scroll-mt-16 w-full flex flex-col items-center justify-center"
        >
          <ContactUsPage isVisible={visibleSections.contactus} />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
