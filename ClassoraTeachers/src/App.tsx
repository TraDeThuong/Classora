import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Account from "./pages/Account";
import Classes from "./pages/Classes";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import PageNotFound from "./pages/PageNotFound";
import Test from "./pages/Test";
import AppLayout from "./components/AppLayout";
import Assignments from "./pages/Assignments";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import AuthCallback from "./features/authentication/AuthCallback";
import CompleteSignUp from "./features/authentication/CompleteSignUp";
import ProtectRoute from "./components/ProtectRoute";
import ClassDetail from "./pages/ClassDetail";
import Profile from "./pages/Profile";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
});

export default function App() {
  // throw new Error("Test Error Boundary");
  return (
    <QueryClientProvider client = {queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={
            <ProtectRoute>
              <AppLayout />
            </ProtectRoute>
          }>
            <Route index element={<Navigate replace to="dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="account" element={<Account />} />
            <Route path="classes" element={<Classes />} />
            <Route path="assignments" element={<Assignments />} />
            <Route path="profile" element={<Profile />} />
            <Route path="/classes/:classId" element={<ClassDetail />} />
          </Route>

          <Route path="login" element={<Login />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="complete-signup" element={<CompleteSignUp />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="test" element={<Test />} />

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
