// HomePage.tsx
import { Menu } from "../../components/Menu";
import { UpdatesPage } from "./subpages/Updates";
import { SolutionsPage } from "./subpages/Solutions";
import { AboutUsPage } from "./subpages/AboutUs";
import { ClientsPage } from "./subpages/Client";
import { WhyUsPage } from "./subpages/WhyUs";
import { ContactUsPage } from "./subpages/ContactUs";
import { Summary } from "../../components/Summary";

export const HomePage = () => {
  return (
    <div className="bg-linear-to-b from-[#000016] to-[#000C30]">
      <Menu />
      <div className="flex flex-col items-center justify-center w-full bg-linear-to-b from-black via-black to-[#000000]/0">
        <div className="flex flex-col items-center justify-center  bg-[url('/bg-image.png')] bg-top bg-no-repeat w-full #000C30 ">
          <section
            id="updates"
            className="scroll-mt-20 w-full flex flex-col items-center justify-center"
          >
            <UpdatesPage />
          </section>
          <div className="bg-[url('/earth.jpg')]  bg-cover min-h-screen w-full justify-end flex items-end ">
            <Summary />
          </div>
        </div>
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
      </div>
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
  );
};
