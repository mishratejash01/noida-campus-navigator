import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Medal, Crown } from "lucide-react";

export const Leaderboard = () => {
  const [colleges, setColleges] = useState<any[]>([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const { data, error } = await supabase
        .from("college_leaderboard")
        .select("*")
        .order("rank", { ascending: true })
        .limit(10);
      
      if (!error && data) setColleges(data);
    };

    fetchLeaderboard();
  }, []);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="h-6 w-6 text-yellow-500 fill-yellow-500 animate-bounce" />;
      case 2: return <Medal className="h-5 w-5 text-slate-400 fill-slate-400" />;
      case 3: return <Medal className="h-5 w-5 text-amber-700 fill-amber-700" />;
      default: return <span className="font-bold text-slate-500">#{rank}</span>;
    }
  };

  return (
    <Card className="w-full bg-gradient-to-b from-slate-50 to-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-800">
          <Trophy className="h-5 w-5 text-purple-600" />
          Campus Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {colleges.map((college) => (
            <div 
              key={college.id} 
              className={`flex items-center gap-4 p-3 rounded-lg border transition-all hover:scale-102 ${
                college.rank === 1 ? "bg-yellow-50 border-yellow-200 shadow-sm" : "bg-white hover:bg-slate-50"
              }`}
            >
              <div className="w-8 flex justify-center">
                {getRankIcon(college.rank)}
              </div>
              
              <Avatar className="h-10 w-10 border">
                <AvatarImage src={college.logo_url} />
                <AvatarFallback>{college.name.substring(0, 2)}</AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="font-semibold text-slate-800 text-sm">{college.name}</div>
                <div className="text-xs text-slate-500">Score: {college.total_score}</div>
              </div>
            </div>
          ))}
          {colleges.length === 0 && <p className="text-center text-slate-400">Loading rankings...</p>}
        </div>
      </CardContent>
    </Card>
  );
};
