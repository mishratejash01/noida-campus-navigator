import { GraduationCap, BookOpen, Briefcase, Calendar, Home as HomeIcon, Building2, Activity } from "lucide-react";
import { AnimeNavBar } from "@/components/ui/anime-navbar";

export const Navigation = () => {
  const navItems = [
    {
      name: "Home",
      url: "/",
      icon: HomeIcon,
    },
    {
      name: "Colleges",
      url: "/colleges",
      icon: GraduationCap,
    },
    {
      name: "Resources",
      url: "/resources",
      icon: BookOpen,
    },
    {
      name: "Housing",
      url: "/housing",
      icon: Building2,
    },
    {
      name: "Pulse",
      url: "/pulse",
      icon: Activity,
    },
    {
      name: "Internships",
      url: "/internships",
      icon: Briefcase,
    },
    {
      name: "Events",
      url: "/events",
      icon: Calendar,
    },
  ];

  return (
    <>
      {/* The AnimeNavBar is fixed, so we don't need a container to hold space for it 
          because it floats on top. The page padding handles the content offset. */}
      <AnimeNavBar items={navItems} defaultActive="Home" />
    </>
  );
};
