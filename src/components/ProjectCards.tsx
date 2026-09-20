import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

import chaiCover from "../assets/chai_site_cover.webp";
import chitraVaaniCover from "../assets/chitravaani_cover.webp";
import digiViscomCover from "../assets/digiviscom_site_cover.webp";
import deviceImage from "../assets/device.webp";
import nmicpsCover from "../assets/nmicps_site_cover.webp";
import rajenDentalCover from "../assets/rajan_dental_site_cover.webp";
import shaktiDbCover from "../assets/shaktidb_site_cover.webp";
import smartSutraCover from "../assets/smartsutra_cover.webp";
import swayamPlusCover from "../assets/swayamplus_cover.webp";
import swayamPlusLmsCover from "../assets/swayamplus_lms_cover.webp";
import sneakPeakImage1 from "../assets/SneakPeak_image1.webp";
import sneakPeakImage2 from "../assets/SneakPeak_image2.webp";
import sneakPeakImage3 from "../assets/SneakPeak_image3.webp";
import sneakPeakImage4 from "../assets/SneakPeak_image4.webp";

import logoChai from "../assets/logo_chai.webp";
import logoChitraVaani from "../assets/logo_chitravaani.webp";
import logoDigiViscom from "../assets/logo_digiviscom.webp";
import logoNmicps from "../assets/logo_nmicps.webp";
import logoRajanDental from "../assets/logo_rajan_dental.webp";
import logoShaktiDb from "../assets/logo_shaktidb.webp";
import logoSmartSutra from "../assets/logo_smartsutra.webp";
import logoSwayamPlus from "../assets/logo_swayamplus.webp";

import { SubpageHeader } from "./SubpageHeader";
import Tilt3D from "./Tilt3D";

const sneakPeakData = {
  title: "Our Journey Ahead...",
  tags: ["UI/UX", "R&D", "32Mins  "],
};

const media_urls = [
  {
    id: 1,
    title: "SWAYAM Plus",
    links: [
      { label: "Website", url: "https://swayamplus.education.gov.in/" },
      { label: "LMS", url: "https://swayam-plus-lms.iitmpravartak.org.in/" },
    ],
    cover_image: swayamPlusCover,
    split_covers: [swayamPlusCover, swayamPlusLmsCover],
    logo: logoSwayamPlus,
    tone: "light",
    tags: ["Platform Build", "UI/UX", "LMS"],
  },
  {
    id: 2,
    title: "ChitraVaani",
    links: [{ label: "Website", url: "https://chitravaani.in/" }],
    cover_image: chitraVaaniCover,
    logo: logoChitraVaani,
    tone: "light",
    tags: ["Platform Build", "AI", "Video Production"],
  },
  {
    id: 3,
    title: "Smart Sutra",
    links: [{ label: "Website", url: "https://www.smartsutra.32mins.in/" }],
    cover_image: smartSutraCover,
    logo: logoSmartSutra,
    tone: "dark",
    tags: ["Platform Build", "AI", "UI/UX"],
  },
  {
    id: 4,
    title: "NMICPS",
    links: [{ label: "Website", url: "https://nmicps.gov.in/" }],
    cover_image: nmicpsCover,
    logo: logoNmicps,
    tone: "dark",
    tags: ["UI/UX", "Dashboard"],
  },
  {
    id: 5,
    title: "Rajan Dental",
    links: [{ label: "Website", url: "https://courses.rajandental.com/" }],
    cover_image: rajenDentalCover,
    logo: logoRajanDental,
    tone: "dark",
    tags: ["UI/UX", "LMS"],
  },
  {
    id: 6,
    title: "CHAI",
    links: [{ label: "Website", url: "https://chai-iitmp.org/" }],
    cover_image: chaiCover,
    logo: logoChai,
    tone: "dark",
    tags: ["Branding", "UI/UX"],
  },
  {
    id: 7,
    title: "ShaktiDB",
    links: [{ label: "Website", url: "https://sdbpro.iitmpravartak.net/" }],
    cover_image: shaktiDbCover,
    logo: logoShaktiDb,
    tone: "dark",
    tags: ["Branding", "Newsletter", "LMS"],
  },
  {
    id: 8,
    title: "DigiViscom",
    links: [{ label: "Website", url: "https://digiviscom.in/" }],
    cover_image: digiViscomCover,
    logo: logoDigiViscom,
    tone: "dark",
    tags: ["Branding", "UI/UX", "LMS"],
  },
] as const;

type ProjectLink = { readonly label: string; readonly url: string };
type Tone = "light" | "dark";

const EASE = "transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]";
/** Site capture: blurred and tinted at rest so the logo reads; clear on hover. */
const SITE_IMG = `absolute inset-0 h-full w-full object-cover blur-[5px] group-hover:blur-none ${EASE}`;
const tintClass = (tone: Tone) =>
  `pointer-events-none absolute inset-0 ${tone === "light" ? "bg-white/40" : "bg-[#000016]/45"} group-hover:opacity-0 ${EASE}`;
/** Logo box: wordmarks may span 64% of the width, but nothing may exceed 58% of the height, so tall badges stay modest. */
const LOGO_BOX = `pointer-events-none absolute inset-0 flex items-center justify-center px-[18%] py-[21%] group-hover:opacity-0 group-hover:scale-95 ${EASE}`;
const LOGO_IMG = "max-h-full max-w-full object-contain";

/** One site behind one logo; hovering hides the logo and sharpens the site. */
const Cover = ({
  title,
  cover,
  logo,
  tone,
}: {
  title: string;
  cover: string;
  logo: string;
  tone: Tone;
}) => (
  <div className="relative w-full overflow-hidden rounded-sm">
    <img src={cover} alt="" aria-hidden="true" className="w-full h-auto invisible" />
    <img src={cover} alt="" aria-hidden="true" loading="lazy" decoding="async" className={SITE_IMG} />
    <div aria-hidden="true" className={tintClass(tone)} />
    <div className={LOGO_BOX}><img src={logo} alt={title} loading="lazy" decoding="async" className={LOGO_IMG} /></div>
  </div>
);

/**
 * Two sites behind one logo. The left half opens `links[0]`, the right half
 * `links[1]`; each site is clipped to its zone, so hovering a half widens it
 * and reveals more of that site while the logo fades out.
 */
const SplitCover = ({
  title,
  covers,
  logo,
  tone,
  links,
}: {
  title: string;
  covers: readonly [string, string];
  logo: string;
  tone: Tone;
  links: readonly [ProjectLink, ProjectLink];
}) => {
  const [active, setActive] = useState<0 | 1 | null>(null);
  const leftPct = active === 0 ? 84 : active === 1 ? 16 : 50;

  return (
    <div
      className="group relative w-full overflow-hidden rounded-sm"
      onMouseLeave={() => setActive(null)}
    >
      <img src={covers[0]} alt="" aria-hidden="true" className="w-full h-auto invisible" />
      <img src={covers[0]} alt="" aria-hidden="true" loading="lazy" decoding="async" style={{ clipPath: `inset(0 ${100 - leftPct}% 0 0)` }} className={SITE_IMG} />
      <img src={covers[1]} alt="" aria-hidden="true" loading="lazy" decoding="async" style={{ clipPath: `inset(0 0 0 ${leftPct}%)` }} className={SITE_IMG} />
      <div aria-hidden="true" className={tintClass(tone)} />
      <div className={LOGO_BOX}><img src={logo} alt={title} loading="lazy" decoding="async" className={LOGO_IMG} /></div>
      {links.map((link, i) => {
        const isLeft = i === 0;
        const width = isLeft ? leftPct : 100 - leftPct;
        const dimmed = active !== null && active !== i;
        const collapsed = width < 30;
        return (
          <a
            key={link.label}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open the ${title} ${link.label.toLowerCase()} in a new tab`}
            onMouseEnter={() => setActive(i as 0 | 1)}
            onFocus={() => setActive(i as 0 | 1)}
            onBlur={() => setActive(null)}
            style={{ width: `${width}%`, left: isLeft ? 0 : `${leftPct}%` }}
            className={`absolute top-0 bottom-0 flex items-end p-2 sm:p-3 ${EASE} ${
              dimmed ? "bg-[#000016]/45" : "bg-[#000016]/0"
            } ${isLeft ? "justify-start" : "justify-end"} focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white/80`}
          >
            <span
              className={`rounded-md border border-white/15 bg-[#06041A]/75 px-2 py-1 text-[10px] sm:text-xs font-medium text-white whitespace-nowrap backdrop-blur-sm ${EASE} ${
                collapsed ? "opacity-0" : "opacity-100"
              }`}
            >
              {link.label} ↗
            </span>
          </a>
        );
      })}
      <span
        aria-hidden="true"
        style={{ left: `${leftPct}%` }}
        className={`pointer-events-none absolute top-0 bottom-0 w-px -translate-x-1/2 bg-white/60 ${EASE}`}
      />
    </div>
  );
};

const ProjectCards = () => {

  // "Take a sneak peek" reveal is driven by scroll progress through the
  // panel (staggered per device), not hover — it works on touch too.
  const sneakRef = useRef<HTMLElement>(null);
  // Progress starts once the panel's top reaches the lower-middle of the
  // viewport (not the instant it peeks in at the bottom).
  const { scrollYProgress: sneakProgress } = useScroll({
    target: sneakRef,
    offset: ["start 0.75", "center 0.45"],
  });
  // Bottom-anchored: at full progress every device rests exactly on the
  // panel's bottom edge (translateY 0), whatever the viewport size.
  const sneakRise1 = useTransform(sneakProgress, [0, 0.85], ["85%", "0%"]);
  const sneakRise2 = useTransform(sneakProgress, [0.05, 0.9], ["85%", "0%"]);
  const sneakRise3 = useTransform(sneakProgress, [0.1, 0.95], ["85%", "0%"]);
  const sneakRise4 = useTransform(sneakProgress, [0.15, 1], ["85%", "0%"]);
  const deviceRise = useTransform(sneakProgress, [0.1, 1], ["80%", "0%"]);

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 sm:gap-4 md:gap-5 lg:gap-6">
        {media_urls.map((media, index) => {
          const primary = media.links[0];
          // Three columns at lg (two tracks each). When the last row holds
          // fewer than three cards, shift its first card so the row is centred.
          const remainder = media_urls.length % 3;
          const firstOfLastRow = index === media_urls.length - remainder;
          const start =
            firstOfLastRow && remainder === 2
              ? "lg:col-start-2"
              : firstOfLastRow && remainder === 1
                ? "lg:col-start-3"
                : "";
          const split =
            media.links.length === 2 && "split_covers" in media ? media : null;
          const linkClass =
            "group block w-full min-w-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/70 rounded-sm";
          const titleClass =
            "text-white text-xs sm:text-sm md:text-lg lg:text-xl font-semibold leading-tight w-fit break-words min-w-0 underline-offset-4 decoration-white/60 group-hover:underline";
          return (
            <div key={media.id} className={`min-w-0 h-full lg:col-span-2 ${start}`}>
              <Tilt3D
                className="h-full"
                innerClassName="rounded-sm flex flex-col justify-start h-full gap-2 sm:gap-2.5 md:gap-3 min-w-0"
                maxTilt={6}
              >
                {split ? (
                  <>
                    <SplitCover
                      title={media.title}
                      covers={split.split_covers}
                      logo={split.logo}
                      tone={split.tone}
                      links={[split.links[0], split.links[1]]}
                    />
                    <a
                      href={primary.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open the ${media.title} ${primary.label.toLowerCase()} in a new tab`}
                      className={linkClass}
                    >
                      <h3 className={titleClass}>{media.title}</h3>
                    </a>
                  </>
                ) : (
                  <a
                    href={primary.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open the ${media.title} ${primary.label.toLowerCase()} in a new tab`}
                    className={linkClass}
                  >
                    <Cover
                      title={media.title}
                      cover={media.cover_image}
                      logo={media.logo}
                      tone={media.tone}
                    />
                    <h3 className={`mt-2 sm:mt-2.5 md:mt-3 ${titleClass}`}>
                      {media.title}
                    </h3>
                  </a>
                )}
                <div className="flex flex-wrap gap-1 sm:gap-1.5 md:gap-2 min-w-0">
                  {media.tags.map((tag) => (
                    <SubpageHeader key={tag} title={tag} variant="small" />
                  ))}
                </div>
              </Tilt3D>
            </div>
          );
        })}
        <div className="flex flex-col items-center justify-center gap-2 sm:gap-3 md:gap-4 w-full rounded-sm col-span-full min-w-0 mt-4 sm:mt-6 md:mt-8">
          <section
            ref={sneakRef}
            className="relative bg-[#000030] border border-[#2943FC]/25 shadow-[0_0_80px_-16px_rgba(41,67,252,0.45)] rounded-lg overflow-hidden w-full min-h-[100px] sm:min-h-[150px] md:min-h-[200px] lg:min-h-[250px] flex items-start justify-center"
          >
            {/* Blue glow deepens as the devices rise */}
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0B1A5A]/0 via-[#0B1A5A]/40 to-[#0B1A5A]"
              style={{ opacity: sneakProgress }}
            />
            <h1 className="absolute -top-4 md:-top-8 lg:-top-12 font-bold text-[clamp(2rem,11vw,8.5rem)] tracking-[-0.05em] text-white text-center mix-blend-overlay z-0 whitespace-nowrap leading-none pt-3 sm:pt-4 md:pt-6 lg:pt-8 px-2 ">
              Take a sneak peek
            </h1>
            <div className="flex gap-2">
              <motion.img
                src={sneakPeakImage1}
                alt="Device"
                loading="lazy"
                decoding="async"
                style={{ y: sneakRise1 }}
                className="absolute bottom-0 left-0 z-0 max-w-3xs w-[25%] sm:w-[30%] md:w-[40%]"
              />
              <motion.img
                src={sneakPeakImage2}
                alt="Device"
                loading="lazy"
                decoding="async"
                style={{ y: sneakRise2 }}
                className="absolute bottom-0 left-1/4 z-0 max-w-3xs w-[25%] sm:w-[30%] md:w-[40%]"
              />
              <motion.img
                src={sneakPeakImage3}
                alt="Device"
                loading="lazy"
                decoding="async"
                style={{ y: sneakRise3 }}
                className="absolute bottom-0 left-1/2 z-0 max-w-3xs w-[25%] sm:w-[30%] md:w-[40%]"
              />
              <motion.img
                src={sneakPeakImage4}
                alt="Device"
                loading="lazy"
                decoding="async"
                style={{ y: sneakRise4 }}
                className="absolute bottom-0 left-3/4 z-0 max-w-3xs w-[25%] sm:w-[30%] md:w-[40%]"
              />
            </div>
            <motion.img
              src={deviceImage}
              alt="Device"
              loading="lazy"
              decoding="async"
              style={{ y: deviceRise }}
              className="absolute bottom-0 left-1/2 -translate-x-1/2 z-0 w-[55%] sm:w-[45%] md:w-[40%] max-w-md"
            />
          </section>
          <div className="flex flex-wrap w-full justify-between items-center gap-1.5 sm:gap-2 min-w-0">
            <h3 className="text-white text-xs sm:text-sm md:text-lg lg:text-xl font-semibold leading-tight w-fit break-words min-w-0">
              {sneakPeakData.title}
            </h3>
            <div className="flex flex-wrap gap-1 sm:gap-1.5 md:gap-2 min-w-0 shrink">
              {sneakPeakData.tags.map((tag) => (
                <SubpageHeader key={tag} title={tag} variant="small" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCards;
