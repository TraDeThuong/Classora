// export default function Class() {
//   return (
//     <div
//       className="flex w-full sm:w-mn flex-col overflow-hidden rounded-2xl bg-brand-200 shadow-lg">
//       <div className="aspect-video overflow-hidden">
//         <img
//           src="src/assets/img/thumbnail_1.png"
//           alt="Class thumbnail"
//           className="h-full w-full object-cover"
//         />
//       </div>
//       <div className="flex flex-col items-center gap-2 p-5 text-center text-white">
//         <h3 className="mb-3 text-2xl font-bold sm:text-3xl">
//           Web Design
//         </h3>

//         <p className="text-sm sm:text-base">Class Code: 124679</p>
//         <p className="text-sm sm:text-base">Teacher: Huynh Thanh Tra</p>
//         <p className="text-sm sm:text-base">Students: 30</p>
//         <p className="text-sm sm:text-base">Assignments: 6</p>

//         <p className="mt-2 rounded-full bg-white/20 px-4 py-1 text-sm font-semibold">
//           Status: Active
//         </p>
//       </div>
//     </div>
//   );
// }

import { ClassStatus } from "../../components/ClassStatus";
import type { Class } from "../../types/classes";

interface ClassCardProps {
  classItem: Class;
}

export default function ClassCard({ classItem }: ClassCardProps) {
  return (
    <div className="flex w-full sm:w-mn flex-col overflow-hidden rounded-2xl bg-brand-200 shadow-lg">
      <div className="aspect-video overflow-hidden">
        <img
          src={classItem.thumbnail ?? "/default-thumbnail.png"}
          alt={classItem.class_name}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex flex-col items-center gap-2 p-5 text-center text-white">
        <h3 className="mb-3 text-2xl font-bold sm:text-3xl">
          {classItem.class_name}
        </h3>

        <p className="text-sm sm:text-base">
          Class Code: {classItem.class_code}
        </p>

        <p className="text-sm sm:text-base">
          Room: {classItem.room ?? "Not specified"}
        </p>

        <p className="text-sm sm:text-base">
          Students: {classItem.max_students}
        </p>
        
        <ClassStatus status={classItem.status}/>
      </div>
    </div>
  );
}