import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, BookOpen, Briefcase, Calendar } from "lucide-react";

export const Navigation = () => {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80">
            <GraduationCap className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Noida College Compass
          </span>
        </Link>
        
        <div className="flex items-center gap-6">
          <Link to="/colleges">
            <Button variant="ghost" className="gap-2">
              <GraduationCap className="h-4 w-4" />
              Colleges
            </Button>
          </Link>
          <Link to="/resources">
            <Button variant="ghost" className="gap-2">
              <BookOpen className="h-4 w-4" />
              Resources
            </Button>
          </Link>
          <Link to="/internships">
            <Button variant="ghost" className="gap-2">
              <Briefcase className="h-4 w-4" />
              Internships
            </Button>
          </Link>
          <Link to="/events">
            <Button variant="ghost" className="gap-2">
              <Calendar className="h-4 w-4" />
              Events
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};
