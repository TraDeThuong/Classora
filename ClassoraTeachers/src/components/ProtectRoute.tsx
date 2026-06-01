import { useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import useTeacher from "../features/authentication/useTeacher";
import FullPageLoader from "./FullPageLoader";

interface ProtectRouteProps {
  children: ReactNode;
}

export default function ProtectRoute({
  children,
}: ProtectRouteProps) {
  const navigate = useNavigate();

  const { isAuthenticated, isLoading } = useTeacher();

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      navigate("/login");
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading)
    return (<FullPageLoader text="Loading..." />);

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return null;
}