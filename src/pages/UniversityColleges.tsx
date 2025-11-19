import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, ArrowRight, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const UniversityColleges = () => {
  const { universityId } = useParams();

  console.log("1. URL Parameter (universityId):", universityId);

  const { data: colleges, isLoading, error } = useQuery({
    queryKey: ["colleges", universityId],
    queryFn: async () => {
      console.log("2. Starting Supabase fetch for university:", universityId);
      
      // Fetching all columns to ensure we aren't missing data due to selection
      const { data, error } = await supabase
        .from("colleges")
        .select("*")
        // We use ilike for case-insensitive matching to be safer, or eq if you are sure
        .eq("university", universityId);

      if (error) {
        console.error("3. Supabase Error:", error);
        throw error;
      }

      console.log("3. Supabase Success. Data returned:", data);
      return data;
    },
  });

  // Decoded ID for display (removes %20 etc if present)
  const displayId = decodeURIComponent(universityId || "");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <main className="flex-grow container mx-auto px-4 py-24">
        {/* DEBUG SECTION - REMOVE LATER */}
        <div className="mb-8 p-4 border-2 border-yellow-400 bg-yellow-50/10 rounded-lg text-sm font-mono">
          <h3 className="text-yellow-500 font-bold mb-2">🚧 DEBUG MODE ENABLED</h3>
          <p><strong>URL Parameter:</strong> {universityId}</p>
          <p><strong>Status:</strong> {isLoading ? "Loading..." : "Finished"}</p>
          <p><strong>Colleges Found:</strong> {colleges?.length || 0}</p>
          {error && <p className="text-red-500"><strong>Error:</strong> {error.message}</p>}
          <div className="mt-2">
             <strong>Raw Data from DB:</strong>
             <pre className="bg-black/80 text-green-400 p-2 rounded mt-1 overflow-auto max-h-40">
               {JSON.stringify(colleges, null, 2)}
             </pre>
          </div>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">
            Colleges under <span className="text-primary capitalize">{displayId}</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Explore affiliated institutions and their details.
          </p>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : colleges && colleges.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {colleges.map((college) => (
              <Card key={college.id} className="hover:shadow-lg transition-shadow border-primary/10">
                <CardHeader>
                  <CardTitle className="text-xl">{college.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4 mt-1 shrink-0" />
                      <span>{college.location}</span>
                    </div>
                    <p className="text-sm line-clamp-3">{college.description}</p>
                    <Button asChild className="w-full group">
                      <Link to={`/college/${college.id}`}>
                        View Details 
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No Colleges Found</AlertTitle>
            <AlertDescription>
              We searched for colleges where the <strong>university</strong> column equals <strong>"{universityId}"</strong> but found nothing. 
              <br/><br/>
              <strong>To fix this:</strong>
              <ul className="list-disc pl-5 mt-2">
                <li>Go to your Supabase Dashboard {'>'} Table Editor {'>'} "colleges".</li>
                <li>Look at the rows you added (like GCET).</li>
                <li>Check the <strong>university</strong> column exactly. Does it say "AKTU" or "aktu" or something else? It must match exactly.</li>
              </ul>
            </AlertDescription>
          </Alert>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default UniversityColleges;
