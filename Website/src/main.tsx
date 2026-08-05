import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { SessionProvider, useSession } from "./lib/session";
import { Toaster } from "sonner";
import "../src/styles.css";

// Route components
import LoginPage from "./routes/index";
import ForgotPasswordPage from "./routes/auth/forgot-password";
import SignupPage from "./routes/auth/signup";
import ResetPasswordPage from "./routes/auth/reset-password";
import { AppLayout } from "./components/layout/AppLayout";

// App route components
import Dashboard from "./routes/app/dashboard";
import Assets from "./routes/app/assets";
import Allocations from "./routes/app/allocations";
import Bookings from "./routes/app/bookings";
import Maintenance from "./routes/app/maintenance";
import Audits from "./routes/app/audits";
import Departments from "./routes/app/departments";
import Categories from "./routes/app/categories";
import Employees from "./routes/app/employees";
import Reports from "./routes/app/reports";
import Notifications from "./routes/app/notifications";
import Profile from "./routes/app/profile";

// Tab component mapping
const tabComponents: Record<string, React.ComponentType> = {
  dashboard: Dashboard,
  assets: Assets,
  allocations: Allocations,
  bookings: Bookings,
  maintenance: Maintenance,
  audits: Audits,
  departments: Departments,
  categories: Categories,
  employees: Employees,
  reports: Reports,
  notifications: Notifications,
  profile: Profile,
};

// Role-based route component
function RoleBasedRoute() {
  const { user } = useSession();
  const { role, tab } = useParams<{ role: string; tab: string }>();

  // Validate role matches user's role
  if (!user || role !== user.role) {
    return <Navigate to="/" replace />;
  }

  // Get the component for the tab
  const Component = tabComponents[tab || "dashboard"];

  // If tab doesn't exist, redirect to dashboard
  if (!Component) {
    return <Navigate to={`/u/role/${user.role}/tab/dashboard`} replace />;
  }

  return <Component />;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, hydrated } = useSession();

  if (!hydrated) {
    return null; // or loading spinner
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            {/* Protected role-based routes */}
            <Route
              path="/u/role/:role/tab/:tab"
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<RoleBasedRoute />} />
              <Route path="*" element={<RoleBasedRoute />} />
            </Route>

            {/* Redirect old routes to new structure */}
            <Route path="/app" element={<Navigate to="/" replace />} />
            <Route path="/app/dashboard" element={<Navigate to="/" replace />} />
            <Route path="/app/assets" element={<Navigate to="/" replace />} />
            <Route path="/app/allocations" element={<Navigate to="/" replace />} />
            <Route path="/app/bookings" element={<Navigate to="/" replace />} />
            <Route path="/app/maintenance" element={<Navigate to="/" replace />} />
            <Route path="/app/audits" element={<Navigate to="/" replace />} />
            <Route path="/app/departments" element={<Navigate to="/" replace />} />
            <Route path="/app/categories" element={<Navigate to="/" replace />} />
            <Route path="/app/employees" element={<Navigate to="/" replace />} />
            <Route path="/app/reports" element={<Navigate to="/" replace />} />
            <Route path="/app/notifications" element={<Navigate to="/" replace />} />
            <Route path="/app/profile" element={<Navigate to="/" replace />} />
            <Route path="/dashboard" element={<Navigate to="/" replace />} />
            <Route path="/assets" element={<Navigate to="/" replace />} />
            <Route path="/allocations" element={<Navigate to="/" replace />} />
            <Route path="/bookings" element={<Navigate to="/" replace />} />
            <Route path="/maintenance" element={<Navigate to="/" replace />} />
            <Route path="/audits" element={<Navigate to="/" replace />} />
            <Route path="/departments" element={<Navigate to="/" replace />} />
            <Route path="/categories" element={<Navigate to="/" replace />} />
            <Route path="/employees" element={<Navigate to="/" replace />} />
            <Route path="/reports" element={<Navigate to="/" replace />} />
            <Route path="/notifications" element={<Navigate to="/" replace />} />
            <Route path="/profile" element={<Navigate to="/" replace />} />

            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster richColors closeButton position="top-right" />
        </BrowserRouter>
      </SessionProvider>
    </QueryClientProvider>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
