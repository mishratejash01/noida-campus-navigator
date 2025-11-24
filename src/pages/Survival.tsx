import { MessDashboard } from "@/components/mess/MessDashboard";
import { BunkOMeter } from "@/components/BunkOMeter";

export default function Survival() {
  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8 pb-24">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-4xl font-black text-slate-800 tracking-tight">
          Survival Kit 🎒
        </h1>
        <p className="text-slate-500 text-lg">
          Essential tools to survive another day on campus.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Left Column: Mess Wars */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-700">Mess Verdict 🍛</h2>
          <MessDashboard />
        </section>

        {/* Right Column: Bunk-O-Meter */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-700">Bunk Calculator 📉</h2>
          <BunkOMeter />
          
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mt-4">
             <h3 className="font-bold text-blue-800 mb-2">Ride Buddy 🛵</h3>
             <p className="text-sm text-blue-600">Coming soon! Find someone to split that auto-rickshaw fare with.</p>
          </div>
        </section>
      </div>
    </div>
  );
}
