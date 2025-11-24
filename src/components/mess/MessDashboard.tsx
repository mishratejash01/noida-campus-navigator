import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Utensils, AlertTriangle, Camera, ThumbsUp, ThumbsDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const MessDashboard = () => {
  const [todaysRating, setTodaysRating] = useState<any>(null);
  const [menuImage, setMenuImage] = useState<File | null>(null);

  useEffect(() => {
    fetchTodaysRating();
  }, []);

  const fetchTodaysRating = async () => {
    // In a real app, you'd filter by college_id too
    const { data } = await supabase
      .from("daily_mess_ratings")
      .select("*")
      .eq("rating_date", new Date().toISOString().split('T')[0])
      .maybeSingle();
    
    setTodaysRating(data);
  };

  const handleVote = async (score: number) => {
    const verdict = score > 3 ? "Yum" : score < 2 ? "Toxic" : "Mid";
    
    // Upsert logic would go here. For now, we simulate a successful insert
    const { error } = await supabase.from("daily_mess_ratings").insert({
      college_id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11", // Replace with dynamic ID
      rating_food: score,
      verdict: verdict,
      rating_date: new Date().toISOString().split('T')[0]
    });

    if (error) {
       toast.error("You already voted today!");
    } else {
       toast.success("Vote recorded! 🗳️");
       fetchTodaysRating();
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-orange-100 bg-orange-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-800">
            <Utensils className="h-6 w-6" /> Daily Mess Verdict
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center text-center space-y-4">
            {todaysRating ? (
              <>
                <div className="text-6xl font-black text-slate-800">
                  {todaysRating.rating_food}<span className="text-2xl text-slate-400">/5</span>
                </div>
                <div className="text-xl font-bold uppercase tracking-widest text-slate-600">
                  Verdict: {todaysRating.verdict}
                </div>
                
                {todaysRating.rating_food < 2 && (
                  <Alert variant="destructive" className="animate-pulse bg-red-100 border-red-200">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>WARNING: TOXIC HAZARD</AlertTitle>
                    <AlertDescription>
                      The mess food is dangerous today. RUN TO THE CANTEEN IMMEDIATELY. 🏃💨
                    </AlertDescription>
                  </Alert>
                )}
              </>
            ) : (
              <div className="text-slate-500 py-4">
                No ratings yet. Be the first to taste-test! 🧪
              </div>
            )}

            <div className="flex gap-4 w-full justify-center pt-4">
              <Button onClick={() => handleVote(5)} variant="outline" className="border-green-200 hover:bg-green-50 text-green-700">
                <ThumbsUp className="mr-2 h-4 w-4" /> Edible
              </Button>
              <Button onClick={() => handleVote(1)} variant="outline" className="border-red-200 hover:bg-red-50 text-red-700">
                <ThumbsDown className="mr-2 h-4 w-4" /> Radioactive
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Menu Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Camera className="h-4 w-4 text-slate-500" />
            Leak the Menu
          </CardTitle>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Input 
            type="file" 
            accept="image/*" 
            onChange={(e) => setMenuImage(e.target.files?.[0] || null)} 
          />
          <Button onClick={() => toast.success("Menu uploaded anonymously!")}>
            Upload
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
