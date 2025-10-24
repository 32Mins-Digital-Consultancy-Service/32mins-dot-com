// HomePage.tsx
import { Menu } from "../../components/Menu";
import { UpdatesPage } from "./subpages/Updates";
import { SolutionsPage } from "./subpages/Solutions";
import { AboutUsPage } from "./subpages/AboutUs";
// import { ClientsPage } from "./subpages/Client";
// import { WhyUsPage } from "./subpages/WhyUs";
import { ContactUsPage } from "../../components/ContactUs";
import { Summary } from "../../components/Summary";
import Footer from "../../components/Footer";

export const HomePage = () => {
  return (
    <div className="bg-linear-to-t from-[#000016] to-[#000C30] flex flex-col items-center justify-center gap-16">
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
            className="mix-blend-lighten w-full rotate-90 absolute mt-40"
          />
          <div className="absolute bottom-0 bg-linear-to-t from-[#000000] to-[#000000]/0 w-full h-[200px] flex justify-center items-end"></div>
        </div>
        <Summary />
      </div>
      <SolutionsPage />
      <AboutUsPage />
      <ContactUsPage />
      <Footer />
    </div>
  );
};
