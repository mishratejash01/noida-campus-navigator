import { Link } from "react-router-dom";
import { GraduationCap, Github, Twitter, Linkedin, Mail, AlertTriangle, Heart, ShieldCheck } from "lucide-react";
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
              The definitive independent platform for campus life in Noida. Bridging the gap between institutional updates and the real-world academic experience through data-driven insights.
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
            <h3 className="font-semibold text-lg mb-6 text-white">Platform</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/colleges" className="text-muted-foreground hover:text-primary transition-colors">
                  College Directory
                </Link>
              </li>
              <li>
                <Link to="/resources" className="text-muted-foreground hover:text-primary transition-colors">
                  Resource Vault
                </Link>
              </li>
              <li>
                <Link to="/internships" className="text-muted-foreground hover:text-primary transition-colors">
                  Career Portal
                </Link>
              </li>
              <li>
                <Link to="/housing" className="text-muted-foreground hover:text-primary transition-colors">
                  Housing & Hostels
                </Link>
              </li>
              <li>
                <Link to="/pulse" className="text-muted-foreground hover:text-primary transition-colors">
                  Community Pulse
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Support */}
          <div>
            <h3 className="font-semibold text-lg mb-6 text-white">Legal & Support</h3>
            <ul className="space-y-4">
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Content Guidelines
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Report a Violation
                </a>
              </li>
              <li>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium">
                  <ShieldCheck className="h-3 w-3" /> Independent Entity
                </span>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-12 bg-white/10" />

        {/* Disclaimer Box - Critical for Liability */}
        <div className="space-y-8">
          <div className="rounded-lg border border-white/5 bg-white/5 p-6 backdrop-blur-sm">
            <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              Disclaimer & Liability Waiver
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed text-justify">
              <strong>Noida Campus Navigator is an independent, open-source community platform and is NOT affiliated, associated, authorized, endorsed by, or in any way officially connected with any university, government body, or educational institution listed on this website.</strong>
              <br /><br />
              The information provided herein is for general informational purposes only. All content, including college data, study resources, and housing listings, is aggregated from public sources or user submissions. We make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the site.
              <br /><br />
              <strong>User Responsibility:</strong> Any reliance you place on such information is strictly at your own risk. We shall not be held liable for any loss or damage of any kind incurred as a result of the use of the site or reliance on any information provided. Users are strongly advised to verify all details (including fees, admission criteria, and housing costs) directly with the respective official authorities before taking any action.
            </p>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© {currentYear} Noida Campus Navigator. All Rights Reserved.</p>
            <p className="flex items-center gap-1">
              Made with <Heart className="h-4 w-4 text-primary fill-primary animate-pulse" /> for the Community.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
