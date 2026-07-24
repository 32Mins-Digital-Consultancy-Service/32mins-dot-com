// HomePage.tsx
import { useEffect, useLayoutEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useLenis } from "lenis/react";
import { smoothScrollTo } from "../../lib/scroll";
import { Menu } from "../../components/Menu";
import HeroSection from "./subpages/HeroPage";
import { SolutionsPage } from "./subpages/Solutions";
import { AboutUsPage } from "./subpages/AboutUs";
import { ClientsPage } from "./subpages/Client";
import { WhyUsPage } from "./subpages/WhyUs";
import { ContactUsPage } from "../../components/ContactUs";
import Footer from "../../components/Footer";
import UpdatePage from "./subpages/Updates";
import { SEO } from "../../components/SEO";
import OurPerjectPage from "./subpages/OurProject";

const SECTION_IDS = [
  "solutions",
  "aboutus",
  "clients",
  "whyus",
  "ourprojects",
  "contactus",
];

export const HomePage = () => {
  const { hash } = useLocation();
  const solutionsRef = useRef<HTMLElement>(null);
  const aboutusRef = useRef<HTMLElement>(null);
  const clientsRef = useRef<HTMLElement>(null);
  const whyusRef = useRef<HTMLElement>(null);
  const ourprojectsRef = useRef<HTMLElement>(null);
  const contactusRef = useRef<HTMLElement>(null);

  const lenis = useLenis();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!hash) return;

    const id = hash.slice(1);
    if (!SECTION_IDS.includes(id)) return;

    const timeout = setTimeout(() => {
      const el = document.getElementById(id);
      if (el) smoothScrollTo(lenis, el);
    }, 100);

    return () => clearTimeout(timeout);
  }, [hash, lenis]);

  return (
    <div className="bg-linear-to-t from-[#000016] to-[#000C30] flex flex-col items-center justify-center gap-[clamp(4.5rem,9vw,7.5rem)] w-full max-w-full min-w-0 overflow-x-hidden">
      <SEO
        title="32Mins | Converting Meaningful Knowledge Into Impactful Digital Content"
        description="32Mins transforms meaningful knowledge into impactful digital content. Specializing in eLearning production, digital media, lab & industry learning videos, LMS management, and eLearning consulting. Trusted by IIT Madras, Virginia Tech & more."
        canonical="https://32mins.com/"
        keywords="eLearning production, digital media production, LMS management, corporate training videos, educational video production, digital content, eLearning consulting, lab learning videos, industry learning, 32Mins, IIT Madras, Chennai"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "32Mins - Digital Content & eLearning Solutions",
          description:
            "Converting meaningful knowledge into impactful digital content for everyone.",
          url: "https://32mins.com/",
          provider: {
            "@type": "Organization",
            name: "32Mins Digital Consultancy Services Pvt. Ltd.",
            url: "https://32mins.com",
          },
          offers: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Digital Media Production",
              },
            },
            {
              "@type": "Offer",
              itemOffered: { "@type": "Service", name: "eLearning Production" },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Lab & Industry Learning Video Production",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Media Content Marketing",
              },
            },
            {
              "@type": "Offer",
              itemOffered: { "@type": "Service", name: "eLearning Consulting" },
            },
            {
              "@type": "Offer",
              itemOffered: { "@type": "Service", name: "LMS Management" },
            },
          ],
        }}
      />
      <Menu />
      <div className="relative w-full flex flex-col items-stretch">
        {/* Textured backdrop dissolves into the page gradient via an alpha
            mask. It fades out early in the globe section so the artwork's
            wave shapes never show as arcs beside the earth. */}
        <div className="absolute inset-0 bg-[url('/bg-image.webp')] bg-center bg-cover bg-no-repeat [mask-image:linear-gradient(to_bottom,black_42%,transparent_66%)]">
          <div className="absolute inset-0 bg-[#091951] w-full mix-blend-overlay "></div>
          <div className="absolute inset-0 bg-linear-to-t from-[#000000] to-[#000000]/0 w-full mix-blend-overlay "></div>
        </div>
        <section className="z-10 relative scroll-mt-20 w-full max-w-full min-w-0 flex flex-col items-center justify-center overflow-x-hidden min-h-[var(--viewport-height)] h-[var(--viewport-height)]">
          <HeroSection />
        </section>
        <UpdatePage />
      </div>
      <section
        ref={solutionsRef}
        id="solutions"
        className="scroll-mt-32 w-full flex flex-col items-center justify-center"
      >
        <SolutionsPage />
      </section>
      <section
        ref={aboutusRef}
        id="aboutus"
        className="scroll-mt-32 w-full flex flex-col items-center justify-center"
      >
        <AboutUsPage />
      </section>
      <section
        ref={clientsRef}
        id="clients"
        className="scroll-mt-32 w-full flex flex-col items-center justify-center"
      >
        <ClientsPage />
      </section>
      <section
        ref={whyusRef}
        id="whyus"
        className="scroll-mt-32 w-full flex flex-col items-center justify-center"
      >
        <WhyUsPage />
      </section>
      <section
        ref={ourprojectsRef}
        id="ourprojects"
        className="scroll-mt-32 w-full flex flex-col items-center justify-center"
      >
        <OurPerjectPage />
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
