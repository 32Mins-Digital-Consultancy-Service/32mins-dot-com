// HomePage.tsx
import { Menu } from "../../components/Menu";
import { UpdatesPage } from "./subpages/Updates";
import { SolutionsPage } from "./subpages/Solutions";
import { AboutUsPage } from "./subpages/AboutUs";
import { ClientsPage } from "./subpages/Client";
import { WhyUsPage } from "./subpages/WhyUs";
import { ContactUsPage } from "./subpages/ContactUs";

export const HomePage = () => {
  return (
    <div className="bg-linear-to-b from-[#000016] via-[#000016] to-[#000016]/0">
      <div className="bg-[url('/bg-image.png')] bg-top bg-no-repeat  flex flex-col items-center justify-center w-full">
        <Menu />
        <section
          id="updates"
          className="scroll-mt-20 w-full flex flex-col items-center justify-center"
        >
          <UpdatesPage />
        </section>
        <section
          id="solutions"
          className="scroll-mt-20 w-full flex flex-col items-center justify-center"
        >
          <SolutionsPage />
        </section>
        <section
          id="aboutus"
          className="scroll-mt-20 w-full flex flex-col items-center justify-center"
        >
          <AboutUsPage />
        </section>
        <section
          id="clients"
          className="scroll-mt-20 w-full flex flex-col items-center justify-center"
        >
          <ClientsPage />
        </section>
        <section
          id="whyus"
          className="scroll-mt-20 w-full flex flex-col items-center justify-center"
        >
          <WhyUsPage />
        </section>
        <section
          id="contactus"
          className="scroll-mt-20 w-full flex flex-col items-center justify-center  "
        >
          <ContactUsPage />
        </section>
      </div>
    </div>
  );
};
