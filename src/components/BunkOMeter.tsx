import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Calculator } from "lucide-react";

export const BunkOMeter = () => {
  const [total, setTotal] = useState(0);
  const [attended, setAttended] = useState(0);
  const [percentage, setPercentage] = useState(100);
  const [verdict, setVerdict] = useState("");
  const [color, setColor] = useState("bg-green-500");

  useEffect(() => {
    // Load from local storage
    const savedTotal = localStorage.getItem("bunk_total");
    const savedAttended = localStorage.getItem("bunk_attended");
    if (savedTotal) setTotal(Number(savedTotal));
    if (savedAttended) setAttended(Number(savedAttended));
  }, []);

  useEffect(() => {
    // Save and Calculate
    localStorage.setItem("bunk_total", total.toString());
    localStorage.setItem("bunk_attended", attended.toString());

    if (total === 0) return;

    const currentPct = (attended / total) * 100;
    setPercentage(currentPct);

    // Bunk Logic (Target: 75%)
    if (currentPct < 75) {
      const needed = Math.ceil((0.75 * total - attended) / 0.25);
      setVerdict(`🚨 You need to attend ${needed} more classes to hit 75%.`);
      setColor("bg-red-500");
    } else {
      const skippable = Math.floor((attended - 0.75 * total) / 0.75);
      setVerdict(`🎉 You can safely bunk ${skippable} more classes.`);
      setColor("bg-green-500");
    }
  }, [total, attended]);

  return (
    <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-100">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-indigo-900">
          <Calculator className="h-5 w-5" /> Bunk-O-Meter
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Total Classes</Label>
            <Input 
              type="number" 
              value={total} 
              onChange={(e) => setTotal(Number(e.target.value))}
              className="bg-white"
            />
          </div>
          <div className="space-y-2">
            <Label>Classes Attended</Label>
            <Input 
              type="number" 
              value={attended} 
              onChange={(e) => setAttended(Number(e.target.value))} 
              className="bg-white"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm font-medium">
            <span>Attendance: {percentage.toFixed(1)}%</span>
            <span>Target: 75%</span>
          </div>
          <Progress value={percentage} className="h-3" indicatorClassName={color} />
        </div>

        <div className={`p-3 rounded-lg text-sm font-bold text-center ${currentPct => 75 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {verdict || "Enter your stats to calculate."}
        </div>
      </CardContent>
    </Card>
  );
};
