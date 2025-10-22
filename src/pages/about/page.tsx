import { Menu } from "../../components/Menu";
import { ContactUsPage } from "../home/subpages/ContactUs";
import Footer from "../../components/Footer";

export const AboutPage = () => {
  return (
    <div className="w-full min-h-screen bg-[#000016] flex flex-col items-center justify-center">
      <Menu />
      <div className="flex flex-col items-center justify-center w-full">
        <ContactUsPage />
        <Footer />
      </div>
    </div>
  );
};

export default AboutPage;
