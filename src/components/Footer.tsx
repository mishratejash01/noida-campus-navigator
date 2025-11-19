import { Link } from "react-router-dom";
import { GraduationCap, Github, Twitter, Linkedin, Mail, AlertTriangle, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-black text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[128px] -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-900/5 rounded-full blur-[128px] translate-y-1/2 pointer-events-none" />

      <div className="container py-16 relative z-10">
        <div className="grid gap-12 md:grid-cols-4 lg:gap-8">
          
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-6 group w-fit">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-purple-700 shadow-lg group-hover:shadow-primary/50 transition-all duration-300">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white group-hover:text-primary transition-colors">
                Noida Campus Navigator
              </span>
            </Link>
            <p className="text-muted-foreground mb-6 max-w-md leading-relaxed">
              A student-led initiative to simplify campus life in Noida. We bridge the gap between official university updates and the real student experience.
            </p>
            <div className="flex gap-4">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10 hover:text-primary">
                <Github className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10 hover:text-blue-400">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10 hover:text-blue-600">
                <Linkedin className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10 hover:text-red-500">
                <Mail className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-6 text-white">Explore</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/colleges" className="text-muted-foreground hover:text-primary transition-colors">
                  College Directory
                </Link>
              </li>
              <li>
                <Link to="/resources" className="text-muted-foreground hover:text-primary transition-colors">
                  Study Resources
                </Link>
              </li>
              <li>
                <Link to="/internships" className="text-muted-foreground hover:text-primary transition-colors">
                  Internships
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-muted-foreground hover:text-primary transition-colors">
                  Events Calendar
                </Link>
              </li>
              <li>
                <Link to="/housing" className="text-muted-foreground hover:text-primary transition-colors">
                  PG & Hostels
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Community */}
          <div>
            <h3 className="font-semibold text-lg mb-6 text-white">Community</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/pulse" className="text-muted-foreground hover:text-primary transition-colors">
                  Campus Pulse (Feed)
                </Link>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Report an Issue
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Submit Resource
                </a>
              </li>
              <li>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-xs font-medium">
                  <AlertTriangle className="h-3 w-3" /> Unofficial Portal
                </span>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-12 bg-white/10" />

        {/* Bottom Section: Disclaimer & Copyright */}
        <div className="space-y-8">
          
          {/* Disclaimer Box */}
          <div className="rounded-lg border border-white/5 bg-white/5 p-6 backdrop-blur-sm">
            <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              Important Disclaimer
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong>Noida Campus Navigator is a student-run, open-source initiative and is NOT affiliated with any university, government body, or educational institution listed on this website.</strong> 
              <br /><br />
              All content, including college details, resources, and internship listings, is crowdsourced or aggregated for informational purposes only. 
              While we strive for accuracy, we cannot guarantee the validity of the information. Users are advised to verify details with official college websites before making financial or academic decisions. 
              <br /><br />
              <strong>User Content:</strong> Opinions expressed in the "Campus Pulse" or "Reviews" sections are solely those of the individual contributors and do not reflect the views of the platform administrators. 
              We are not liable for any personal information you choose to share in public forums or with third-party listings (PGs/Internships). Use responsibly.
            </p>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© {currentYear} Noida Campus Navigator. Open Source under MIT License.</p>
            <p className="flex items-center gap-1">
              Made with <Heart className="h-4 w-4 text-red-500 fill-red-500 animate-pulse" /> by Students, for Students.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
