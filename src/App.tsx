import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Domains from "./pages/Domains";
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
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/domains" element={<Domains />} />
          
          {/* CP/DSA Routes */}
          <Route path="/cp" element={<LanguageSelection />} />
          <Route path="/cp/:language/level" element={<ProficiencyLevel />} />
          <Route path="/cp/:language/:level" element={<Resources />} />
          <Route path="/cp/blogs" element={<DailyBlogs />} />
          
          {/* AI/ML Routes */}
          <Route path="/aiml" element={<AimlOverview />} />
          <Route path="/aiml/step-:step" element={<AimlStepPage />} />
          <Route path="/aiml/papers" element={<ResearchPapers />} />
          
          {/* Web3 Route */}
          <Route path="/web3" element={<Web3Track />} />
          
          {/* Web2 Route */}
          <Route path="/web2" element={<Web2Track />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
