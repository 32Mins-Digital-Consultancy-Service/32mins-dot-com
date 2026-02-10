// HomePage.tsx
import { useState, useEffect, useRef } from "react";
import { Menu } from "../../components/Menu";
import { UpdatesPage } from "./subpages/Updates";
import { SolutionsPage } from "./subpages/Solutions";
import { AboutUsPage } from "./subpages/AboutUs";
import { ClientsPage } from "./subpages/Client";
import { WhyUsPage } from "./subpages/WhyUs";
import { ContactUsPage } from "../../components/ContactUs";
import { Summary } from "../../components/Summary";
import Footer from "../../components/Footer";

export const HomePage = () => {
  const summaryRef = useRef<HTMLDivElement | null>(null);
  const [gradientHeight, setGradientHeight] = useState(200);

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
    <div className="bg-linear-to-t from-[#000016] to-[#000C30] flex flex-col items-center justify-center gap-10 sm:gap-10 md:gap-12 lg:gap-16 xl:gap-20">
      <Menu />
      <div className="relative bg-[url('/bg-image.png')] bg-center bg-cover w-full bg-no-repeat flex flex-col items-center justify-center">
        <div className="absolute inset-0 bg-[#091951] w-full mix-blend-overlay "></div>
        <div className="absolute inset-0 bg-linear-to-t from-[#000000] to-[#000000]/0 w-full mix-blend-overlay "></div>
        <section
          id="updates"
          className="z-10 relative scroll-mt-20 w-full flex flex-col items-center justify-center "
        >
          <UpdatesPage />
        </section>
        <div className="relative h-screen w-full overflow-hidden">
          <img
            src="/earth.jpg"
            alt="earth"
            className="mix-blend-lighten w-full absolute bottom-0"
            style={{ transform: "translateY(50%) rotate(90deg)" }}
          />
          <div
            className="absolute bottom-0 bg-linear-to-t from-[#000000] to-[#000000]/0 w-full flex justify-center items-end"
            style={{ height: `${gradientHeight}px` }}
          ></div>
        </div>

        <Summary ref={summaryRef} />
      </div>
      <section
        id="solutions"
        className="scroll-mt-24 w-full flex flex-col items-center justify-center"
      >
        <SolutionsPage />
      </section>
      <section
        id="aboutus"
        className="scroll-mt-24 w-full flex flex-col items-center justify-center"
      >
        <AboutUsPage />
      </section>
      <section
        id="clients"
        className="scroll-mt-24 w-full flex flex-col items-center justify-center"
      >
        <ClientsPage />
      </section>
      <section
        id="whyus"
        className="scroll-mt-24 w-full flex flex-col items-center justify-center"
      >
        <WhyUsPage />
      </section>
      <section
        id="contactus"
        className="scroll-mt-16 w-full flex flex-col items-center justify-center"
      >
        <ContactUsPage />
      </section>
      <Footer />
    </div>
  );
};
