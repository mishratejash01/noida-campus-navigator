import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Colleges from "./pages/Colleges";
import CollegeDetails from "./pages/CollegeDetails";
import UniversityColleges from "./pages/UniversityColleges";
import Events from "./pages/Events";
import Housing from "./pages/Housing";
import Resources from "./pages/Resources";
import Internships from "./pages/Internships";
import CampusPulse from "./pages/CampusPulse";
// New Imports
import Marketplace from "./pages/Marketplace";
import Survival from "./pages/Survival";
import FunZone from "./pages/FunZone";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-slate-50/50">
          <Navigation />
          <div className="flex-grow pt-4">
             <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/colleges" element={<Colleges />} />
              <Route path="/colleges/:id" element={<CollegeDetails />} />
              <Route path="/university/:id" element={<UniversityColleges />} />
              <Route path="/events" element={<Events />} />
              <Route path="/housing" element={<Housing />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/internships" element={<Internships />} />
              <Route path="/pulse" element={<CampusPulse />} />
              
              {/* New Routes */}
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/survival" element={<Survival />} />
              <Route path="/fun" element={<FunZone />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
