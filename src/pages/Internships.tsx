import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { Briefcase, MapPin, Calendar, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface Internship {
  id: string;
  company_name: string;
  role_title: string;
  location: string;
  description: string;
  stipend: string | null;
  duration: string | null;
  deadline: string | null;
  program_filter: string[] | null;
}

const Internships = () => {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInternships();
  }, []);

  const fetchInternships = async () => {
    try {
      const { data, error } = await supabase
        .from("internship_postings")
        .select("*")
        .eq("is_active", true)
        .order("posted_date", { ascending: false });

      if (error) throw error;
      setInternships(data || []);
    } catch (error) {
      console.error("Error fetching internships:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Internship Opportunities</h1>
          <p className="text-lg text-muted-foreground">
            Find and apply for internships from top companies
          </p>
        </div>

        {loading ? (
          <div className="space-y-6">
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
        ) : internships.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Briefcase className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Internships Available</h3>
              <p className="text-muted-foreground">
                Check back soon for new opportunities!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {internships.map((internship) => (
              <Card key={internship.id} className="transition-all hover:shadow-lg hover:border-primary/50">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <CardTitle className="text-2xl">{internship.role_title}</CardTitle>
                      <CardDescription className="text-base font-medium text-foreground">
                        {internship.company_name}
                      </CardDescription>
                      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {internship.location}
                        </span>
                        {internship.duration && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {internship.duration}
                          </span>
                        )}
                        {internship.stipend && (
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            {internship.stipend}
                          </span>
                        )}
                      </div>
                    </div>
                    <Button className="bg-gradient-to-r from-accent to-accent/80">
                      Apply Now
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{internship.description}</p>
                  
                  {internship.program_filter && internship.program_filter.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {internship.program_filter.map((program) => (
                        <Badge key={program} variant="secondary">
                          {program}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {internship.deadline && (
                    <p className="text-sm text-muted-foreground">
                      Apply before: <span className="font-medium text-foreground">{formatDate(internship.deadline)}</span>
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Internships;
