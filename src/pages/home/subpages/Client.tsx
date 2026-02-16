import { SubpageHeader } from "../../../components/SubpageHeader";
import Marquee from "../../../components/marquee";
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
      transition: { delay: 0.2, duration: 0.5 },
    }}
    viewport={{ once: true, amount: 0.5 }}
    className="bg-linear-to-r from-[#0A0A0A]/20 via-[#707070]/20 to-[#0A0A0A]/20 
               rounded-2xl max-w-2xl flex flex-col border border-[#1B1B1B]
               p-4 md:p-7 lg:p-9 gap-4 md:gap-5 lg:gap-6"
  >
    <h3 className="font-bold tracking-tigher text-white text-sm md:text-base lg:text-lg">
      {title}
    </h3>
    <blockquote className="font-normal tracking-tigher text-[#8E8E8E] text-sm md:text-base lg:text-lg">
      <p>{quote}</p>
      <footer className="mt-3">
        <cite className="font-normal tracking-tigher text-white text-sm md:text-base lg:text-lg not-italic">
          {author}
        </cite>
      </footer>
    </blockquote>
  </motion.article>
);

// Main Component
export const ClientsPage = () => (
  <div
    className="flex flex-col items-center justify-center w-full 
                  gap-8 md:gap-10 lg:gap-12 
                  px-4 md:px-12 lg:px-16"
  >
    {/* Header Section */}
    <div className="flex flex-col items-center justify-center gap-2 md:gap-3">
      <SubpageHeader title="Our Clients" />
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{
          opacity: 1,
          y: 0,
          transition: { delay: 0.2, duration: 0.5 },
        }}
        viewport={{ once: true, amount: 0.5 }}
        className="font-bold tracking-tigher text-white text-xl md:text-2xl lg:text-3xl"
      >
        Helping businesses grow
      </motion.h2>
    </div>

    {/* Marquee */}
    <Marquee />

    {/* Testimonials Section */}
    <div
      className="flex flex-col items-center justify-center w-full 
                    gap-6 md:gap-5 lg:gap-6 
                    px-4 md:px-8 lg:px-10"
    >
      <motion.h3
        initial={{ opacity: 0, y: 20 }}
        whileInView={{
          opacity: 1,
          y: 0,
          transition: { delay: 0.2, duration: 0.5 },
        }}
        viewport={{ once: true, amount: 0.5 }}
        className="font-normal tracking-tigher text-[#8E8E8E] text-center 
                   text-sm md:text-base lg:text-lg"
      >
        Here's what our <span className="text-white">satisfied clients</span>{" "}
        say
      </motion.h3>

      <div
        className="flex flex-col md:flex-row items-center justify-center 
                      gap-6 md:gap-7 lg:gap-8"
      >
        {TESTIMONIALS.map((testimonial) => (
          <TestimonialCard key={testimonial.author} {...testimonial} />
        ))}
      </div>
    </div>
  </div>
);

export default ClientsPage;
