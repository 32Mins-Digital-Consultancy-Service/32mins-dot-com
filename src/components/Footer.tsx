import CtaButton from "./CtaButton";
import Schdule from "../assets/schdule.svg";
import Phone from "../assets/phone.svg";
import Message from "../assets/message.svg";
import Linkedin from "../assets/linkedin.png";
import Twitter from "../assets/twitter.png";
import Facebook from "../assets/facebook.png";
import Insta from "../assets/insta.png";

const Footer = () => {
  const socialLinks = [
    { name: "Instagram", icon: Insta, href: "#" },
    { name: "LinkedIn", icon: Linkedin, href: "#" },
    { name: "Twitter", icon: Twitter, href: "#" },
    { name: "Facebook", icon: Facebook, href: "#" },
  ];

  return (
    <footer className="bg-[#0A0A0A] w-full py-9 flex flex-col items-center justify-center gap-13">
      <div className="flex items-center justify-center gap-30 max-w-6xl overflow-visible">
        <address className="flex flex-col  gap-6 max-w-sm">
          <div className="text-base font-bold  text-white">
            32Mins Digital Consultancy Services Pvt. Ltd.
          </div>
          <div className="text-base font-normal  text-[#8E8E8E]">
            B5-01, B Block, 5th Floor, IIT Madras Research Park, Kanagam Road,
            Taramani, Chennai 600 113
          </div>

          <div className="flex items-center justify-between gap-4  border-t border-[#595959] pt-6 mr-4">
            <CtaButton variant="primary" onClick={() => {}}>
              <Phone />
              Call us
            </CtaButton>
            <CtaButton variant="primary" onClick={() => {}}>
              <Message />
              Write to us
            </CtaButton>
          </div>

          <div className="flex  items-center  gap-2.5">
            <div className="text-2xl font-normal tracking-tigher text-[#8E8E8E]">
              Socials »
            </div>
            <nav className="flex gap-2.5">
              {socialLinks.map(({ name, icon, href }) => (
                <a
                  key={name}
                  href={href}
                  className="w-7.5 h-7.5 border border-[#8E8E8E] rounded-sm cursor-pointer transition-colors hover:border-white"
                  aria-label={`Visit our ${name} page`}
                >
                  <img
                    src={icon}
                    alt={`${name} social media icon`}
                    className="w-full h-full"
                  />
                </a>
              ))}
            </nav>
          </div>
        </address>

        <div className="flex justify-center items-center overflow-visible">
          <img
            src="iitmp-image.png"
            alt="iitmp-image"
            className="w-48 h-auto"
          />
        </div>

        <section className="flex flex-col  gap-6 border border-[#595959] p-8 rounded-2xl max-w-lg">
          <h3 className="text-3xl font-bold tracking-tigher text-[#2147DE]">
            Request a Proposal
          </h3>
          <div>
            <p className="text-base font-normal tracking-tigher text-white">
              We would be delighted to serve you.
            </p>
            <p className="text-base font-normal tracking-tigher text-white">
              Looking forward to your call!
            </p>
          </div>
          <CtaButton variant="secondary" onClick={() => {}}>
            <Schdule />
            Schedule a meet
          </CtaButton>
        </section>
      </div>

      <nav className="flex items-center justify-center gap-4 text-[#8E8E8E] font-normal text-xs">
        <div className="flex items-center justify-center gap-4">
          <a href="#">Cookies</a>
          <a href="#">Privacy</a>
          <a href="#">Terms of Service</a>
        </div>
        <div>|</div>
        <div>©2025 32Mins Consultancy Services Pvt. Ltd.</div>
      </nav>
    </footer>
  );
};

export default Footer;
