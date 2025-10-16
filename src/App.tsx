import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AIChatbot } from "@/components/AIChatbot";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Domains from "./pages/Domains";
import Discover from "./pages/Discover";
import LanguageSelection from "./pages/cp/LanguageSelection";
import ProficiencyLevel from "./pages/cp/ProficiencyLevel";
import Resources from "./pages/cp/Resources";
import DailyBlogs from "./pages/cp/DailyBlogs";
import AimlOverview from "./pages/aiml/Overview";
import AimlStepPage from "./pages/aiml/StepPage";
import ResearchPapers from "./pages/aiml/ResearchPapers";
import Web3Track from "./pages/web3/Web3Track";
import Web2Track from "./pages/web2/Web2Track";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/domains" element={<ProtectedRoute><Domains /></ProtectedRoute>} />
            <Route path="/discover" element={<ProtectedRoute><Discover /></ProtectedRoute>} />
          
          {/* CP/DSA Routes */}
          <Route path="/cp" element={<ProtectedRoute><LanguageSelection /></ProtectedRoute>} />
          <Route path="/cp/:language/level" element={<ProtectedRoute><ProficiencyLevel /></ProtectedRoute>} />
          <Route path="/cp/:language/:level" element={<ProtectedRoute><Resources /></ProtectedRoute>} />
          <Route path="/cp/blogs" element={<ProtectedRoute><DailyBlogs /></ProtectedRoute>} />
          
          {/* AI/ML Routes */}
          <Route path="/aiml" element={<ProtectedRoute><AimlOverview /></ProtectedRoute>} />
          <Route path="/aiml/step-:step" element={<ProtectedRoute><AimlStepPage /></ProtectedRoute>} />
          <Route path="/aiml/papers" element={<ProtectedRoute><ResearchPapers /></ProtectedRoute>} />
          
          {/* Web3 Route */}
          <Route path="/web3" element={<ProtectedRoute><Web3Track /></ProtectedRoute>} />
          
          {/* Web2 Route */}
          <Route path="/web2" element={<ProtectedRoute><Web2Track /></ProtectedRoute>} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <AIChatbot />
      </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
