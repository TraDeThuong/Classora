import { BrowserRouter, Navigate, Route, Routes, useParams } from "react-router-dom";
import Dashboard from "./pages/teacher/Dashboard";
import Account from "./pages/teacher/Account";
import Classes from "./pages/teacher/Classes";
import Login from "./pages/teacher/Login";
import SignUp from "./pages/teacher/SignUp";
import PageNotFound from "./pages/teacher/PageNotFound";
import AppLayout from "./components/AppLayout";
import Assignments from "./pages/teacher/Assignments";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import AuthCallback from "./features/authentication/AuthCallback";
import CompleteSignUp from "./features/authentication/CompleteSignUp";
import ProtectRoute from "./components/ProtectRoute";
import ClassDetail from "./pages/teacher/ClassDetail";
import Profile from "./pages/teacher/Profile";
import ProtectStudentRoute from "./components/ProtectStudentRoute";
import StudentLayout from "./features/student/StudentLayout";
import StudentAuthCallback from "./features/student/StudentAuthCallback";
import StudentLogin from "./pages/student/StudentLogin";
import StudentSignup from "./pages/student/StudentSignup";
import StudentCompleteSignUp from "./pages/student/StudentCompleteSignUp";
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentClasses from "./pages/student/StudentClasses";
import StudentSchedules from "./pages/student/StudentSchedules";
import StudentAssignments from "./pages/student/StudentAssignments";
import StudentAssignmentTake from "./pages/student/StudentAssignmentTake";
import StudentResults from "./pages/student/StudentResults";
import StudentProfile from "./pages/student/StudentProfile";
import RoleSelect from "./pages/teacher/RoleSelect";
import TeacherAssignmentDetail from "./pages/teacher/TeacherAssignmentDetail";
import Analytics from "./pages/teacher/Analytics";
import StudentClassDetail from "./pages/student/StudentClassDetail";
import Students from "./pages/teacher/Students";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
});

function LegacyClassRedirect() {
  const { classId } = useParams();
  return <Navigate replace to={`/teacher/classes/${classId}`} />;
}

function LegacyAssignmentRedirect() {
  const { assignmentId } = useParams();
  return <Navigate replace to={`/teacher/assignments/${assignmentId}`} />;
}

export default function App() {
  // throw new Error("Test Error Boundary");
  return (
    <QueryClientProvider client = {queryClient}>
      <BrowserRouter>
        <Routes>
          <Route index element={<RoleSelect />} />

          <Route element={
            <ProtectRoute>
              <AppLayout />
            </ProtectRoute>
          }>
            <Route path="teacher/dashboard" element={<Dashboard />} />
            <Route path="teacher/analytics" element={<Analytics />} />
            <Route path="teacher/account" element={<Account />} />
            <Route path="teacher/classes" element={<Classes />} />
            <Route path="teacher/students" element={<Students />} />
            <Route path="teacher/assignments" element={<Assignments />} />
            <Route path="teacher/assignments/:assignmentId" element={<TeacherAssignmentDetail />} />
            <Route path="teacher/profile" element={<Profile />} />
            <Route path="teacher/classes/:classId" element={<ClassDetail />} />
          </Route>

          <Route path="teacher/login" element={<Login />} />
          <Route path="teacher/signup" element={<SignUp />} />
          <Route path="teacher/complete-signup" element={<CompleteSignUp />} />
          <Route path="teacher/auth/callback" element={<AuthCallback />} />

          <Route path="login" element={<Navigate replace to="/teacher/login" />} />
          <Route path="signup" element={<Navigate replace to="/teacher/signup" />} />
          <Route path="complete-signup" element={<Navigate replace to="/teacher/complete-signup" />} />
          <Route path="auth/callback" element={<Navigate replace to="/teacher/auth/callback" />} />
          <Route path="dashboard" element={<Navigate replace to="/teacher/dashboard" />} />
          <Route path="analytics" element={<Navigate replace to="/teacher/analytics" />} />
          <Route path="account" element={<Navigate replace to="/teacher/account" />} />
          <Route path="classes" element={<Navigate replace to="/teacher/classes" />} />
          <Route path="students" element={<Navigate replace to="/teacher/students" />} />
          <Route path="classes/:classId" element={<LegacyClassRedirect />} />
          <Route path="assignments" element={<Navigate replace to="/teacher/assignments" />} />
          <Route path="assignments/:assignmentId" element={<LegacyAssignmentRedirect />} />
          <Route path="profile" element={<Navigate replace to="/teacher/profile" />} />

          <Route path="student/login" element={<StudentLogin />} />
          <Route path="student/signup" element={<StudentSignup />} />
          <Route path="student/complete-signup" element={<StudentCompleteSignUp />} />
          <Route path="student/auth/callback" element={<StudentAuthCallback />} />

          <Route element={
            <ProtectStudentRoute>
              <StudentLayout />
            </ProtectStudentRoute>
          }>
            <Route path="student" element={<Navigate replace to="/student/dashboard" />} />
            <Route path="student/dashboard" element={<StudentDashboard />} />
            <Route path="student/classes" element={<StudentClasses />} />
            <Route path="/student/classes/:classId" element={<StudentClassDetail />} />
            <Route path="student/schedules" element={<StudentSchedules />} />
            <Route path="student/assignments" element={<StudentAssignments />} />
            <Route path="student/assignments/:assignmentId" element={<StudentAssignmentTake />} />
            <Route path="student/results" element={<StudentResults />} />
            <Route path="student/profile" element={<StudentProfile />} />
          </Route>

          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>

      <Toaster
            position="top-center"
            gutter={12}
            containerStyle={{ margin: "8px" }}
            toastOptions={{
              success: {
                duration: 3000,
              },
              error: {
                duration: 5000,
              },
              style: {
                fontSize: "16px",
                maxWidth: "500px",
                padding: "16px 24px",
                backgroundColor: "var(--color-grey-0)",
                color: "var(--color-grey-700)",
              },
            }}
      />
    </QueryClientProvider>
  )
}
