import { SectionHeader } from "../../../components/SectionHeader";
import Marquee from "../../../components/marquee";
import Tilt3D from "../../../components/Tilt3D";
import { motion } from "framer-motion";

// Testimonials data
const TESTIMONIALS = [
  {
    title: "A Testament to the Strength of Our Incubation Programs",
    quote:
      '"Witnessing the success of our incubated start-ups, like 32Mins, fills us with immense pride. Their rapid growth and innovation is a testament to the power of our vibrant innovation ecosystem—a dynamic space where academia and industry collide to spark transformative ideas."',
    author: "IITM Pravartak",
  },
  {
    title: "Truly Transformational",
    quote:
      '"The team recently edited my 41-hour 4-module video Course in Global English for workers of multi-national companies, etc. I found in the team a matchless degree of enthusiasm to create new ways to add value to products and to help in all possible ways."',
    author: "Shreesh Chaudhary Prof (Retd.), DHSS, IIT Madras",
  },
];

// Testimonial Card Component
const TestimonialCard = ({
  title,
  quote,
  author,
}: {
  title: string;
  quote: string;
  author: string;
}) => (
  <motion.article
    initial={{ opacity: 0, y: 20 }}
    whileInView={{
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    }}
    viewport={{ once: true, amount: 0.2 }}
    className="flex-1 w-full max-w-2xl flex"
  >
    <Tilt3D
      className="w-full flex"
      innerClassName="bg-[#06041A]/80
                 rounded-xl sm:rounded-2xl w-full flex flex-col border border-white/10
                 p-3 sm:p-4 md:p-7 lg:p-9 gap-2.5 sm:gap-4 md:gap-5 lg:gap-6"
      maxTilt={4}
      glare
    >
      <h3 className="font-bold tracking-tigher text-white text-xs sm:text-sm md:text-base lg:text-lg leading-snug">
        {title}
      </h3>
      <blockquote className="font-normal tracking-tigher text-[#8E8E8E] text-[11px] leading-snug sm:text-sm sm:leading-normal md:text-base md:leading-relaxed lg:text-lg">
        <p>{quote}</p>
        <footer className="mt-2 sm:mt-3">
          <cite className="font-normal tracking-tigher text-white text-[11px] sm:text-sm md:text-base lg:text-lg not-italic">
            {author}
          </cite>
        </footer>
      </blockquote>
    </Tilt3D>
  </motion.article>
);

// Main Component
export const ClientsPage = () => (
  <div
    className="flex flex-col items-center justify-center w-full mx-auto max-w-[1700px]
                  gap-[clamp(2.5rem,6vw,4rem)]
                  px-3 sm:px-4 md:px-12 lg:px-16"
  >
    <SectionHeader pill="Our Clients" title="Helping businesses grow" />

    {/* Marquee */}
    <Marquee />

    {/* Testimonials Section */}
    <div
      className="flex flex-col items-center justify-center w-full
                    gap-[clamp(1.25rem,3vw,1.75rem)]
                    px-0 sm:px-4 md:px-8 lg:px-10"
    >
      <motion.h3
        initial={{ opacity: 0, y: 20 }}
        whileInView={{
          opacity: 1,
          y: 0,
          transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
        }}
        viewport={{ once: true, amount: 0.2 }}
        className="font-normal tracking-tigher text-[#8E8E8E] text-center
                   text-xs sm:text-sm md:text-base lg:text-lg"
      >
        Here's what our <span className="text-white">satisfied clients</span>{" "}
        say
      </motion.h3>

      <div
        className="flex flex-row items-stretch justify-center w-full
                      gap-3 sm:gap-5 md:gap-7 lg:gap-8"
      >
        {TESTIMONIALS.map((testimonial) => (
          <TestimonialCard key={testimonial.author} {...testimonial} />
        ))}
      </div>
    </div>
  </div>
);

export default ClientsPage;
