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
  const { universityId } = useParams(); // This grabs "aktu" from the URL

  const { data: colleges, isLoading, error } = useQuery({
    queryKey: ["colleges", universityId],
    queryFn: async () => {
      // Uses 'ilike' so 'aktu' in URL matches 'AKTU' in database
      const { data, error } = await supabase
        .from("colleges")
        .select("*")
        .ilike("university", universityId || "");

      if (error) throw error;
      return data;
    },
    enabled: !!universityId,
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      <main className="flex-grow container mx-auto px-4 py-24">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">
             <span className="text-primary uppercase">{universityId}</span> Colleges
          </h1>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin" /></div>
        ) : colleges && colleges.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-6">
            {colleges.map((college) => (
              <Card key={college.id}>
                <CardHeader><CardTitle>{college.name}</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{college.location}</p>
                  <Button asChild className="w-full">
                    <Link to={`/college/${college.id}`}>View Details</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Alert>
            <Database className="h-4 w-4" />
            <AlertTitle>No Colleges Found</AlertTitle>
            <AlertDescription>
              Connected to DB but found no colleges with university = "{universityId}".
            </AlertDescription>
          </Alert>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default UniversityColleges;
