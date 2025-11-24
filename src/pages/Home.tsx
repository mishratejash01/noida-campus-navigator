import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, BookOpen, Briefcase, Calendar, ArrowRight, Users, Star, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Counter from "@/components/ui/Counter";

const Home = () => {
  const features = [
    {
      title: "College Reviews",
      description: "Unfiltered truths about academics & campus life.",
      icon: Star,
      link: "/colleges",
      gradient: "from-yellow-500/20 to-orange-500/20",
      text: "text-yellow-500",
    },
    {
      title: "Campus Pulse",
      description: "Anonymous feed. See what's actually buzzing.",
      icon: Users,
      link: "/pulse",
      gradient: "from-purple-500/20 to-indigo-500/20",
      text: "text-purple-500",
    },
    {
      title: "Events Radar",
      description: "Fests, workshops, and nightlife near you.",
      icon: Calendar,
      link: "/events",
      gradient: "from-pink-500/20 to-rose-500/20",
      text: "text-pink-500",
    },
    {
      title: "War Room",
      description: "Past papers and notes from the toppers.",
      icon: BookOpen,
      link: "/resources",
      gradient: "from-blue-500/20 to-cyan-500/20",
      text: "text-blue-500",
    },
    {
      title: "Gig Finder",
      description: "Internships and hustles for students.",
      icon: Briefcase,
      link: "/internships",
      gradient: "from-emerald-500/20 to-green-500/20",
      text: "text-emerald-500",
    },
    {
      title: "Housing Hunt",
      description: "Best PGs and flats, vetted by seniors.",
      icon: GraduationCap,
      link: "/housing",
      gradient: "from-orange-500/20 to-red-500/20",
      text: "text-orange-500",
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden pb-32">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/20 blur-[120px] rounded-full pointer-events-none opacity-50" />
      
      {/* Hero Section */}
      <div className="relative z-10 container mx-auto px-4 pt-20 pb-32 text-center">
        <div className="animate-float inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-md mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          Live for all Noida colleges
        </div>
        
        <h1 className="mx-auto max-w-4xl text-5xl font-black tracking-tight text-white sm:text-7xl lg:text-8xl mb-6">
          Survive College <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-pink-500 animate-shimmer bg-[length:200%_auto]">
            Like a Pro.
          </span>
        </h1>
        
        <p className="mx-auto max-w-2xl text-xl text-zinc-400 mb-10 leading-relaxed">
          The ultimate companion for the modern student. Leaked menus, honest reviews, and the tools you need to dominate campus life.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild size="lg" className="rounded-full h-14 px-8 text-lg bg-white text-black hover:bg-zinc-200 transition-all hover:scale-105">
            <Link to="/colleges">Explore Colleges</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-full h-14 px-8 text-lg border-white/10 bg-black/40 backdrop-blur-md text-white hover:bg-white/10 transition-all hover:scale-105">
            <Link to="/pulse">Check Pulse 📢</Link>
          </Button>
        </div>
      </div>

      {/* Bento Grid Features */}
      <div className="container mx-auto px-4 mb-32">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Link key={feature.title} to={feature.link} className="group relative block h-full">
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-100 blur-xl`} />
              <Card className="relative h-full overflow-hidden border-white/10 bg-zinc-900/50 backdrop-blur-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:border-white/20">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <div className={`p-3 rounded-xl bg-white/5 w-fit ${feature.text}`}>
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <ArrowUpRight className="text-zinc-600 group-hover:text-white transition-colors" />
                  </div>
                  <CardTitle className="text-xl font-bold text-zinc-100">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-zinc-400 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Glass Stats Section */}
      <div className="container mx-auto px-4 mb-20">
        <div className="rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl p-12">
          <div className="grid grid-cols-2 gap-12 text-center md:grid-cols-4">
            {[
              { label: "Colleges Listed", value: 50, suffix: "+" },
              { label: "Daily Users", value: 2000, suffix: "+" },
              { label: "Resources", value: 500, suffix: "+" },
              { label: "Free Forever", value: 100, suffix: "%" },
            ].map((stat, i) => (
              <div key={i} className="space-y-2">
                <div className="text-4xl font-black text-white md:text-5xl">
                  <Counter end={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-sm font-medium uppercase tracking-wider text-zinc-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
