import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Download, Wand2 } from "lucide-react";
import { toast } from "sonner";

export const ProfCardGenerator = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [name, setName] = useState("Prof. Snape");
  const [subject, setSubject] = useState("Potions");
  const [strictness, setStrictness] = useState([90]);
  const [hp, setHp] = useState([50]);
  const [move, setMove] = useState("Surprise Quiz");

  const downloadCard = async () => {
    if (cardRef.current) {
      try {
        const dataUrl = await toPng(cardRef.current, { cacheBust: true, });
        const link = document.createElement("a");
        link.download = `${name.replace(/\s/g, "_")}_Card.png`;
        link.href = dataUrl;
        link.click();
        toast.success("Card downloaded! Now go share it.");
      } catch (err) {
        toast.error("Failed to generate image.");
      }
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-8 items-start">
      {/* Editor Side */}
      <div className="space-y-6 bg-white p-6 rounded-xl border shadow-sm">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <Wand2 className="h-5 w-5 text-purple-600" /> Card Creator
        </h3>
        
        <div className="space-y-2">
          <Label>Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        
        <div className="space-y-2">
          <Label>Subject / Department</Label>
          <Input value={subject} onChange={(e) => setSubject(e.target.value)} />
        </div>

        <div className="space-y-4 pt-2">
          <div className="flex justify-between text-sm">
            <Label>Strictness Level</Label>
            <span className="font-bold text-red-500">{strictness}%</span>
          </div>
          <Slider value={strictness} onValueChange={setStrictness} max={100} step={1} className="py-2" />
        </div>

        <div className="space-y-4 pt-2">
          <div className="flex justify-between text-sm">
            <Label>HP (Patience)</Label>
            <span className="font-bold text-green-500">{hp}</span>
          </div>
          <Slider value={hp} onValueChange={setHp} max={100} step={1} className="py-2" />
        </div>

        <div className="space-y-2">
          <Label>Special Move</Label>
          <Input value={move} onChange={(e) => setMove(e.target.value)} placeholder="e.g. 'Get Out of My Class'" />
        </div>
      </div>

      {/* Preview Side */}
      <div className="flex flex-col items-center gap-4">
        <div 
          ref={cardRef} 
          className="w-[300px] h-[450px] bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border-[8px] border-amber-500 shadow-2xl relative overflow-hidden flex flex-col text-white select-none"
        >
          {/* Card Header */}
          <div className="h-16 bg-gradient-to-b from-black/50 to-transparent p-4 flex justify-between items-start z-10">
            <span className="font-bold text-amber-400 text-lg uppercase tracking-wider">Faculty</span>
            <div className="h-8 w-8 rounded-full bg-red-600 flex items-center justify-center font-bold text-xs border-2 border-white">
              {strictness}
            </div>
          </div>

          {/* Character Image Placeholder */}
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544717297-fa95b6ee9643?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>
          
          <div className="flex-1 flex flex-col justify-center items-center z-10 relative">
             <div className="w-32 h-32 bg-slate-200 rounded-full border-4 border-amber-500 shadow-lg overflow-hidden mb-4">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`} alt="avatar" className="w-full h-full object-cover" />
             </div>
             <h2 className="text-2xl font-black text-center px-4 leading-tight drop-shadow-md">{name}</h2>
             <p className="text-amber-300 font-medium tracking-widest text-xs mt-1 uppercase">{subject}</p>
          </div>

          {/* Stats Box */}
          <div className="bg-black/60 backdrop-blur-md m-4 p-4 rounded-lg border border-white/10 z-10 space-y-3">
             <div className="flex justify-between items-center">
                <span className="text-xs text-slate-300 uppercase">Health</span>
                <div className="w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
                   <div className="h-full bg-green-500" style={{ width: `${hp}%` }}></div>
                </div>
             </div>
             <div className="border-t border-white/10 my-2"></div>
             <div>
                <span className="text-[10px] text-amber-500 uppercase font-bold tracking-widest">Special Move</span>
                <p className="text-sm font-bold italic text-white">"{move}"</p>
             </div>
          </div>
        </div>

        <Button onClick={downloadCard} className="w-[300px] bg-amber-600 hover:bg-amber-700 font-bold">
          <Download className="mr-2 h-4 w-4" /> Download Card
        </Button>
      </div>
    </div>
  );
};
