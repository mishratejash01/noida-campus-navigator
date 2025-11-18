import { Navigation } from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, FileText, FileQuestion, BookMarked, Info } from "lucide-react";

const Resources = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Academic Resources</h1>
          <p className="text-lg text-muted-foreground">
            Access study materials, notes, PYQs, and syllabus for your courses
          </p>
        </div>

        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <Info className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-semibold mb-1">How to Access Resources</h3>
                <p className="text-sm text-muted-foreground">
                  To access academic resources for a specific program:
                </p>
                <ol className="mt-2 space-y-1 text-sm text-muted-foreground list-decimal list-inside">
                  <li>Navigate to <span className="font-medium text-foreground">Colleges</span></li>
                  <li>Select your affiliated university</li>
                  <li>Choose your college</li>
                  <li>Click on your program (e.g., B.Tech, MBA)</li>
                  <li>Browse available resources by subject</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="font-semibold mb-2">Study Notes</h3>
              <p className="text-sm text-muted-foreground">
                Comprehensive notes for all subjects organized by semester
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent mb-4">
                <FileQuestion className="h-6 w-6" />
              </div>
              <h3 className="font-semibold mb-2">Previous Year Questions</h3>
              <p className="text-sm text-muted-foreground">
                PYQs to help you prepare for exams effectively
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="font-semibold mb-2">Syllabus</h3>
              <p className="text-sm text-muted-foreground">
                Official syllabus documents for all programs
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent mb-4">
                <BookMarked className="h-6 w-6" />
              </div>
              <h3 className="font-semibold mb-2">Additional Materials</h3>
              <p className="text-sm text-muted-foreground">
                Lab manuals, tutorials, and supplementary resources
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Resources;
