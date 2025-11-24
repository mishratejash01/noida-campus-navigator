import { Leaderboard } from "@/components/gamification/Leaderboard";
import { ProfCardGenerator } from "@/components/gamification/ProfCardGenerator";
import { ExamWarRoomCard } from "@/components/gamification/ExamWarRoomCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function FunZone() {
  return (
    <div className="container mx-auto p-4 md:p-8 pb-24">
      <h1 className="text-4xl font-black text-slate-800 mb-6">Campus Playground 🎮</h1>
      
      <Tabs defaultValue="leaderboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 max-w-[600px]">
          <TabsTrigger value="leaderboard">🏆 Leaderboard</TabsTrigger>
          <TabsTrigger value="war-rooms">⚔️ War Rooms</TabsTrigger>
          <TabsTrigger value="cards">🃏 Card Maker</TabsTrigger>
        </TabsList>

        <TabsContent value="leaderboard" className="space-y-4">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold mb-4">College Rankings</h2>
            <Leaderboard />
          </div>
        </TabsContent>

        <TabsContent value="war-rooms" className="space-y-6">
          <h2 className="text-2xl font-bold">Exam War Rooms</h2>
          <p className="text-slate-500 mb-4">Chat unlocks 24h before the exam. Prepare for battle.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Mock Data for Demo - In real app, fetch from DB */}
            <ExamWarRoomCard subjectName="Engineering Math II" examDate={new Date(Date.now() + 86400000 * 2).toISOString()} />
            <ExamWarRoomCard subjectName="Data Structures" examDate={new Date(Date.now() + 3600000).toISOString()} />
            <ExamWarRoomCard subjectName="Physics" examDate={new Date(Date.now() - 86400000).toISOString()} />
          </div>
        </TabsContent>

        <TabsContent value="cards">
          <h2 className="text-2xl font-bold mb-4">Faculty Card Generator</h2>
          <ProfCardGenerator />
        </TabsContent>
      </Tabs>
    </div>
  );
}
