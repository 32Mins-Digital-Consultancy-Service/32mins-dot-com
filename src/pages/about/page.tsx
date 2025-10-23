import { Menu } from "../../components/Menu";
import { ContactUsPage } from "../../components/ContactUs";
import Footer from "../../components/Footer";
import AboutUsSection from "./subpage/AboutUsSection";
import EmployeesSection from "./subpage/EmployeesSection";

export const AboutPage = () => {
  return (
    <div className="w-full bg-[#000016] items-center justify-center gap-24 flex flex-col">
      <Menu />
      <main className="pt-36 flex flex-col items-center justify-center w-full gap-24">
        <AboutUsSection />
        <EmployeesSection />
        <ContactUsPage />
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
