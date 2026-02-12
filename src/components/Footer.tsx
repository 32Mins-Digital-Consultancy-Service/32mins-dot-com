import { Link } from "react-router-dom";
import CtaButton from "./CtaButton";
import Schdule from "../assets/schdule.svg";
import Phone from "../assets/Phone.svg";
import Message from "../assets/Message.svg";
import Linkedin from "../assets/linkedin.webp";
import Twitter from "../assets/twitter.webp";
import Facebook from "../assets/facebook.webp";
import Insta from "../assets/insta.webp";

const Footer = () => {
  const socialLinks = [
    {
      name: "Instagram",
      icon: Insta,
      href: "https://www.instagram.com/_32mins_/",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      href: "https://www.linkedin.com/company/32mins/",
    },
    { name: "Twitter", icon: Twitter, href: "https://x.com/32Mins_dcs" },
    {
      name: "Facebook",
      icon: Facebook,
      href: "https://www.facebook.com/32mins/",
    },
  ];

  return (
    <footer
      className="bg-[#0A0A0A] w-full flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16"
      style={{
        paddingTop: "clamp(1.5rem, 5vw, 3rem)",
        paddingBottom: "clamp(1.5rem, 5vw, 3rem)",
        gap: "clamp(2rem, 5vw, 4rem)",
      }}
    >
      <div
        className="flex flex-col md:flex-row lg:flex-row xl:flex-row items-center  justify-between max-w-7xl overflow-visible w-full"
        style={{ gap: "clamp(2rem, 4vw, 4rem)" }}
      >
        {/* Address Section */}
        <address
          className="flex flex-col max-w-sm w-full md:w-auto md:flex-1 lg:max-w-xs xl:max-w-sm items-center lg:items-start"
          style={{ gap: "clamp(1rem, 3vw, 1.5rem)" }}
        >
          <div
            className="font-bold text-white text-center md:text-left w-full"
            style={{ fontSize: "clamp(0.875rem, 2vw, 1rem)" }}
          >
            32Mins Digital Consultancy Services Pvt. Ltd.
            <br />
            <br />
            <span className="font-normal text-[#8E8E8E]">
              B5-01, B Block, 5th Floor, IIT Madras Research Park, Kanagam Road,
              Taramani, Chennai 600 113
            </span>
          </div>

          {/* Action Buttons */}
          <div
            className="flex  items-center justify-center border-t border-[#595959] w-full"
            style={{
              gap: "clamp(0.75rem, 2vw, 1rem)",
              paddingTop: "clamp(1rem, 3vw, 1.5rem)",
            }}
          >
            <CtaButton
              variant="primary"
              onClick={() => {
                window.open("tel:+91 9803437719", "_blank");
              }}
            >
              <Phone />
              Call us
            </CtaButton>
            <CtaButton
              variant="primary"
              onClick={() => {
                window.open("mailto:info@32mins.com", "_blank");
              }}
            >
              <Message />
              Write to us
            </CtaButton>
          </div>

          {/* Social Links */}
          <div
            className="flex flex-row items-center justify-center md:justify-start w-full"
            style={{ gap: "clamp(0.75rem, 2vw, 1rem)" }}
          >
            <div
              className="font-normal tracking-tigher text-[#8E8E8E] whitespace-nowrap"
              style={{ fontSize: "clamp(1rem, 2.5vw, 1.5rem)" }}
            >
              Socials »
            </div>
            <nav
              className="flex flex-wrap items-center justify-center"
              style={{ gap: "clamp(0.5rem, 1.5vw, 0.75rem)" }}
            >
              {socialLinks.map(({ name, icon, href }) => (
                <Link
                  key={name}
                  to={href}
                  target="_blank"
                  className="border border-[#8E8E8E] rounded-sm cursor-pointer transition-all hover:border-white hover:scale-110"
                  style={{
                    width: "clamp(1.75rem, 4vw, 2.25rem)",
                    height: "clamp(1.75rem, 4vw, 2.25rem)",
                  }}
                  aria-label={`Visit our ${name} page`}
                >
                  <img
                    src={icon}
                    alt={`${name} social media icon`}
                    className="w-full h-full object-contain"
                  />
                </Link>
              ))}
            </nav>
          </div>
        </address>

        {/* IIT Madras Image */}
        <div className="flex justify-center items-center overflow-visible ">
          <img
            src="../src/images/iitmp-image.webp"
            alt="IIT Madras Research Park"
            className="h-auto object-contain"
            style={{ width: "clamp(7rem, 15vw, 12rem)" }}
          />
        </div>

        {/* Request Proposal Section */}
        <section
          className="flex flex-col border border-[#595959] rounded-2xl w-full md:w-auto md:flex-1 lg:max-w-sm xl:max-w-md items-center md:items-start"
          style={{
            gap: "clamp(1rem, 3vw, 1.5rem)",
            padding: "clamp(1.25rem, 4vw, 2rem)",
          }}
        >
          <h3
            className="font-bold tracking-tigher text-[#2147DE] w-full text-center md:text-left"
            style={{ fontSize: "clamp(1.25rem, 3.5vw, 1.875rem)" }}
          >
            Request a Proposal
          </h3>
          <div className="text-center md:text-left">
            <p
              className="font-normal tracking-tigher text-white"
              style={{ fontSize: "clamp(0.875rem, 2vw, 1rem)" }}
            >
              We would be delighted to serve you.
            </p>
            <p
              className="font-normal tracking-tigher text-white"
              style={{ fontSize: "clamp(0.875rem, 2vw, 1rem)" }}
            >
              Looking forward to your call!
            </p>
          </div>
          <div className="w-full flex justify-center md:justify-start">
            <CtaButton
              variant="secondary"
              onClick={() => {
                window.open(
                  "https://calendar.google.com/calendar/appointments/schedules/AcZssZ27ExVKUXdvOOpE4DA3Mjkx95zoM8NIFesfJra_l9njbkHvWCNXaJqUTHMUrkas9Yijusv_3rXT",
                  "_blank"
                );
              }}
            >
              <Schdule />
              Schedule a meet
            </CtaButton>
          </div>
        </section>
      </div>

      {/* Bottom Navigation */}
      <nav
        className="flex flex-col sm:flex-row items-center justify-center text-[#8E8E8E] font-normal text-center w-full px-4"
        style={{
          gap: "clamp(0.5rem, 2vw, 1rem)",
          fontSize: "clamp(0.625rem, 1.5vw, 0.875rem)",
        }}
      >
        <div
          className="flex items-center justify-center flex-wrap"
          style={{ gap: "clamp(0.5rem, 2vw, 1rem)" }}
        >
          <Link to="#" className="hover:text-white transition-colors">
            Cookies
          </Link>
          <span className="hidden xs:inline">·</span>
          <Link to="#" className="hover:text-white transition-colors">
            Privacy
          </Link>
          <span className="hidden xs:inline">·</span>
          <Link to="#" className="hover:text-white transition-colors">
            Terms of Service
          </Link>
        </div>
        <div className="hidden sm:block">|</div>
        <div className="whitespace-nowrap">
          ©2025 32Mins Consultancy Services Pvt. Ltd.
        </div>
      </nav>
    </footer>
  );
};

export default Footer;
