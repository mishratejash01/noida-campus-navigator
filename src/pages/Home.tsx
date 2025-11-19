import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, BookOpen, Briefcase, Calendar, ArrowRight, Building2, Users, Award, Star } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import Counter from "@/components/ui/Counter";

const Home = () => {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <Navigation />
      
      {/* Hero Section with Premium Glow */}
      <section className="relative container py-32 overflow-hidden">
        {/* Background Glow Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] -z-10 opacity-50 animate-pulse" />
        
        <div className="mx-auto max-w-5xl text-center relative z-10">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-6 py-2 text-sm font-medium text-primary shadow-[0_0_15px_rgba(124,58,237,0.3)] backdrop-blur-sm">
            <Star className="h-4 w-4 fill-primary" />
            The Premium Gateway to Noida's Education
          </div>
          
          <h1 className="mb-8 text-6xl md:text-7xl font-extrabold leading-tight tracking-tight">
            Master Your Future in <br />
            <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent drop-shadow-sm">
              Noida
            </span>
          </h1>
          
          <p className="mb-12 text-xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
            Navigate the academic landscape with precision. Exclusive access to colleges, elite resources, and career-defining opportunities.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/colleges">
              <Button size="lg" className="h-14 px-8 text-lg rounded-full bg-white text-black hover:bg-gray-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                Explore Institutions <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/resources">
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/40 backdrop-blur-md transition-all">
                <BookOpen className="mr-2 h-5 w-5" />
                Access Resources
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid - Glassmorphism */}
      <section className="container pb-32 relative z-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                to: "/colleges",
                icon: GraduationCap,
                title: "Elite Directory",
                desc: "Curated list of Noida's finest affiliated universities and colleges.",
                color: "text-purple-400"
              },
              {
                to: "/resources",
                icon: BookOpen,
                title: "Premium Vault",
                desc: "Exclusive access to notes, PYQs, and advanced study materials.",
                color: "text-blue-400"
              },
              {
                to: "/internships",
                icon: Briefcase,
                title: "Career Forge",
                desc: "Connect with top-tier companies for internships and placements.",
                color: "text-emerald-400"
              },
              {
                to: "/events",
                icon: Calendar,
                title: "Exclusive Events",
                desc: "Priority registration for workshops, hackathons, and summits.",
                color: "text-amber-400"
              }
            ].map((item, index) => (
              <Link to={item.to} key={index} className="group">
                <Card className="h-full bg-secondary/20 border-white/5 backdrop-blur-sm hover:bg-secondary/40 hover:border-primary/30 transition-all duration-300 hover:-translate-y-2 shadow-lg">
                  <CardHeader>
                    <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-background/50 border border-white/10 ${item.color} shadow-inner group-hover:scale-110 transition-transform`}>
                      <item.icon className="h-7 w-7" />
                    </div>
                    <CardTitle className="text-xl text-white group-hover:text-primary transition-colors">{item.title}</CardTitle>
                    <CardDescription className="text-gray-400 leading-relaxed">
                      {item.desc}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm font-medium text-primary/80 group-hover:text-primary group-hover:gap-3 transition-all">
                      Explore <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section - Dark & Sleek */}
      <section className="py-32 bg-black/40 border-y border-white/5 relative">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        <div className="container relative z-10">
          <div className="mx-auto max-w-6xl grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-5xl font-bold tracking-tight text-white">
                Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">Legacy</span>
              </h2>
              <p className="text-lg text-gray-400 font-light leading-loose">
                Noida College Compass wasn't built to just list colleges. It was engineered to eliminate fragmentation. We provide a unified, high-performance ecosystem for the ambitious student.
              </p>
              <ul className="space-y-6">
                {[
                  "Intelligent Filtering & Analytics",
                  "Curated High-Performance Content",
                  "Industry-Direct Connections"
                ].map((text, i) => (
                  <li key={i} className="flex items-center gap-4 text-white/90 group">
                    <div className="h-px w-8 bg-primary group-hover:w-12 transition-all"></div>
                    <span className="text-lg">{text}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative h-[500px] w-full rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-gray-900 to-black flex items-center justify-center group">
              <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <Users className="h-32 w-32 text-white/20 group-hover:text-primary/50 transition-all duration-500 scale-110" />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials - Minimalist */}
      <section className="container py-32">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold text-white mb-4">Voices of Excellence</h2>
          <div className="h-1 w-20 bg-primary mx-auto rounded-full"></div>
        </div>
        <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
          {[
            { quote: "The definitive platform for academic resources. Unmatched quality.", author: "Rohan K.", role: "B.Tech Scholar" },
            { quote: "Navigation so intuitive, it feels like an extension of my own workflow.", author: "Priya S.", role: "MBA Aspirant" },
            { quote: "Secured a premium internship within days. This ecosystem works.", author: "Vivek M.", role: "Final Year" }
          ].map((t, i) => (
            <Card key={i} className="bg-transparent border border-white/10 hover:border-primary/50 transition-all duration-500 hover:bg-white/5">
              <CardHeader>
                <div className="flex text-accent mb-4">
                  {[...Array(5)].map((_, starI) => (
                    <Star key={starI} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="text-lg text-gray-300 italic mb-6">"{t.quote}"</p>
                <div className="border-t border-white/5 pt-4">
                  <CardTitle className="text-base text-white">{t.author}</CardTitle>
                  <CardDescription className="text-primary">{t.role}</CardDescription>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats Section - High Contrast */}
      <section className="border-t border-white/5 bg-black py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />
        <div className="container relative">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-12 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10">
              
              <div className="text-center px-4">
                <div className="text-5xl font-bold text-white mb-2 flex justify-center items-baseline">
                  <Counter value={50} fontSize={48} textColor="#ffffff" />
                  <span className="text-primary text-4xl ml-1">+</span>
                </div>
                <div className="text-sm font-medium tracking-widest text-gray-500 uppercase mt-2">Premium Institutions</div>
              </div>

              <div className="text-center px-4">
                <div className="text-5xl font-bold text-white mb-2 flex justify-center items-baseline">
                  <Counter value={10000} places={[10000, 1000, 100, 10, 1]} fontSize={48} textColor="#ffffff" />
                  <span className="text-primary text-4xl ml-1">+</span>
                </div>
                <div className="text-sm font-medium tracking-widest text-gray-500 uppercase mt-2">Ambitious Minds</div>
              </div>

              <div className="text-center px-4">
                <div className="text-5xl font-bold text-white mb-2 flex justify-center items-baseline">
                  <Counter value={1000} places={[1000, 100, 10, 1]} fontSize={48} textColor="#ffffff" />
                  <span className="text-primary text-4xl ml-1">+</span>
                </div>
                <div className="text-sm font-medium tracking-widest text-gray-500 uppercase mt-2">Curated Resources</div>
              </div>

            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
