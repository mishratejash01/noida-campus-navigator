import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Colleges from "./pages/Colleges";
import UniversityColleges from "./pages/UniversityColleges"; // <--- IMPORT THIS
import CollegeDetails from "./pages/CollegeDetails";
import Resources from "./pages/Resources";
import Internships from "./pages/Internships";
import Events from "./pages/Events";
import Housing from "./pages/Housing";
import CampusPulse from "./pages/CampusPulse";
import { Footer } from "./components/Footer";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="flex min-h-screen flex-col">
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/colleges" element={<Colleges />} />
              
              {/* 👇 THIS IS THE MISSING LINE CAUSING THE 404 👇 */}
              <Route path="/colleges/:universityId" element={<UniversityColleges />} />
              {/* 👆 This accepts ANY university ID from your backend (aktu, du, etc.) 👆 */}

              <Route path="/college/:id" element={<CollegeDetails />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/internships" element={<Internships />} />
              <Route path="/events" element={<Events />} />
              <Route path="/housing" element={<Housing />} />
              <Route path="/pulse" element={<CampusPulse />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
