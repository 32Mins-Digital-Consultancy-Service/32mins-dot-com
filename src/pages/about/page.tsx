import { useEffect, useLayoutEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useLenis } from "lenis/react";
import { smoothScrollTo } from "../../lib/scroll";
import { Menu } from "../../components/Menu";
import { ContactUsPage } from "../../components/ContactUs";
import Footer from "../../components/Footer";
import AboutUsSection from "./subpage/AboutUsSection";
import EmployeesSection from "./subpage/EmployeesSection";
import { SEO } from "../../components/SEO";

const SECTION_IDS = ["aboutus", "employees", "contactus"];

export const AboutPage = () => {
  const { hash } = useLocation();

  const aboutusRef = useRef<HTMLElement>(null);
  const employeesRef = useRef<HTMLElement>(null);
  const contactusRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const lenis = useLenis();

  useEffect(() => {
    if (hash) {
      const id = hash.slice(1);
      if (SECTION_IDS.includes(id)) {
        const el = document.getElementById(id);
        if (el) smoothScrollTo(lenis, el);
      }
    }
  }, [hash, lenis]);

  return (
    <div className="w-full bg-[#000016] items-center justify-center gap-[clamp(4.5rem,9vw,7.5rem)] flex flex-col max-w-full min-w-0 overflow-x-hidden">
      <SEO
        title="About Us | 32Mins - Empowering Digital Education & eLearning"
        description="32Mins Digital Consultancy Services is an IITM Pravartak-incubated EdTech consultancy at IIT Madras Research Park, Chennai, founded in 2023 by Sribalaji Ravi. We architect AI-driven eLearning platforms, adaptive digital applications and digital media, and power platforms such as SWAYAM Plus and NM-ICPS."
        canonical="https://32mins.com/about"
        keywords="32Mins about, eLearning company India, digital education, IIT Madras Research Park, IITM Pravartak, educational technology, AI eLearning platform, EdTech consultancy, Moodle engineers, SWAYAM Plus, NM-ICPS, team, digital consultancy Chennai"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          "name": "About 32Mins",
          "description": "IITM Pravartak-incubated EdTech consultancy architecting AI-driven eLearning platforms, adaptive digital applications and intelligent digital media to scale education globally.",
          "url": "https://32mins.com/about",
          "mainEntity": {
            "@type": "Organization",
            "name": "32Mins Digital Consultancy Services Pvt. Ltd.",
            "foundingDate": "2023",
            "founder": {
              "@type": "Person",
              "name": "Sribalaji Ravi",
              "jobTitle": "CEO & Founder",
            },
            "numberOfEmployees": { "@type": "QuantitativeValue", "value": 21 },
            "memberOf": {
              "@type": "Organization",
              "name": "IITM Pravartak Technologies Foundation",
            },
            "location": {
              "@type": "Place",
              "name": "IIT Madras Research Park",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "B5-01, B Block, 5th Floor, IIT Madras Research Park, Kanagam Road, Taramani",
                "addressLocality": "Chennai",
                "addressRegion": "Tamil Nadu",
                "postalCode": "600113",
                "addressCountry": "IN",
              },
            },
          },
        }}
      />
      <Menu />
      <main className="pt-24 sm:pt-28 md:pt-32 lg:pt-36 flex flex-col items-center justify-center w-full gap-[clamp(4.5rem,9vw,7.5rem)]">
        <section
          ref={aboutusRef}
          data-reveal-section="aboutus"
          id="aboutus"
          className="scroll-mt-32 w-full flex flex-col items-center justify-center"
        >
          <AboutUsSection />
        </section>
        <section
          ref={employeesRef}
          data-reveal-section="employees"
          id="employees"
          className="scroll-mt-32 w-full flex flex-col items-center justify-center"
        >
          <EmployeesSection />
        </section>
        <section
          ref={contactusRef}
          data-reveal-section="contactus"
          id="contactus"
          className="scroll-mt-16 w-full flex flex-col items-center justify-center"
        >
          <ContactUsPage />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
