import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, BookOpen, Briefcase, Calendar } from "lucide-react";

export const Navigation = () => {
  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-background/60 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-purple-700 shadow-lg group-hover:shadow-primary/50 transition-all duration-300">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white group-hover:text-primary transition-colors">
            Noida College Compass
          </span>
        </Link>
        
        <div className="flex items-center gap-2">
          {[
            { to: "/colleges", icon: GraduationCap, label: "Colleges" },
            { to: "/resources", icon: BookOpen, label: "Resources" },
            { to: "/internships", icon: Briefcase, label: "Internships" },
            { to: "/events", icon: Calendar, label: "Events" }
          ].map((item) => (
            <Link to={item.to} key={item.label}>
              <Button variant="ghost" className="text-gray-400 hover:text-white hover:bg-white/5 gap-2 transition-all duration-200 rounded-full px-4">
                <item.icon className="h-4 w-4" />
                {item.label}
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};
