import CtaButton from "../../../components/CtaButton";
import TriangleWithLine from "../../../assets/TriangleWithLine.svg";
import { SubpageHeader } from "../../../components/SubpageHeader";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Rightarro from "../../../assets/Rightarro.svg";
import SpotlightCard from "../../../components/SpotlightCard";

const FACTS = [
  {
    label: "Headquarters",
    value: "IIT Madras Research Park",
    detail: "Chennai, India",
  },
  {
    label: "Leadership",
    value: "Sribalaji Ravi, CEO & Founder",
    detail: "Full-stack developers, Moodle engineers, designers, data analysts",
  },
  {
    label: "Philosophy",
    value: "AI precision, human judgment",
    detail: "Personalised, learner-centric environments",
  },
];

const PLATFORMS = ["SWAYAM Plus", "NM-ICPS", "IITM Pravartak ecosystem"];

const AboutUsSection = () => {
  const navigate = useNavigate();
  return (
    <article className="text-white flex items-center justify-center gap-4 flex-col px-4 sm:px-8 md:px-12 lg:px-20 xl:px-27 max-w-3xl w-full">
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="w-full flex justify-center"
      >
        <h1
          className="tracking-tighter leading-none text-center relative font-extrabold"
          style={{ fontSize: "clamp(1.5rem, 7vw, 6rem)" }}
        >
          {/* Base white text - always visible underneath */}
          <span className="text-white">Empower Learning</span>
          {/* Gradient overlay - fades out on first load to reveal white text */}
          <motion.span
            className="absolute inset-0 bg-gradient-to-r from-[#000000] via-[#FFFFFF] to-[#000000] bg-clip-text text-transparent"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 2, delay: 0, ease: "easeIn" }}
            aria-hidden="true"
          >
            Empower Learning
          </motion.span>
        </h1>
      </motion.div>
      <section className="flex items-center justify-center gap-4 flex-col">
        <motion.p
          initial={{ opacity: 0, y: 28 }}
          whileInView={{
            opacity: 1,
            y: 0,
            transition: {
              delay: 0.1,
              duration: 0.65,
              ease: [0.22, 1, 0.36, 1],
            },
          }}
          viewport={{ once: true, amount: 0.25 }}
          className="text-[clamp(0.875rem,2vw,1.125rem)] font-normal tracking-tight text-[#8E8E8E] max-w-lg text-center px-2"
        >
          An IITM Pravartak-incubated EdTech consultancy. We architect
          AI-driven eLearning platforms, adaptive digital applications and
          intelligent digital media to scale education globally.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{
            opacity: 1,
            y: 0,
            transition: {
              delay: 0.25,
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
            },
          }}
          viewport={{ once: true, amount: 0.25 }}
        >
          <TriangleWithLine className="rotate-180" />
        </motion.div>
      </section>
      <motion.figure
        initial={{ opacity: 0, y: 28 }}
        whileInView={{
          opacity: 1,
          y: 0,
          transition: { delay: 0.1, duration: 0.65, ease: [0.22, 1, 0.36, 1] },
        }}
        viewport={{ once: true, amount: 0.25 }}
        className="w-full flex items-center justify-center"
      >
        <img
          src="/ape.webp"
          alt="ape"
          loading="lazy"
          decoding="async"
          className="w-full max-w-[556px] h-auto object-contain rounded-lg"
        />
      </motion.figure>
      <section className="flex items-center justify-center gap-4 flex-col">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{
            opacity: 1,
            y: 0,
            transition: { delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
          }}
          viewport={{ once: true, amount: 0.25 }}
        >
          <TriangleWithLine />
        </motion.div>
        <div className="grid w-auto self-stretch grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4 -mx-2 sm:-mx-6 md:-mx-10 lg:-mx-16 xl:-mx-24">
          {FACTS.map((fact, i) => (
            <motion.div
              key={fact.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{
                opacity: 1,
                y: 0,
                transition: {
                  delay: 0.15 + i * 0.1,
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1],
                },
              }}
              viewport={{ once: true, amount: 0.25 }}
              className="h-full"
            >
              <SpotlightCard className="flex h-full flex-col gap-1.5 rounded-[15px] border border-white/10 bg-[#06041A] p-4 sm:p-5 text-left">
                <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#8E8E8E]">
                  {fact.label}
                </span>
                <span className="text-sm font-semibold leading-snug text-white sm:text-base">
                  {fact.value}
                </span>
                <span className="text-xs leading-snug text-[#8E8E8E] sm:text-sm">
                  {fact.detail}
                </span>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      </section>
      <section className="flex items-center justify-center gap-6 sm:gap-9 flex-col">
        <motion.header
          initial={{ opacity: 0, y: 24 }}
          whileInView={{
            opacity: 1,
            y: 0,
            transition: { delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
          }}
          viewport={{ once: true, amount: 0.25 }}
          className="flex items-center justify-center gap-3 flex-col px-4 sm:px-8 md:px-15 pt-4 sm:pt-6"
        >
          <SubpageHeader title="Our Mission" />
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{
              opacity: 1,
              y: 0,
              transition: {
                delay: 0.2,
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
              },
            }}
            viewport={{ once: true, amount: 0.25 }}
            className="text-white text-[clamp(1.25rem,4vw,1.875rem)] font-bold tracking-tighter text-center"
          >
            Building the future of India with every line of code
          </motion.h2>
        </motion.header>
        <motion.p
          initial={{ opacity: 0, y: 28 }}
          whileInView={{
            opacity: 1,
            y: 0,
            transition: {
              delay: 0.3,
              duration: 0.65,
              ease: [0.22, 1, 0.36, 1],
            },
          }}
          viewport={{ once: true, amount: 0.25 }}
          className="text-[clamp(0.875rem,2vw,1.125rem)] font-normal tracking-tight text-[#8E8E8E] max-w-lg text-center px-2"
        >
          Engaging eLearning in science, medicine, engineering, culture and
          livelihood that improves outcomes and builds real skills.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{
            opacity: 1,
            y: 0,
            transition: {
              delay: 0.35,
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
            },
          }}
          viewport={{ once: true, amount: 0.25 }}
          className="flex flex-col items-center gap-3"
        >
          <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#8E8E8E]">
            Technology engine behind
          </span>
          <ul className="flex flex-wrap justify-center gap-2">
            {PLATFORMS.map((name) => (
              <li
                key={name}
                className="rounded-lg border border-[#1B1B1B] bg-white/5 px-3 py-1.5 text-xs text-white sm:text-sm"
              >
                {name}
              </li>
            ))}
          </ul>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{
            opacity: 1,
            y: 0,
            transition: {
              delay: 0.45,
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
            },
          }}
          viewport={{ once: true, amount: 0.25 }}
        >
          <CtaButton
            variant="primary"
            onClick={() => {
              navigate("/#contactus");
            }}
          >
            Get in touch
            <Rightarro className="w-4 -ml-1 -mr-2 pt-0.5" />
          </CtaButton>
        </motion.div>
      </section>
    </article>
  );
};
export default AboutUsSection;
