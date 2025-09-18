import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Onboarding from "./pages/Onboarding";
import AcademicOnboarding from "./pages/AcademicOnboarding";
import DashboardLayout from "./components/DashboardLayout";
import Home from "./pages/dashboard/Home";
import Profile from "./pages/dashboard/Profile";
import Universities from "./pages/dashboard/Universities";
import Programs from "./pages/dashboard/Programs";
import Applications from "./pages/dashboard/Applications";
import Chat from "./pages/dashboard/Chat";

const queryClient = new QueryClient();

const AuthHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const handleAuthRedirect = async () => {
      // Check if URL contains access_token hash (from email confirmation)
      const hashFragment = window.location.hash;
      if (!hashFragment.includes('access_token') || isProcessing) return;

      setIsProcessing(true);

      try {
        // Parse the session from URL hash
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          navigate('/auth');
          return;
        }

        if (data.session) {
          // Fetch user profile to check completion status
          const { data: studentData, error: studentError } = await supabase
            .from('students')
            .select('profile_completion_status')
            .eq('user_id', data.session.user.id)
            .maybeSingle();

          if (studentError && studentError.code !== 'PGRST116') {
            console.error('Error fetching student profile:', studentError);
          }

          // Clean up URL by removing hash fragment
          window.history.replaceState(null, '', window.location.pathname);

          // Redirect based on profile completion status
          if (!studentData || studentData.profile_completion_status === 'incomplete' || studentData.profile_completion_status === 'partial') {
            navigate('/onboarding');
          } else if (studentData.profile_completion_status === 'complete') {
            navigate('/dashboard');
          } else {
            navigate('/onboarding'); // Default fallback
          }
        }
      } catch (error) {
        console.error('Error handling auth redirect:', error);
        navigate('/auth');
      } finally {
        setIsProcessing(false);
      }
    };

    handleAuthRedirect();
  }, [navigate, location, isProcessing]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthHandler />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/academic-onboarding" element={<AcademicOnboarding />} />
          
          {/* Dashboard Routes */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Home />} />
            <Route path="profile" element={<Profile />} />
            <Route path="universities" element={<Universities />} />
            <Route path="programs" element={<Programs />} />
            <Route path="applications" element={<Applications />} />
            <Route path="chat" element={<Chat />} />
          </Route>
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
