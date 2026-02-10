// HomePage.tsx
import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Menu } from "../../components/Menu";
import { UpdatesPage } from "./subpages/Updates";
import { SolutionsPage } from "./subpages/Solutions";
import { AboutUsPage } from "./subpages/AboutUs";
import { ClientsPage } from "./subpages/Client";
import { WhyUsPage } from "./subpages/WhyUs";
import { ContactUsPage } from "../../components/ContactUs";
import { Summary } from "../../components/Summary";
import Footer from "../../components/Footer";

const SECTION_IDS = [
  "updates",
  "solutions",
  "aboutus",
  "clients",
  "whyus",
  "contactus",
];

const REVEAL_SECTION_IDS = [
  "solutions",
  "aboutus",
  "clients",
  "whyus",
  "contactus",
] as const;

export const HomePage = () => {
  const { hash } = useLocation();
  const summaryRef = useRef<HTMLDivElement | null>(null);
  const earthRef = useRef<HTMLDivElement | null>(null);
  const [gradientHeight, setGradientHeight] = useState(200);
  const [earthVisible, setEarthVisible] = useState(false);

  const solutionsRef = useRef<HTMLElement>(null);
  const aboutusRef = useRef<HTMLElement>(null);
  const clientsRef = useRef<HTMLElement>(null);
  const whyusRef = useRef<HTMLElement>(null);
  const contactusRef = useRef<HTMLElement>(null);

  const sectionRefsMap: Record<
    (typeof REVEAL_SECTION_IDS)[number],
    React.RefObject<HTMLElement | null>
  > = {
    solutions: solutionsRef,
    aboutus: aboutusRef,
    clients: clientsRef,
    whyus: whyusRef,
    contactus: contactusRef,
  };

  const [visibleSections, setVisibleSections] = useState<
    Record<string, boolean>
  >(Object.fromEntries(REVEAL_SECTION_IDS.map((id) => [id, false])));

  // Observe sections for reveal animation (single useEffect in parent)
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

  // Trigger earth rotate animation only when scrolled into view
  useEffect(() => {
    const el = earthRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setEarthVisible(true);
          observer.disconnect(); // Only animate once
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Scroll to section when hash in URL (e.g. after menu click or navigation from /about)
  useEffect(() => {
    if (hash) {
      const id = hash.slice(1);
      if (SECTION_IDS.includes(id)) {
        const el = document.getElementById(id);
        el?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [hash]);

  useEffect(() => {
    const updateHeight = () => {
      if (summaryRef.current) {
        const summaryHeight = summaryRef.current.offsetHeight;
        setGradientHeight(summaryHeight * 0.9);
      }
    };

    let resizeObserver: ResizeObserver | null = null;
    const timeoutId = setTimeout(() => {
      updateHeight();

      // Set up ResizeObserver for more accurate measurements
      if (summaryRef.current && window.ResizeObserver) {
        resizeObserver = new ResizeObserver(updateHeight);
        resizeObserver.observe(summaryRef.current);
      }
    }, 0);

    // Handle window resize
    window.addEventListener("resize", updateHeight);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", updateHeight);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, []);

  return (
    <div className="bg-linear-to-t from-[#000016] to-[#000C30] flex flex-col items-center justify-center gap-10 sm:gap-10 md:gap-12 lg:gap-16 xl:gap-20 w-full max-w-full min-w-0 overflow-x-hidden">
      <Menu />
      <div className="relative bg-[url('/bg-image.png')] bg-center bg-cover w-full bg-no-repeat flex flex-col items-center justify-center">
        <div className="absolute inset-0 bg-[#091951] w-full mix-blend-overlay "></div>
        <div className="absolute inset-0 bg-linear-to-t from-[#000000] to-[#000000]/0 w-full mix-blend-overlay "></div>
        <section
          id="updates"
          className="z-10 relative scroll-mt-20 w-full max-w-full min-w-0 flex flex-col items-center justify-center overflow-x-hidden"
        >
          <UpdatesPage />
        </section>
        <div
          ref={earthRef}
          className="relative h-screen w-full overflow-hidden "
        >
          <img
            src="/earth2.png"
            alt="earth"
            className={` w-full absolute bottom-0 bg-gradient-to-b  ${
              earthVisible ? "earthRotate-effect" : "earthRotate-initial"
            }`}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />

          <div
            className="absolute bottom-0 bg-linear-to-t from-[#000000] to-[#000000]/0 w-full flex justify-center items-end"
            style={{ height: `${gradientHeight}px` }}
          ></div>
        </div>

        <Summary ref={summaryRef} />
      </div>
      <section
        ref={solutionsRef}
        data-reveal-section="solutions"
        id="solutions"
        className="scroll-mt-24 w-full flex flex-col items-center justify-center"
      >
        <SolutionsPage isVisible={visibleSections.solutions} />
      </section>
      <section
        ref={aboutusRef}
        data-reveal-section="aboutus"
        id="aboutus"
        className="scroll-mt-24 w-full flex flex-col items-center justify-center"
      >
        <AboutUsPage isVisible={visibleSections.aboutus} />
      </section>
      <section
        ref={clientsRef}
        data-reveal-section="clients"
        id="clients"
        className="scroll-mt-24 w-full flex flex-col items-center justify-center"
      >
        <ClientsPage isVisible={visibleSections.clients} />
      </section>
      <section
        ref={whyusRef}
        data-reveal-section="whyus"
        id="whyus"
        className="scroll-mt-24 w-full flex flex-col items-center justify-center"
      >
        <WhyUsPage isVisible={visibleSections.whyus} />
      </section>
      <section
        ref={contactusRef}
        data-reveal-section="contactus"
        id="contactus"
        className="scroll-mt-16 w-full flex flex-col items-center justify-center"
      >
        <ContactUsPage isVisible={visibleSections.contactus} />
      </section>
      <Footer />
    </div>
  );
};
