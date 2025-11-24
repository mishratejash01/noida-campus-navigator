import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Hash, Users, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Community {
  id: string;
  name: string;
}

interface SidebarProps {
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

export function CommunitySidebar({ selectedId, onSelect }: SidebarProps) {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommunities = async () => {
      const { data } = await supabase.from("communities").select("id, name").order("name");
      if (data) setCommunities(data);
      setLoading(false);
    };
    fetchCommunities();
  }, []);

  if (loading) return <div className="p-4"><Loader2 className="animate-spin h-5 w-5 text-slate-400" /></div>;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden sticky top-20">
      <div className="p-4 border-b bg-slate-50/50">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <Users className="h-4 w-4" /> Communities
        </h3>
      </div>
      <div className="p-2 space-y-1">
        <Button
          variant="ghost"
          className={cn("w-full justify-start font-medium", !selectedId && "bg-indigo-50 text-indigo-700")}
          onClick={() => onSelect(null)}
        >
          <Hash className="mr-2 h-4 w-4" /> All Feeds
        </Button>
        
        {communities.map((c) => (
          <Button
            key={c.id}
            variant="ghost"
            className={cn("w-full justify-start text-slate-600", selectedId === c.id && "bg-indigo-50 text-indigo-700 font-medium")}
            onClick={() => onSelect(c.id)}
          >
            <span className="mr-2 text-slate-400">#</span> {c.name}
          </Button>
        ))}
      </div>
    </div>
  );
}
