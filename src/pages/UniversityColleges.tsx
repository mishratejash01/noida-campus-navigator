import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, ArrowRight, Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const UniversityColleges = () => {
  const { universityId } = useParams(); // This is "aktu" from the URL

  const { data, isLoading, error } = useQuery({
    queryKey: ["university-colleges", universityId],
    queryFn: async () => {
      console.log("1. Searching for University with Acronym:", universityId);

      // STEP 1: Find the University ID using the Acronym (e.g., 'aktu')
      // We use .ilike for case-insensitive matching (matches 'aktu', 'AKTU', 'Aktu')
      const { data: uniData, error: uniError } = await supabase
        .from("universities")
        .select("id, name, acronym")
        .ilike("acronym", universityId || "")
        .single();

      if (uniError) {
        console.error("University Lookup Error:", uniError);
        // If no university found, throw a specific error to display
        throw new Error(`University "${universityId}" not found in database.`);
      }

      console.log("2. University Found:", uniData);

      // STEP 2: Use the UUID we just found to get the colleges
      const { data: collegeData, error: collegeError } = await supabase
        .from("colleges")
        .select("*")
        .eq("affiliated_university_id", uniData.id); // Use the real UUID here

      if (collegeError) {
        console.error("Colleges Fetch Error:", collegeError);
        throw collegeError;
      }

      console.log("3. Colleges Found:", collegeData);

      return { university: uniData, colleges: collegeData };
    },
    enabled: !!universityId,
    retry: false, // Don't keep retrying if it's a bad request
  });

  // Clean data access
  const universityName = data?.university?.name || universityId?.toUpperCase();
  const colleges = data?.colleges || [];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <main className="flex-grow container mx-auto px-4 py-24">
        <div className="mb-8">
          <Link to="/colleges" className="text-sm text-primary hover:underline mb-2 inline-block">
            ← Back to Universities
          </Link>
          <h1 className="text-4xl font-bold mb-2">
            Colleges under <span className="text-primary">{universityName}</span>
          </h1>
          <p className="text-muted-foreground">
             Listing all affiliated institutions.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : error ? (
          <Alert variant="destructive" className="border-red-500/50 bg-red-500/10">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error Loading Data</AlertTitle>
            <AlertDescription>
              {error.message}
              <br />
              <span className="text-xs opacity-70 mt-2 block">
                Check your console (F12) for detailed database logs.
              </span>
            </AlertDescription>
          </Alert>
        ) : colleges.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {colleges.map((college) => (
              <Card key={college.id} className="hover:shadow-lg transition-all border-primary/10">
                <CardHeader>
                  <CardTitle className="text-xl">{college.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-2 text-muted-foreground text-sm">
                      <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                      <span>{college.city || "Noida"}, {college.address}</span>
                    </div>
                    
                    {college.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {college.description}
                      </p>
                    )}

                    <Button asChild className="w-full variant-outline">
                      <Link to={`/college/${college.id}`}>
                        View Campus Details 
                        <ArrowRight className="w-4 h-4 ml-2" />
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
              The university exists, but no colleges are linked to it yet.
            </p>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default UniversityColleges;
