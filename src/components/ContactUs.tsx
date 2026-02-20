import { motion } from "framer-motion";
import Message from "../assets/Message.svg";
import RightArrow from "../assets/rightarrow.svg";
import { useState } from "react";
import MessageDone from "../assets/message_done.svg";
import Tick from "../assets/tick.svg";

const MAILCHIMP_FORM_ACTION =
  "https://32mins.us15.list-manage.com/subscribe/post?u=2a2275f0c37f02a648deb0bf8&id=ee44138d80&f_id=0023aae0f0";

export const ContactUsPage = () => {
  const [email, setEmail] = useState("");
  const [cooldown, setCooldown] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValid = emailRegex.test(email);

  const lastSubmit =
    typeof window !== "undefined" ? localStorage.getItem("lastSubmit") : null;
  const now = Date.now();
  const isOnCooldownFromStorage =
    lastSubmit && now - Number(lastSubmit) < 60000;
  const isDisabled = !isValid || cooldown || !!isOnCooldownFromStorage;
  const isSent = cooldown || !!isOnCooldownFromStorage;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (cooldown) return;

    const last = localStorage.getItem("lastSubmit");
    const nowTime = Date.now();
    if (last && nowTime - Number(last) < 60000) {
      alert("Please wait before trying again.");
      return;
    }

    localStorage.setItem("lastSubmit", nowTime.toString());
    setCooldown(true);
    setTimeout(() => setCooldown(false), 10000);

    (e.target as HTMLFormElement).submit();
  };

  return (
    <section className="relative bg-linear-to-b from-[#0A1953] to-[#2842F7] w-[90%] max-w-full h-[360px] rounded-2xl p-7.5 flex flex-col gap-6 items-center justify-center overflow-hidden">
      <h1 className="font-bold text-[clamp(96px,30vw,480px)] tracking-[-0.04em] text-white/16 text-center absolute mix-blend-soft-light z-0  left-1/2 -translate-x-1/2 whitespace-nowrap">
        Reach Us
      </h1>
      <header className="flex flex-col gap-4 items-center justify-center max-w-3xl z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{
            opacity: 1,
            y: 0,
            transition: { delay: 0.2, duration: 0.5 },
          }}
          viewport={{ once: true, amount: 0.5 }}
          className="font-bold text-[clamp(1.5rem,4vw,3rem)] tracking-tighter text-white"
        >
          Reach Us
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{
            opacity: 1,
            y: 0,
            transition: { delay: 0.2, duration: 0.5 },
          }}
          viewport={{ once: true, amount: 0.5 }}
          className="flex flex-col "
        >
          <p className="font-normal text-[clamp(1rem,2vw,1.25rem)] tracking-tighter text-white text-center">
            Do you want to create interactive video content for your students or
            employees?
          </p>
          <p className="font-normal text-[clamp(1rem,2vw,1.25rem)] tracking-tighter text-white text-center">
            Please share your email, and we will connect with you in 2-3 working
            days.
          </p>
        </motion.div>
      </header>
      <iframe
        name="mailchimp-hidden-frame"
        title="Mailchimp"
        className="hidden"
        style={{ display: "none" }}
      />
      <form
        action={MAILCHIMP_FORM_ACTION}
        method="post"
        target="mailchimp-hidden-frame"
        onSubmit={handleSubmit}
        className="relative w-[clamp(300px,30vw,400px)] h-[48px] z-10"
      >
        {/* Honeypot field - hidden from users, prevents spam */}
        <div
          aria-hidden="true"
          style={{ position: "absolute", left: "-5000px" }}
        >
          <input
            type="text"
            name="b_2a2275f0c37f02a648deb0bf8_ee44138d80"
            tabIndex={-1}
            defaultValue=""
            readOnly
          />
        </div>
        <label htmlFor="contact-email" className="sr-only">
          Email address
        </label>
        <input
          id="contact-email"
          type="email"
          name="EMAIL"
          value={email}
          onChange={handleChange}
          placeholder="Enter your email id here"
          required
          className="w-full h-full rounded-3xl py-4 pl-14 pr-11 text-white text-[clamp(0.875rem,1.5vw,1.125rem)] tracking-tighter font-normal  bg-[#202020]"
        />
        {isSent ? (
          <motion.div
            initial={{ left: 24 }}
            animate={{ left: "calc(100% - 4.25rem)" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute top-1/2 -translate-y-1/2 pointer-events-none w-6 h-6 flex items-center justify-center"
          >
            <MessageDone className="w-6 h-6 object-contain shrink-0" />
          </motion.div>
        ) : (
          <div className="absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none">
            <Message />
          </div>
        )}
        {isSent ? (
          <button
            type="submit"
            disabled={isDisabled}
            className={`absolute right-1 px-2.5 py-3 top-1/2 -translate-y-1/2 h-8 w-8 text-white transition-all duration-300 ease-in-out bg-gradient-to-b from-[#0A1953] to-[#2842F7] rounded-full ${
              isDisabled
                ? "opacity-40 cursor-not-allowed"
                : "opacity-100 cursor-pointer hover:opacity-90"
            }`}
          >
            <Tick />
          </button>
        ) : (
          <button
            type="submit"
            disabled={isDisabled}
            className={`absolute right-1 px-3 py-2.5 top-1/2 -translate-y-1/2 h-8 w-8 text-white transition-all duration-300 ease-in-out bg-gradient-to-b from-[#0A1953] to-[#2842F7] rounded-full ${
              isDisabled
                ? "opacity-40 cursor-not-allowed"
                : "opacity-100 cursor-pointer hover:opacity-90"
            }`}
          >
            <RightArrow />
          </button>
        )}
      </form>
    </section>
  );
};

export default ContactUsPage;
