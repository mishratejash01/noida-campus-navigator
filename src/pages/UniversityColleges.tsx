import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, ArrowRight, Loader2, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const UniversityColleges = () => {
  const { universityId } = useParams();

  // Fetch colleges dynamically based on the URL parameter
  const { data: colleges, isLoading, error } = useQuery({
    queryKey: ["colleges", universityId],
    queryFn: async () => {
      console.log("Fetching for university:", universityId);
      
      // .ilike is CRITICAL here. It matches 'aktu' to 'AKTU' (case-insensitive)
      const { data, error } = await supabase
        .from("colleges")
        .select("*")
        .ilike("university", universityId || "");

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }
      
      return data;
    },
    enabled: !!universityId, // Only run if we have an ID
  });

  const displayTitle = universityId ? universityId.toUpperCase() : "University";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <main className="flex-grow container mx-auto px-4 py-24">
        
        {/* DEBUG PANEL: Only shows if there is an issue or for verification */}
        <div className="mb-8 p-4 bg-slate-950 text-green-400 rounded-md font-mono text-xs overflow-hidden">
            <div className="flex items-center gap-2 mb-2 border-b border-green-900 pb-2">
                <Database className="w-4 h-4" />
                <span className="font-bold">LIVE DB CONNECTION STATUS</span>
            </div>
            <div>Target University (URL): <span className="text-white">{universityId}</span></div>
            <div>Fetch Status: <span className="text-white">{isLoading ? "Loading..." : "Complete"}</span></div>
            <div>Colleges Found: <span className="text-white">{colleges?.length || 0}</span></div>
            {colleges?.length === 0 && !isLoading && (
                <div className="text-red-400 mt-2">
                    WARNING: Query returned 0 rows. 
                    Check that the 'university' column in Supabase contains "{universityId}" (case-insensitive).
                </div>
            )}
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">
            Colleges under <span className="text-primary">{displayTitle}</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Affiliated institutions managed in the database.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertTitle>Database Error</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
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
                    {college.description && (
                        <p className="text-sm line-clamp-3">{college.description}</p>
                    )}
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
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <h3 className="text-xl font-semibold">No Colleges Found</h3>
            <p className="text-muted-foreground mt-2">
                There are no colleges in the database marked with university: "{universityId}".
            </p>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default UniversityColleges;
