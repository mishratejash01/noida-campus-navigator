import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Navigation } from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, BookOpen, GraduationCap, ExternalLink, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface College {
  id: string;
  name: string;
  address: string;
  description: string | null;
  website_url: string | null;
  established_year: number | null;
}

interface Program {
  id: string;
  name: string;
  acronym: string;
  duration: string;
  description: string | null;
  program_type: string | null;
}

const CollegeDetails = () => {
  const { collegeId } = useParams();
  const [college, setCollege] = useState<College | null>(null);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [collegeId]);

  const fetchData = async () => {
    try {
      // Fetch college details
      const { data: collegeData, error: collegeError } = await supabase
        .from("colleges")
        .select("*")
        .eq("id", collegeId)
        .single();

      if (collegeError) throw collegeError;
      setCollege(collegeData);

      // Fetch programs offered by this college
      const { data: programsData, error: programsError } = await supabase
        .from("college_programs")
        .select("programs(*)")
        .eq("college_id", collegeId);

      if (programsError) throw programsError;
      const programsList = programsData?.map((cp: any) => cp.programs) || [];
      setPrograms(programsList);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container py-12">
        <Button variant="ghost" className="mb-6 gap-2" onClick={() => window.history.back()}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        {loading ? (
          <>
            <Skeleton className="h-12 w-2/3 mb-4" />
            <Skeleton className="h-6 w-1/3 mb-8" />
          </>
        ) : (
          <div className="mb-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold mb-2">{college?.name}</h1>
                <div className="flex items-center gap-4 text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {college?.address}
                  </span>
                  {college?.established_year && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Est. {college.established_year}
                    </span>
                  )}
                </div>
              </div>
              {college?.website_url && (
                <Button variant="outline" asChild>
                  <a href={college.website_url} target="_blank" rel="noopener noreferrer" className="gap-2">
                    Visit Website <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              )}
            </div>
            {college?.description && (
              <p className="text-lg text-muted-foreground max-w-3xl">
                {college.description}
              </p>
            )}
          </div>
        )}

        <Tabs defaultValue="programs" className="w-full">
          <TabsList>
            <TabsTrigger value="programs">Programs Offered</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>

          <TabsContent value="programs" className="mt-6">
            {loading ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                  </Card>
                ))}
              </div>
            ) : programs.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <GraduationCap className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No Programs Found</h3>
                  <p className="text-muted-foreground">
                    Programs will be listed here once they are added.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {programs.map((program) => (
                  <Link key={program.id} to={`/college/${collegeId}/program/${program.id}`}>
                    <Card className="h-full transition-all hover:shadow-lg hover:border-accent/50 group">
                      <CardHeader>
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-colors mb-2">
                          <BookOpen className="h-6 w-6" />
                        </div>
                        <CardTitle>{program.name}</CardTitle>
                        <CardDescription>
                          {program.acronym} • {program.duration}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {program.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                            {program.description}
                          </p>
                        )}
                        <div className="text-sm font-medium text-accent">
                          View Resources →
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="about" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>About {college?.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Location</h3>
                  <p className="text-muted-foreground">{college?.address}</p>
                </div>
                {college?.established_year && (
                  <div>
                    <h3 className="font-semibold mb-2">Established</h3>
                    <p className="text-muted-foreground">{college.established_year}</p>
                  </div>
                )}
                {college?.description && (
                  <div>
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-muted-foreground">{college.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CollegeDetails;
