import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Flame, Sparkles, Activity } from "lucide-react";
import { Card } from "@/components/ui/card";

interface FeedHeaderProps {
  sortBy: "hot" | "new";
  setSortBy: (sort: "hot" | "new") => void;
}

export const FeedHeader = ({ sortBy, setSortBy }: FeedHeaderProps) => {
  const [mood, setMood] = useState("Calculating...");

  // Simulate Mood Analysis (In a real app, you'd fetch this from an Edge Function)
  useEffect(() => {
    const moods = ["Stressed 😫", "Hyped 🎉", "Sleepy 😴", "Caffeinated ☕️", "Chaos 🤡"];
    setMood(moods[Math.floor(Math.random() * moods.length)]);
  }, []);

  return (
    <div className="space-y-4 mb-6">
      <Card className="p-4 bg-white/50 backdrop-blur-sm border-purple-100 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-purple-600" />
          <span className="font-medium text-slate-600">Campus Vibe:</span>
          <span className="font-bold text-slate-800 animate-pulse">{mood}</span>
        </div>
      </Card>

      <div className="flex gap-2">
        <Button
          variant={sortBy === "hot" ? "default" : "outline"}
          onClick={() => setSortBy("hot")}
          className={sortBy === "hot" ? "bg-orange-500 hover:bg-orange-600" : ""}
        >
          <Flame className="mr-2 h-4 w-4" /> Hot
        </Button>
        <Button
          variant={sortBy === "new" ? "default" : "outline"}
          onClick={() => setSortBy("new")}
          className={sortBy === "new" ? "bg-blue-500 hover:bg-blue-600" : ""}
        >
          <Sparkles className="mr-2 h-4 w-4" /> New
        </Button>
      </div>
    </div>
  );
};
