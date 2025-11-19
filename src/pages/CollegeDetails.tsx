import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Navigation } from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, BookOpen, GraduationCap, ExternalLink, MapPin, Calendar, Star, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

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

interface Review {
  id: string;
  rating_overall: number;
  rating_faculty: number | null;
  rating_infrastructure: number | null;
  rating_crowd: number | null;
  comment: string | null;
  created_at: string;
}

const CollegeDetails = () => {
  const { collegeId } = useParams();
  const [college, setCollege] = useState<College | null>(null);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating_overall: 3,
    rating_faculty: 3,
    rating_infrastructure: 3,
    rating_crowd: 3,
    comment: ""
  });
  const { toast } = useToast();

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

      // Fetch reviews for this college
      const { data: reviewsData, error: reviewsError } = await supabase
        .from("reviews")
        .select("*")
        .eq("college_id", collegeId)
        .order("created_at", { ascending: false });

      if (reviewsError) throw reviewsError;
      setReviews(reviewsData || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!collegeId) return;

    try {
      const { error } = await supabase.from("reviews").insert({
        college_id: collegeId,
        rating_overall: reviewForm.rating_overall,
        rating_faculty: reviewForm.rating_faculty,
        rating_infrastructure: reviewForm.rating_infrastructure,
        rating_crowd: reviewForm.rating_crowd,
        comment: reviewForm.comment.trim() || null,
      });

      if (error) throw error;

      toast({
        title: "Review submitted!",
        description: "Thank you for sharing your experience.",
      });

      setIsReviewDialogOpen(false);
      setReviewForm({
        rating_overall: 3,
        rating_faculty: 3,
        rating_infrastructure: 3,
        rating_crowd: 3,
        comment: ""
      });
      fetchData(); // Refresh reviews
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    }
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating_overall, 0);
    return (sum / reviews.length).toFixed(1);
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
            <TabsTrigger value="verdict">Student Verdict</TabsTrigger>
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

          <TabsContent value="verdict" className="mt-6">
            <div className="space-y-6">
              {/* Average Rating Summary */}
              <Card className="backdrop-blur-md bg-white/5 border-white/10">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-accent fill-accent" />
                        Student Verdict
                      </CardTitle>
                      <CardDescription>
                        {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
                      </CardDescription>
                    </div>
                    <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="gap-2">
                          <MessageSquare className="h-4 w-4" />
                          Write a Review
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="backdrop-blur-md bg-background/95 border-white/10">
                        <DialogHeader>
                          <DialogTitle>Share Your Experience</DialogTitle>
                          <DialogDescription>
                            Help future students by sharing your honest review
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-6 py-4">
                          <div className="space-y-2">
                            <Label>Overall Rating: {reviewForm.rating_overall}/5</Label>
                            <Slider
                              value={[reviewForm.rating_overall]}
                              onValueChange={([value]) => setReviewForm({ ...reviewForm, rating_overall: value })}
                              min={1}
                              max={5}
                              step={1}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Faculty Quality: {reviewForm.rating_faculty}/5</Label>
                            <Slider
                              value={[reviewForm.rating_faculty]}
                              onValueChange={([value]) => setReviewForm({ ...reviewForm, rating_faculty: value })}
                              min={1}
                              max={5}
                              step={1}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Infrastructure: {reviewForm.rating_infrastructure}/5</Label>
                            <Slider
                              value={[reviewForm.rating_infrastructure]}
                              onValueChange={([value]) => setReviewForm({ ...reviewForm, rating_infrastructure: value })}
                              min={1}
                              max={5}
                              step={1}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Student Crowd: {reviewForm.rating_crowd}/5</Label>
                            <Slider
                              value={[reviewForm.rating_crowd]}
                              onValueChange={([value]) => setReviewForm({ ...reviewForm, rating_crowd: value })}
                              min={1}
                              max={5}
                              step={1}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Your Review (Optional)</Label>
                            <Textarea
                              value={reviewForm.comment}
                              onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                              placeholder="Share your thoughts about the college..."
                              rows={4}
                              className="backdrop-blur-md bg-white/5 border-white/10"
                            />
                          </div>
                          <Button onClick={handleSubmitReview} className="w-full">
                            Submit Review
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                {reviews.length > 0 && (
                  <CardContent>
                    <div className="flex items-center gap-3">
                      <div className="text-5xl font-bold text-accent">{calculateAverageRating()}</div>
                      <div className="flex flex-col">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-5 w-5 ${
                                star <= Math.round(Number(calculateAverageRating()))
                                  ? "text-accent fill-accent"
                                  : "text-muted-foreground"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Based on {reviews.length} student {reviews.length === 1 ? "review" : "reviews"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>

              {/* Reviews List */}
              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <Card className="backdrop-blur-md bg-white/5 border-white/10 text-center py-12">
                    <CardContent>
                      <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-semibold mb-2">No Reviews Yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Be the first to share your experience at this college!
                      </p>
                      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
                        <DialogTrigger asChild>
                          <Button>Write the First Review</Button>
                        </DialogTrigger>
                      </Dialog>
                    </CardContent>
                  </Card>
                ) : (
                  reviews.map((review) => (
                    <Card key={review.id} className="backdrop-blur-md bg-white/5 border-white/10 hover:border-accent/50 transition-all">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-4 w-4 ${
                                    star <= review.rating_overall
                                      ? "text-accent fill-accent"
                                      : "text-muted-foreground"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="font-semibold">{review.rating_overall}.0</span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {new Date(review.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </CardHeader>
                      {(review.rating_faculty || review.rating_infrastructure || review.rating_crowd || review.comment) && (
                        <CardContent className="space-y-3">
                          {review.comment && (
                            <p className="text-muted-foreground">{review.comment}</p>
                          )}
                          <div className="grid grid-cols-3 gap-4 pt-3 border-t border-white/10">
                            {review.rating_faculty && (
                              <div>
                                <p className="text-xs text-muted-foreground">Faculty</p>
                                <p className="font-semibold">{review.rating_faculty}/5</p>
                              </div>
                            )}
                            {review.rating_infrastructure && (
                              <div>
                                <p className="text-xs text-muted-foreground">Infrastructure</p>
                                <p className="font-semibold">{review.rating_infrastructure}/5</p>
                              </div>
                            )}
                            {review.rating_crowd && (
                              <div>
                                <p className="text-xs text-muted-foreground">Crowd</p>
                                <p className="font-semibold">{review.rating_crowd}/5</p>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  ))
                )}
              </div>
            </div>
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
