import { Link, useLocation } from "react-router-dom";
import { Home, Building2, Calendar, BookOpen, Briefcase, Home as HomeIcon, Activity, ShoppingBag, ShieldAlert, Gamepad2 } from "lucide-react";
import { cn } from "@/lib/utils";

const Navigation = () => {
  const location = useLocation();

  const links = [
    { to: "/", label: "Home", icon: Home },
    { to: "/pulse", label: "Pulse", icon: Activity }, // Moved Pulse earlier for visibility
    { to: "/colleges", label: "Colleges", icon: Building2 },
    { to: "/marketplace", label: "Market", icon: ShoppingBag }, // New
    { to: "/survival", label: "Survival", icon: ShieldAlert }, // New
    { to: "/fun", label: "Fun Zone", icon: Gamepad2 }, // New
    { to: "/events", label: "Events", icon: Calendar },
    { to: "/housing", label: "Housing", icon: HomeIcon },
    { to: "/resources", label: "Notes", icon: BookOpen },
    { to: "/internships", label: "Jobs", icon: Briefcase },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 items-center overflow-x-auto no-scrollbar px-4">
        <div className="mr-4 hidden md:flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">NoidaCampus</span>
          </Link>
        </div>
        
        {/* Mobile & Desktop Menu */}
        <div className="flex w-full items-center justify-between md:justify-end gap-1 md:gap-2">
          {links.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={cn(
                "flex flex-col md:flex-row items-center justify-center md:justify-start rounded-md px-3 py-2 text-xs md:text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground min-w-[60px] md:min-w-0",
                location.pathname === to
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground"
              )}
            >
              <Icon className="h-5 w-5 md:mr-2 md:h-4 md:w-4" />
              <span className="mt-1 md:mt-0">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
