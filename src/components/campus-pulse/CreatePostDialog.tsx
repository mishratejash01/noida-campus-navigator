import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Loader2, Users, Ghost, X, ChevronDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/use-profile";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function CreatePostDialog({ onPostCreated }: { onPostCreated: () => void }) {
  const { profile } = useProfile();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [communities, setCommunities] = useState<{id: string, name: string}[]>([]);
  const [selectedCommunityId, setSelectedCommunityId] = useState<string>("");

  useEffect(() => {
    const fetchCommunities = async () => {
      const { data } = await supabase.from("communities").select("id, name").order("name");
      if (data) {
        setCommunities(data);
        if(data.length > 0 && !selectedCommunityId) setSelectedCommunityId(data[0].id); 
      }
    };
    fetchCommunities();
  }, []);

  const handleSubmit = async () => {
    if (!profile) return toast.error("You must be logged in to post!");
    if (!title.trim() || !content.trim()) return toast.error("Title and content are required");
    if (!selectedCommunityId) return toast.error("Please select a community");

    setLoading(true);
    
    const { error } = await supabase.from("posts").insert({
      title,
      content,
      community_id: selectedCommunityId,
      author_id: profile.id,
      is_anonymous: isAnonymous,
    });

    setLoading(false);

    if (error) {
      console.error(error);
      toast.error("Failed to create post");
    } else {
      toast.success("Post live!");
      setOpen(false);
      setTitle("");
      setContent("");
      onPostCreated();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {/* TRIGGER BAR: Dark Glass Effect */}
        <div className="w-full cursor-pointer group">
          <div className="relative overflow-hidden bg-white/5 backdrop-blur-md border border-white/10 hover:border-primary/50 transition-all duration-300 rounded-2xl p-4 flex items-center gap-4 hover:bg-white/10 hover:shadow-lg hover:shadow-primary/10">
            <Avatar className="h-10 w-10 border border-white/10 ring-2 ring-transparent group-hover:ring-primary/50 transition-all">
              <AvatarImage src={profile?.avatar_url || undefined} />
              <AvatarFallback className="bg-primary/20 text-primary font-bold">
                 {profile?.username?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-zinc-400 font-medium group-hover:text-zinc-200 transition-colors">
              Spark a discussion...
            </div>
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-inner">
              <Plus className="h-5 w-5" />
            </div>
          </div>
        </div>
      </DialogTrigger>
      
      {/* DIALOG CONTENT: Deep Dark Theme */}
      <DialogContent className="sm:max-w-[650px] p-0 gap-0 overflow-hidden bg-[#0A0A0B] border border-white/10 shadow-2xl shadow-black/80 sm:rounded-2xl">
        
        {/* HEADER */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-white/5 bg-black/20">
           <div className="flex items-center gap-3">
              <Select value={selectedCommunityId} onValueChange={setSelectedCommunityId}>
                <SelectTrigger className="h-9 min-w-[160px] bg-white/5 border-white/10 hover:bg-white/10 hover:border-primary/50 text-zinc-200 font-medium rounded-full shadow-none focus:ring-0 focus:ring-offset-0 px-4 transition-all">
                   <div className="flex items-center gap-2">
                     <Users className="h-3.5 w-3.5 text-primary" />
                     <SelectValue placeholder="Community" />
                   </div>
                </SelectTrigger>
                <SelectContent className="bg-[#121214] border-white/10 text-zinc-200">
                  {communities.map((c) => (
                    <SelectItem key={c.id} value={c.id} className="focus:bg-primary/20 focus:text-white cursor-pointer py-2.5">
                      <span className="text-zinc-500 mr-1.5">c/</span>{c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
           </div>

           <Button variant="ghost" size="icon" onClick={() => setOpen(false)} className="text-zinc-500 hover:text-white hover:bg-white/10 rounded-full h-8 w-8">
             <X className="h-4 w-4" />
           </Button>
        </div>

        {/* EDITOR AREA */}
        <div className="p-6 md:p-8 flex flex-col gap-5 bg-[#0A0A0B]">
          
          <Input 
            placeholder="An interesting title..." 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-2xl md:text-3xl font-bold bg-transparent border-none shadow-none focus-visible:ring-0 px-0 placeholder:text-zinc-600 text-white h-auto leading-tight tracking-tight"
          />
          
          <Textarea 
            placeholder="Share your thoughts, ask for advice, or tell a story..." 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-1 min-h-[200px] resize-none bg-transparent border-none shadow-none focus-visible:ring-0 px-0 text-lg text-zinc-300 placeholder:text-zinc-700 leading-relaxed -ml-1"
          />

        </div>

        {/* FOOTER */}
        <div className="p-4 px-6 bg-black/40 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-sm">
          
          {/* ANONYMOUS TOGGLE */}
          <div 
             className={`flex items-center gap-3 px-4 py-2 rounded-full cursor-pointer transition-all border ${
               isAnonymous 
                 ? "bg-primary/20 border-primary/50 text-primary" 
                 : "bg-white/5 border-white/5 text-zinc-400 hover:bg-white/10"
             }`}
             onClick={() => setIsAnonymous(!isAnonymous)}
           >
              <Ghost className="h-4 w-4" />
              <span className="text-sm font-medium">Anonymous</span>
              <Switch 
                checked={isAnonymous}
                onCheckedChange={setIsAnonymous}
                className="ml-1 scale-75 data-[state=checked]:bg-primary data-[state=unchecked]:bg-zinc-700"
              />
           </div>

          {/* ACTIONS */}
          <div className="flex gap-3 w-full sm:w-auto">
             <Button variant="ghost" onClick={() => setOpen(false)} className="flex-1 sm:flex-none text-zinc-400 hover:text-white hover:bg-white/10">
               Cancel
             </Button>
             <Button 
               onClick={handleSubmit} 
               disabled={loading || !title || !content}
               className="flex-1 sm:flex-none bg-primary hover:bg-primary/90 text-white font-semibold shadow-[0_0_15px_rgba(124,58,237,0.3)] px-8 rounded-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
             >
               {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Post"}
             </Button>
          </div>

        </div>

      </DialogContent>
    </Dialog>
  );
}
