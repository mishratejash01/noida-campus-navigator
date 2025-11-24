import { Link, useLocation } from "react-router-dom";
import { Home, Building2, Calendar, BookOpen, Briefcase, Home as HomeIcon, Activity, ShoppingBag, ShieldAlert, Gamepad2 } from "lucide-react";
import { cn } from "@/lib/utils";

const Navigation = () => {
  const location = useLocation();

  const links = [
    { to: "/", label: "Home", icon: Home },
    { to: "/pulse", label: "Pulse", icon: Activity },
    { to: "/colleges", label: "Colleges", icon: Building2 },
    { to: "/marketplace", label: "Market", icon: ShoppingBag },
    { to: "/survival", label: "Survival", icon: ShieldAlert },
    { to: "/fun", label: "Fun", icon: Gamepad2 },
    { to: "/events", label: "Events", icon: Calendar },
    { to: "/housing", label: "Housing", icon: HomeIcon },
    { to: "/resources", label: "Notes", icon: BookOpen },
    { to: "/internships", label: "Jobs", icon: Briefcase },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-4xl px-4 pointer-events-none">
      <nav className="pointer-events-auto mx-auto flex items-center justify-between gap-2 rounded-2xl border border-white/10 bg-black/60 p-2 shadow-2xl backdrop-blur-xl supports-[backdrop-filter]:bg-black/30 overflow-x-auto no-scrollbar">
        {links.map(({ to, label, icon: Icon }) => {
          const isActive = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={cn(
                "group relative flex min-w-[64px] flex-col items-center justify-center rounded-xl px-3 py-2.5 transition-all duration-300 hover:bg-white/10",
                isActive ? "text-white" : "text-zinc-400 hover:text-zinc-100"
              )}
            >
              <div className={cn(
                "mb-1 transition-transform duration-300 group-hover:-translate-y-0.5",
                isActive && "-translate-y-0.5"
              )}>
                <Icon className={cn("h-5 w-5", isActive ? "text-primary fill-primary/20" : "")} />
              </div>
              <span className="text-[10px] font-medium tracking-wide opacity-80">{label}</span>
              
              {/* Active Indicator */}
              {isActive && (
                <span className="absolute bottom-1 h-1 w-8 rounded-full bg-primary shadow-[0_0_10px_rgba(124,58,237,0.5)]" />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Navigation;
