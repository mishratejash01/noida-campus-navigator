import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, ArrowRight, Building2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const UniversityColleges = () => {
  // This grabs the ID (e.g., "aktu" or a UUID) from the URL
  const { universityId } = useParams();

  const { data: colleges, isLoading, error } = useQuery({
    queryKey: ["colleges-by-university", universityId],
    queryFn: async () => {
      if (!universityId) return [];
      
      console.log("Fetching colleges for university ID:", universityId);

      // We select all colleges where the 'affiliated_university_id' matches the URL ID
      // We also join the university data to get the university name for the title
      const { data, error } = await supabase
        .from("colleges")
        .select("*, universities!inner(name)")
        .eq("affiliated_university_id", universityId);

      if (error) {
        console.error("Supabase Error:", error);
        throw error;
      }

      return data;
    },
    enabled: !!universityId,
  });

  // Helper to get the university name safely
  const universityName = colleges && colleges.length > 0 
    ? colleges[0].universities?.name 
    : "University";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="mb-8">
          <Link to="/colleges" className="text-sm text-primary hover:underline mb-2 inline-block">
            ← Back to Universities
          </Link>
          <h1 className="text-4xl font-bold mb-2">
            Colleges under <span className="text-primary">{universityName}</span>
          </h1>
          <p className="text-muted-foreground">
            {colleges ? `${colleges.length} colleges found` : "Loading..."}
          </p>
        </div>

        {/* Content Section */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="p-4 border border-destructive/50 bg-destructive/10 rounded-lg text-destructive">
            Error loading colleges. Please check that the University ID is correct.
          </div>
        ) : colleges && colleges.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {colleges.map((college) => (
              <Card key={college.id} className="hover:shadow-lg transition-all duration-300 border-primary/10">
                <CardHeader>
                  <CardTitle className="text-xl line-clamp-1">{college.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-2 text-muted-foreground text-sm">
                      <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                      <span>{college.address || "No address provided"}</span>
                    </div>
                    
                    {college.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {college.description}
                      </p>
                    )}

                    <Button asChild className="w-full group variant-outline">
                      <Link to={`/college/${college.id}`}>
                        View Campus Details 
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border-2 border-dashed rounded-lg bg-muted/20">
            <Building2 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold">No Colleges Found</h3>
            <p className="text-muted-foreground mt-2 max-w-md mx-auto">
              We couldn't find any colleges linked to this university ID ({universityId}). 
              Check your database "colleges" table and ensure the <strong>affiliated_university_id</strong> matches.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UniversityColleges;
