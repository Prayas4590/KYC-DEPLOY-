import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import AdminLogin from "./pages/AdminLogin";
import StaffLogin from "./pages/StaffLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import StaffDashboard from "./pages/staff/StaffDashboard";
import NewKYC from "./pages/staff/NewKYC";
import KYCHistory from "./pages/staff/KYCHistory";
import KYCConfirmationPage from "./pages/staff/KYCConfirmationPage";
import ReKYC from "./pages/staff/ReKYC";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/staff-login" element={<StaffLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/staff/dashboard" element={<StaffDashboard />} />
            <Route path="/staff/new-kyc" element={<NewKYC />} />
            <Route path="/staff/kyc-history" element={<KYCHistory />} />
            <Route path="/staff/kyc-confirmation" element={<KYCConfirmationPage />} />
            <Route path="/staff/rekyc" element={<ReKYC />} />
            <Route path="/staff/rekyc/:id" element={<ReKYC />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
