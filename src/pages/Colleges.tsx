import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Building2, ExternalLink, MapPin } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface University {
  id: string;
  name: string;
  acronym: string;
  description: string | null;
  website_url: string | null;
}

const Colleges = () => {
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUniversities();
  }, []);

  const fetchUniversities = async () => {
    try {
      const { data, error } = await supabase
        .from("universities")
        .select("*")
        .order("name");

      if (error) throw error;
      setUniversities(data || []);
    } catch (error) {
      console.error("Error fetching universities:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation removed from here because it's in App.tsx now */}
      
      <div className="container py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">College Directory</h1>
          <p className="text-lg text-muted-foreground">
            Explore colleges by their affiliated universities in Noida
          </p>
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
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
        ) : universities.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Universities Found</h3>
              <p className="text-muted-foreground">
                Universities will appear here once they are added to the system.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {universities.map((university) => (
              <Link key={university.id} to={`/colleges/${university.id}`}>
                <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50 group">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <Building2 className="h-6 w-6" />
                      </div>
                      {university.website_url && (
                        <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      )}
                    </div>
                    <CardTitle className="mt-4">{university.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {university.acronym}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {university.description && (
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {university.description}
                      </p>
                    )}
                    <div className="mt-4 text-sm font-medium text-primary">
                      View Affiliated Colleges →
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

export default Colleges;
