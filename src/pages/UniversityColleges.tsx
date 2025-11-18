import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Navigation } from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { Building2, ArrowLeft, MapPin, Calendar, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface College {
  id: string;
  name: string;
  address: string;
  description: string | null;
  website_url: string | null;
  established_year: number | null;
}

interface University {
  name: string;
  acronym: string;
}

const UniversityColleges = () => {
  const { universityId } = useParams();
  const [colleges, setColleges] = useState<College[]>([]);
  const [university, setUniversity] = useState<University | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [universityId]);

  const fetchData = async () => {
    try {
      // Fetch university details
      const { data: uniData, error: uniError } = await supabase
        .from("universities")
        .select("name, acronym")
        .eq("id", universityId)
        .single();

      if (uniError) throw uniError;
      setUniversity(uniData);

      // Fetch colleges
      const { data: collegesData, error: collegesError } = await supabase
        .from("colleges")
        .select("*")
        .eq("affiliated_university_id", universityId)
        .order("name");

      if (collegesError) throw collegesError;
      setColleges(collegesData || []);
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
        <Link to="/colleges">
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Universities
          </Button>
        </Link>

        {loading ? (
          <>
            <Skeleton className="h-12 w-2/3 mb-4" />
            <Skeleton className="h-6 w-1/3 mb-8" />
          </>
        ) : (
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">{university?.name}</h1>
            <p className="text-lg text-muted-foreground">
              Colleges affiliated with {university?.acronym} in Noida
            </p>
          </div>
        )}

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2">
            {[1, 2].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : colleges.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Colleges Found</h3>
              <p className="text-muted-foreground">
                No colleges are currently listed under {university?.acronym}.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {colleges.map((college) => (
              <Link key={college.id} to={`/college/${college.id}`}>
                <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50 group">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <Building2 className="h-6 w-6" />
                      </div>
                      {college.website_url && (
                        <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      )}
                    </div>
                    <CardTitle className="mt-4">{college.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2 flex-wrap">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {college.address}
                      </span>
                      {college.established_year && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Est. {college.established_year}
                        </span>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {college.description && (
                      <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                        {college.description}
                      </p>
                    )}
                    <div className="text-sm font-medium text-primary">
                      View Programs & Resources →
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UniversityColleges;
