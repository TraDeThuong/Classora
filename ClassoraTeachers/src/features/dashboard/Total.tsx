import { HiAcademicCap, HiClipboardList } from "react-icons/hi";
import { FaPeopleLine } from "react-icons/fa6";
import Spinner from "../../components/Spinner";
import TotalItems from "../../components/TotalItems";
import { useAssignments } from "../assignments/useAssignments";
import { useClasses } from "../classes/useClasses";
import { useStudentsByTeacher } from "../students/StudentsByTeacher";

export default function Total() {
  const { assignments = [], isLoading: assignmentLoading } = useAssignments();
  const { classes = [],     isLoading: classesLoading    } = useClasses();
  const { students = [],    isLoading: studentsLoading   } = useStudentsByTeacher();

  if (assignmentLoading || classesLoading || studentsLoading)
    return (
      <div className="flex items-center justify-center py-10">
        <Spinner size="md" />
      </div>
    );

  const stats = [
    { totalname: "Total Classes",     total: classes.length,     icon: <HiAcademicCap />,  color: "purple" },
    { totalname: "Total Students",    total: students.length,    icon: <FaPeopleLine />,   color: "teal"   },
    { totalname: "Total Assignments", total: assignments.length, icon: <HiClipboardList />, color: "amber" },
  ] as const;

  return (
    <div className="mb-8 flex flex-wrap gap-4">
      {stats.map((stat) => (
        <TotalItems key={stat.totalname} {...stat} />
      ))}
    </div>
  );
}