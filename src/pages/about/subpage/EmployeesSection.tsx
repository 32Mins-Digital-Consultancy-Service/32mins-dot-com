import { useState } from "react";
import { motion } from "framer-motion";
import { SubpageHeader } from "../../../components/SubpageHeader";

interface Employee {
  id: number;
  name: string;
  position: string;
  image?: string;
}

const employees: Employee[] = [
  {
    id: 1,
    name: "Aadharsh Srinivas R",
    position: "Designer & COO",
    image: "../src/images/32mins_emp/Aadharsh Srinivas R.jpeg",
  },
  {
    id: 2,
    name: "Akshaya Dharshini S",
    position: "Full Stack Developer",
    image: "../src/images/32mins_emp/Akshaya Dharshini S.jpeg",
  },
  {
    id: 3,
    name: "Annuradha M",
    position: "Operations Manager",
    image: "../src/images/32mins_emp/Annuradha M.jpeg",
  },
  {
    id: 4,
    name: "Ashwin Preyan M",
    position: "Back-end Developer",
    image: "../src/images/32mins_emp/Ashwin Preyan M.jpeg",
  },
  {
    id: 5,
    name: "Divakar G",
    position: "Senior Executive",
    image: "../src/images/32mins_emp/Divakar G.jpeg",
  },
  {
    id: 6,
    name: "Elakiyan D",
    position: "Jr. Visual Designer",
    image: "../src/images/32mins_emp/Elakiyan D.jpeg",
  },
  {
    id: 7,
    name: "Ganesh R",
    position: "Digital Studio Manager",
    image: "../src/images/32mins_emp/Ganesh R.jpeg",
  },
  {
    id: 8,
    name: "Gaushikha B J",
    position: "Back-end Developer",
    image: "../src/images/32mins_emp/Gaushikha B J.jpeg",
  },
  {
    id: 9,
    name: "Hashini Ravishankar",
    position: "UI/UX Designer",
    image: "../src/images/32mins_emp/Hashini Ravishankar.jpeg",
  },
  {
    id: 10,
    name: "Lavanya",
    position: "Jr. Moodle Developer",
    image: "../src/images/32mins_emp/Lavanya.jpeg",
  },
  {
    id: 11,
    name: "Logeshwari",
    position: "eLearning Web Developer",
    image: "../src/images/32mins_emp/Logeshwari.jpeg",
  },
  {
    id: 12,
    name: "Pandi Durai S",
    position: "Front-end Developer",
    image: "../src/images/32mins_emp/Pandi Durai S.jpeg",
  },
  {
    id: 13,
    name: "Ponnulakshmi S",
    position: "Application Developer",
    image: "../src/images/32mins_emp/Ponnulakshmi S.jpeg",
  },
  {
    id: 14,
    name: "Rajendran SP",
    position: "Full Stack Developer",
    image: "../src/images/32mins_emp/Rajendran SP.jpeg",
  },
  {
    id: 15,
    name: "Sarveshwaran J",
    position: "Data Analyst",
    image: "../src/images/32mins_emp/Sarveshwaran J.jpeg",
  },
  {
    id: 16,
    name: "new",
    position: "Digital Video Specialist",
    image: "../src/images/32mins_emp/new.jpeg",
  },
  {
    id: 17,
    name: "Sribalaji Ravi",
    position: "Founder & CEO",
    image: "../src/images/32mins_emp/Sribalaji Ravi.jpeg",
  },
];

const gridVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" as const },
  },
};

const EmployeeCard = ({ employee }: { employee: Employee }) => {
  const [imageError, setImageError] = useState(false);
  const imageAvailable = employee.image && !imageError;

  return (
    <motion.div variants={cardVariants}>
      <article className="bg-[#0A0A0A] rounded-2xl sm:rounded-4xl p-3 sm:p-4 flex flex-col items-center text-center gap-3 sm:gap-5 border border-[#1B1B1B]">
        <figure className="w-full h-36 sm:h-48 md:h-56 lg:h-62 rounded-2xl sm:rounded-4xl overflow-hidden">
          {imageAvailable ? (
            <img
              src={employee.image}
              alt={employee.name}
              className="w-full h-full object-cover object-top"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full bg-linear-to-b from-[#0A1956] to-[#2741F4] rounded-2xl sm:rounded-4xl"></div>
          )}
        </figure>
        <header>
          <h3 className="text-white text-base sm:text-lg md:text-xl lg:text-2xl font-semibold tracking-tighter">
            {employee.name}
          </h3>
          <p className="text-[#8E8E8E] text-xs sm:text-sm font-normal tracking-tighter">
            {employee.position}
          </p>
        </header>
      </article>
    </motion.div>
  );
};

const EmployeesSection = () => {
  return (
    <section className="flex flex-col items-center justify-center gap-4 sm:gap-6 max-w-4xl mx-auto px-4 sm:px-6 md:px-8 w-full">
      <header className="flex flex-col items-center justify-center gap-3 sm:gap-4">
        <SubpageHeader title="Our Team" />
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{
            opacity: 1,
            y: 0,
            transition: { delay: 0.2, duration: 0.5 },
          }}
          viewport={{ once: true, amount: 0.5 }}
          className="text-white text-[clamp(1.25rem,4vw,1.875rem)] font-bold tracking-tighter text-center"
        >
          Meet the Minds Behind 32Mins
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{
            opacity: 1,
            y: 0,
            transition: { delay: 0.2, duration: 0.5 },
          }}
          viewport={{ once: true, amount: 0.5 }}
          className="text-[#8E8E8E] text-[clamp(0.875rem,2vw,1.125rem)] font-normal tracking-tighter text-center max-w-2xl"
        >
          We bring together technology and strategy to create tailor-made
          solutions for you.
        </motion.p>
      </header>
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 w-full"
        variants={gridVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        {employees.map((employee) => (
          <EmployeeCard key={employee.id} employee={employee} />
        ))}
      </motion.div>
    </section>
  );
};

export default EmployeesSection;
