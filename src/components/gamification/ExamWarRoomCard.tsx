import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Lock, Swords, Clock, Send } from "lucide-react";
import { formatDistanceToNow, subHours } from "date-fns";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface WarRoomProps {
  subjectName: string;
  examDate: string; // ISO String
}

export const ExamWarRoomCard = ({ subjectName, examDate }: WarRoomProps) => {
  const [isLocked, setIsLocked] = useState(true);
  const [messages, setMessages] = useState<{user: string, text: string}[]>([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const exam = new Date(examDate);
    const now = new Date();
    // Unlock if within 24 hours before exam
    const unlockTime = subHours(exam, 24);
    
    if (now >= unlockTime && now <= exam) {
      setIsLocked(false);
    }
  }, [examDate]);

  const sendMessage = () => {
    if(!newMessage.trim()) return;
    setMessages([...messages, { user: "Me", text: newMessage }]);
    setNewMessage("");
    // In real app: Supabase insert to 'exam_war_rooms' chat_history
  };

  return (
    <Card className={`border-2 transition-all duration-300 ${isLocked ? "bg-slate-100 opacity-80" : "border-red-500 bg-red-50/10 shadow-lg"}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <Badge variant={isLocked ? "secondary" : "destructive"} className="mb-2">
            {isLocked ? <Lock className="h-3 w-3 mr-1" /> : <Swords className="h-3 w-3 mr-1" />}
            {isLocked ? "LOCKED" : "WAR ROOM ACTIVE"}
          </Badge>
          {!isLocked && <span className="text-xs font-bold text-red-600 animate-pulse">LIVE</span>}
        </div>
        <CardTitle className="text-lg">{subjectName}</CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-center text-sm text-slate-500 gap-2">
          <Clock className="h-4 w-4" />
          Exam in {formatDistanceToNow(new Date(examDate))}
        </div>
      </CardContent>

      <CardFooter>
        {isLocked ? (
          <Button disabled className="w-full bg-slate-300 text-slate-500 cursor-not-allowed">
            Opens 24h before exam
          </Button>
        ) : (
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold tracking-wider">
                ENTER BATTLEFIELD ⚔️
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md h-[500px] flex flex-col">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-red-700">
                  <Swords className="h-5 w-5" /> {subjectName} War Room
                </DialogTitle>
              </DialogHeader>
              
              <div className="flex-1 overflow-y-auto bg-slate-50 p-4 rounded-md space-y-3 border">
                {messages.length === 0 && (
                  <div className="text-center text-slate-400 mt-20">
                    <p>No soldiers here yet.</p>
                    <p className="text-xs">Share notes or panic together.</p>
                  </div>
                )}
                {messages.map((m, i) => (
                  <div key={i} className={`flex flex-col ${m.user === "Me" ? "items-end" : "items-start"}`}>
                    <span className="text-[10px] text-slate-400">{m.user}</span>
                    <div className={`px-3 py-2 rounded-lg text-sm max-w-[80%] ${
                      m.user === "Me" ? "bg-red-600 text-white" : "bg-white border"
                    }`}>
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 mt-2">
                <Input 
                  placeholder="Type your battle cry..." 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <Button onClick={sendMessage} size="icon" className="bg-red-600">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </CardFooter>
    </Card>
  );
};
