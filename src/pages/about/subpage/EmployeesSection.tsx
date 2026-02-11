import { motion } from "framer-motion";
import { SubpageHeader } from "../../../components/SubpageHeader";

interface Employee {
  id: number;
  name: string;
  position: string;
  image?: string;
}

interface EmployeesSectionProps {
  isVisible?: boolean;
}

const employees: Employee[] = [
  {
    id: 1,
    name: "Aadharsh Srinivas R",
    position: "Designer & COO",
  },
  { id: 2, name: "Akshaya Dharshini S", position: "Full Stack Developer" },
  { id: 3, name: "Annuradha M", position: "Operations Manager" },
  {
    id: 4,
    name: "Ashwin Preyan M",
    position: "Back-end Developer",
  },
  { id: 5, name: "Divakar G", position: "Senior Executive" },
  { id: 6, name: "Elakiyan D", position: "Jr. Visual Designer" },
  { id: 7, name: "Ganesh R", position: "Digital Studio Manager" },
  { id: 8, name: "Gaushikha B J", position: "Back-end Developer" },
  { id: 9, name: "Hashini Ravishankar", position: "UI/UX Designer" },
  { id: 10, name: "Lavanya", position: "Jr. Moodle Developer" },
  {
    id: 11,
    name: "Logeshwari",
    position: "eLearning Web Developer",
  },
  { id: 12, name: "Pandi Durai S", position: "Front-end Developer" },
  { id: 13, name: "Ponnulakshmi S", position: "Application Developer" },
  { id: 14, name: "Rajendran S P", position: "Full Stack Developer" },
  { id: 15, name: "Sarveshwaran J", position: "Data Analyst" },
  { id: 16, name: "Shyam Sundar S", position: "Digital Video Specialist" },
  {
    id: 17,
    name: "Sribalaji Ravi",
    position: "Founder & CEO",
  },
];

const EmployeeCard = ({ employee }: { employee: Employee }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{
        opacity: 1,
        y: 0,
        transition: { delay: 0.2, duration: 0.5 },
      }}
      viewport={{ once: true, amount: 0.5 }}
    >
      <article className="bg-[#0A0A0A] rounded-2xl sm:rounded-4xl p-3 sm:p-4 flex flex-col items-center text-center gap-3 sm:gap-5 border border-[#1B1B1B]">
        <figure className="w-full h-36 sm:h-48 md:h-56 lg:h-62 rounded-2xl sm:rounded-4xl overflow-hidden">
          {employee.image ? (
            <img
              src={employee.image}
              alt={employee.name}
              className="w-full h-full object-cover"
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 w-full">
        {employees.map((employee, i) => (
          <EmployeeCard key={employee.id} employee={employee} />
        ))}
      </div>
    </section>
  );
};

export default EmployeesSection;
