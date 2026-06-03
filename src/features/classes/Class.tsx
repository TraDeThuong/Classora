import { ClassStatus } from "../../components/ClassStatus";
import type { Class } from "../../types/classes";
import { Link } from "react-router-dom";
import { getClassStatus } from "../../utils/getClassStatus";

interface ClassCardProps {
  classItem: Class;
}

export default function ClassCard({ classItem }: ClassCardProps) {
  const displayStatus = getClassStatus(classItem);
  return (
    <Link to={`/teacher/classes/${classItem.id}`} className="group block w-full">
      <div className="
        flex flex-col overflow-hidden rounded-2xl bg-white
        border border-gray-100 shadow-sm
        transition-all duration-300 ease-[cubic-bezier(.34,1.56,.64,1)]
        group-hover:-translate-y-2 group-hover:scale-[1.02] group-hover:shadow-xl
      ">
        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden">
          <img
            src={classItem.thumbnail ?? "/default-thumbnail.png"}
            alt={classItem.class_name}
            className="
              h-full w-full object-cover
              transition-transform duration-500
              group-hover:scale-105
            "
          />
          {/* overlay on hover */}
          <div className="
            absolute inset-0 bg-black/0
            transition-all duration-300
            group-hover:bg-black/10
          "/>
          {/* status badge float trên thumbnail */}
          <div className="absolute bottom-3 left-3">
            <ClassStatus status={displayStatus} />
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-3 p-5">
          <h3 className="
            line-clamp-1 text-md font-semibold text-gray-900
            transition-colors duration-200 group-hover:text-violet-600
          ">
            {classItem.class_name}
          </h3>

          <div className="space-y-1.5 text-lg text-gray-500">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Class code</span>
              <span className="font-medium text-gray-700">{classItem.class_code}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Room</span>
              <span className="font-medium text-gray-700">
                {classItem.room ?? "Not specified"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Students</span>
              <span className="font-medium text-gray-700">{classItem.max_students}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="
          flex items-center justify-between
          border-t border-gray-100 px-5 py-3
          transition-colors duration-200
          group-hover:bg-violet-50/50
        ">
          <span className="text-lg text-gray-400">View details</span>
          <span className="
            text-lg font-medium text-violet-500
            translate-x-0 transition-transform duration-200
            group-hover:translate-x-1
          ">
            → 
          </span>
        </div>
      </div>
    </Link>
  );
}
