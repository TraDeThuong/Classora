import { useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import FullPageLoader from "./FullPageLoader";
import { useStudent } from "../features/student/useStudent";

interface ProtectStudentRouteProps {
  children: ReactNode;
}

export default function ProtectStudentRoute({
  children,
}: ProtectStudentRouteProps) {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useStudent();

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      navigate("/student/login");
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) return <FullPageLoader text="Loading student portal..." />;

  if (isAuthenticated) return <>{children}</>;

  return null;
}
