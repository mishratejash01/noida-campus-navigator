import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, BookOpen, Briefcase, Calendar, ArrowRight, Users, Star, MousePointerClick, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Counter from "@/components/ui/Counter";
import Prism from "@/components/ui/Prism";

const Home = () => {
  const features = [
    {
      title: "College Reviews",
      description: "Honest feedback from students about academics, infrastructure, and campus life.",
      icon: Star,
      link: "/colleges",
      color: "text-yellow-500",
      bg: "bg-yellow-50",
    },
    {
      title: "Campus Pulse",
      description: "Real-time anonymous feed to see what's buzzing on campus right now.",
      icon: Users,
      link: "/pulse",
      color: "text-purple-500",
      bg: "bg-purple-50",
    },
    {
      title: "Events",
      description: "Never miss a fest, workshop, or club meeting happening near you.",
      icon: Calendar,
      link: "/events",
      color: "text-pink-500",
      bg: "bg-pink-50",
    },
    {
      title: "Notes & Resources",
      description: "Shared study materials, past papers, and notes from top scorers.",
      icon: BookOpen,
      link: "/resources",
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      title: "Internships",
      description: "Find local opportunities and gigs relevant to your field.",
      icon: Briefcase,
      link: "/internships",
      color: "text-green-500",
      bg: "bg-green-50",
    },
    {
      title: "Housing",
      description: "Find the best PGs, hostels, and flats near your college.",
      icon: GraduationCap,
      link: "/housing",
      color: "text-orange-500",
      bg: "bg-orange-50",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white pb-16 pt-12 text-center shadow-sm lg:pt-20">
        <div className="container mx-auto px-4">
          <div className="relative z-10 mx-auto max-w-3xl space-y-6">
            <div className="mx-auto w-fit rounded-full bg-indigo-50 px-4 py-1.5 text-sm font-medium text-indigo-600">
              🚀 Now live for all Noida colleges
            </div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
              Survive <span className="text-indigo-600">College</span> <br /> Like a Pro.
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-slate-600">
              The ultimate student companion app. Honest reviews, leaked mess menus, exam war rooms, and bunk calculators.
            </p>
            <div className="flex justify-center gap-4 pt-4">
              <Button asChild size="lg" className="rounded-full bg-indigo-600 px-8 text-lg font-semibold hover:bg-indigo-700">
                <Link to="/colleges">Explore Colleges <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full px-8 text-lg">
                <Link to="/pulse">Check Pulse 📢</Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Background Decorative Blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 transform">
          <div className="h-[500px] w-[500px] rounded-full bg-indigo-100/50 blur-3xl"></div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-800">Everything You Need</h2>
          <p className="mt-2 text-slate-500">From academics to chilling, we've got you covered.</p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Link key={feature.title} to={feature.link}>
              <Card className="h-full transition-all hover:-translate-y-1 hover:shadow-lg border-slate-100">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${feature.bg}`}>
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl text-slate-800">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-600 text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-slate-900 py-16 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
            <div className="space-y-2">
              <div className="text-4xl font-black text-indigo-400">
                <Counter end={50} suffix="+" />
              </div>
              <div className="text-sm font-medium text-slate-400">Colleges Listed</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-black text-indigo-400">
                <Counter end={2000} suffix="+" />
              </div>
              <div className="text-sm font-medium text-slate-400">Daily Users</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-black text-indigo-400">
                <Counter end={500} suffix="+" />
              </div>
              <div className="text-sm font-medium text-slate-400">Resources Shared</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-black text-indigo-400">
                <Counter end={100} suffix="%" />
              </div>
              <div className="text-sm font-medium text-slate-400">Free to Use</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
