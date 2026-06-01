import { HiAcademicCap } from "react-icons/hi2";
import FullPageLoader from "../../components/FullPageLoader";
import TotalItems from "../../components/TotalItems";
import { useStudentsByTeacher } from "../students/StudentsByTeacher";
import { useClasses } from "./useClasses";
import { FaPlay } from "react-icons/fa";
import { AiOutlineCheck } from "react-icons/ai";
import { FaPeopleLine } from "react-icons/fa6";

export default function Total() {
  const { classes = [], isLoading: classesLoading } = useClasses();
  const { students = [], isLoading: studentsLoading } = useStudentsByTeacher();

  if (classesLoading || studentsLoading) return <FullPageLoader />;

  const stats = [
    { totalname: "Total Classes",     total: classes.length,                                          icon: <HiAcademicCap />, color: "purple" },
    { totalname: "Active Classes",    total: classes.filter(c => c.status === "active").length,       icon: <FaPlay />,        color: "teal"   },
    { totalname: "Completed Classes", total: classes.filter(c => c.status === "completed").length,    icon: <AiOutlineCheck />, color: "amber" },
    { totalname: "Total Students",    total: students.length,                                         icon: <FaPeopleLine />,  color: "blue"   },
  ] as const;

  return (
    <div className="mb-8 flex flex-wrap gap-4">
      {stats.map((stat) => (
        <TotalItems key={stat.totalname} {...stat} />
      ))}
    </div>
  );
}