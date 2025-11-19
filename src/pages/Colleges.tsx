import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const universities = [
  {
    id: "aktu", // This is the ID passed to the URL
    name: "Dr. A.P.J. Abdul Kalam Technical University",
    shortName: "AKTU",
    location: "Lucknow, Uttar Pradesh",
    type: "State Technical University",
    description: "Formerly UPtu, is a public collegiate university in Lucknow.",
  },
  {
    id: "du",
    name: "University of Delhi",
    shortName: "DU",
    location: "New Delhi",
    type: "Central University",
    description: "A premier university of the country with a venerable legacy.",
  },
  {
    id: "ipu",
    name: "Guru Gobind Singh Indraprastha University",
    shortName: "IPU",
    location: "New Delhi",
    type: "State University",
    description: "Established by the Govt. of NCT of Delhi.",
  },
  {
    id: "amity",
    name: "Amity University",
    shortName: "Amity",
    location: "Noida, Uttar Pradesh",
    type: "Private University",
    description: "A private research university in India.",
  },
];

const Colleges = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <main className="flex-grow container mx-auto px-4 py-24">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Browse by University
          </h1>
          <p className="text-muted-foreground text-lg">
            Select a university to view its affiliated colleges and campus details.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {universities.map((uni) => (
            <Link key={uni.id} to={`/colleges/${uni.id}`}>
              <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-primary/10 group cursor-pointer">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                      <Building2 className="w-6 h-6 text-primary" />
                    </div>
                    <span className="px-3 py-1 bg-secondary text-secondary-foreground text-xs rounded-full">
                      {uni.shortName}
                    </span>
                  </div>
                  <CardTitle className="mt-4 text-xl group-hover:text-primary transition-colors">
                    {uni.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-muted-foreground text-sm line-clamp-2">
                      {uni.description}
                    </p>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <span className="border-l-2 border-primary/20 pl-2">
                        {uni.type}
                      </span>
                    </div>
                    <div className="flex items-center text-primary font-medium text-sm pt-2">
                      View Affiliated Colleges 
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Colleges;
