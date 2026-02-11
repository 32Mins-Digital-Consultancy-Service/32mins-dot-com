// HomePage.tsx
import { useEffect, useLayoutEffect, useRef } from "react";
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
import EarthImage from "../../components/EarthImage";

const SECTION_IDS = [
  "updates",
  "solutions",
  "aboutus",
  "clients",
  "whyus",
  "contactus",
];

export const HomePage = () => {
  const { hash } = useLocation();
  const summaryRef = useRef<HTMLDivElement | null>(null);
  const solutionsRef = useRef<HTMLElement>(null);
  const aboutusRef = useRef<HTMLElement>(null);
  const clientsRef = useRef<HTMLElement>(null);
  const whyusRef = useRef<HTMLElement>(null);
  const contactusRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!hash) return;

    const id = hash.slice(1);
    if (!SECTION_IDS.includes(id)) return;

    const timeout = setTimeout(() => {
      const el = document.getElementById(id);
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);

    return () => clearTimeout(timeout);
  }, [hash]);

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
        <EarthImage />

        <Summary ref={summaryRef} />
      </div>
      <section
        ref={solutionsRef}
        id="solutions"
        className="scroll-mt-24 w-full flex flex-col items-center justify-center"
      >
        <SolutionsPage />
      </section>
      <section
        ref={aboutusRef}
        id="aboutus"
        className="scroll-mt-24 w-full flex flex-col items-center justify-center"
      >
        <AboutUsPage />
      </section>
      <section
        ref={clientsRef}
        id="clients"
        className="scroll-mt-24 w-full flex flex-col items-center justify-center"
      >
        <ClientsPage />
      </section>
      <section
        ref={whyusRef}
        id="whyus"
        className="scroll-mt-24 w-full flex flex-col items-center justify-center"
      >
        <WhyUsPage />
      </section>
      <section
        ref={contactusRef}
        id="contactus"
        className="scroll-mt-16 w-full flex flex-col items-center justify-center"
      >
        <ContactUsPage />
      </section>
      <Footer />
    </div>
  );
};
