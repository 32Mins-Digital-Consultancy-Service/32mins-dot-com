import CtaButton from "./CtaButton";
import Schdule from "../assets/schdule.svg";
import Phone from "../assets/phone.svg";
import Message from "../assets/message.svg";
import Linkedin from "../assets/linkedin.png";
import Twitter from "../assets/twitter.png";
import Facebook from "../assets/facebook.png";
import Insta from "../assets/insta.png";

const Footer = () => {
  return (
    <footer className="bg-[#0A0A0A] w-full p-9 flex flex-col items-center justify-center gap-13">
      <div className="flex items-center justify-center gap-30">
        <address className="flex flex-col items-center justify-center gap-6 not-italic">
          <div className="text-base font-bold  text-white">
            32Mins Digital Consultancy Services Pvt. Ltd.
          </div>
          <div className="text-base font-normal  text-[#8E8E8E]">
            B5-01, B Block, 5th Floor, IIT Madras Research Park, Kanagam Road,
            Taramani, Chennai 600 113
          </div>

          <hr />

          <div className="flex items-center justify-center gap-4">
            <CtaButton variant="primary" onClick={() => {}}>
              <Phone />
              Call us
            </CtaButton>
            <CtaButton variant="primary" onClick={() => {}}>
              <Message />
              Write to us
            </CtaButton>
          </div>

          <div className="flex  items-center justify-center gap-2.5">
            <div className="text-2xl font-normal tracking-tigher text-[#8E8E8E]">
              Socials »
            </div>
            <nav className="flex gap-2.5">
              {["insta", "linkedin", "twitter", "facebook"].map((i) => {
                return (
                  <a
                    key={i}
                    href="#"
                    className="w-7.5 h-7.5 border border-[#8E8E8E] rounded-sm cursor-pointer transition-colors"
                  >
                    <img
                      src={
                        i === "insta"
                          ? Insta
                          : i === "linkedin"
                          ? Linkedin
                          : i === "twitter"
                          ? Twitter
                          : i === "facebook"
                          ? Facebook
                          : Insta
                      }
                      alt={`social-${i}`}
                      className="w-full h-full"
                    />
                  </a>
                );
              })}
            </nav>
          </div>
        </address>

        <div className="flex justify-center items-center ">
          <img
            src="iitmp-image.png"
            alt="iitmp-image"
            className="w-[184px] h-[94px]"
          />
        </div>

        <section className="flex flex-col items-center justify-center gap-6 border border-[#595959] p-8 rounded-2xl">
          <h3 className="text-3xl font-bold tracking-tigher text-[#2147DE]">
            Request a Proposal
          </h3>
          <p className="text-base font-normal tracking-tigher text-white">
            We would be delighted to serve you. Looking forward to your call!
          </p>
          <CtaButton variant="secondary" onClick={() => {}}>
            <Schdule />
            Schedule a meet
          </CtaButton>
        </section>
      </div>

      <nav className="flex items-center justify-center gap-4 text-[#8E8E8E] font-normal text-xs">
        <a href="#">Cookies</a>
        <a href="#">Privacy</a>
        <a href="#">Terms of Service</a>
        <span>|</span>
        <div>©2025 32Mins Consultancy Services Pvt. Ltd.</div>
      </nav>
    </footer>
  );
};

export default Footer;
