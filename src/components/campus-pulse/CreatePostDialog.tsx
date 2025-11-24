import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Loader2, Users, Ghost, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/use-profile";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function CreatePostDialog({ onPostCreated }: { onPostCreated: () => void }) {
  const { profile } = useProfile();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  
  // Community Selection State
  const [communities, setCommunities] = useState<{id: string, name: string}[]>([]);
  const [selectedCommunityId, setSelectedCommunityId] = useState<string>("");

  useEffect(() => {
    const fetchCommunities = async () => {
      const { data } = await supabase.from("communities").select("id, name").order("name");
      if (data) {
        setCommunities(data);
        if(data.length > 0 && !selectedCommunityId) {
           setSelectedCommunityId(data[0].id); 
        }
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
        <div className="w-full cursor-pointer group">
          <div className="bg-white border border-slate-200 hover:border-indigo-300 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl p-4 flex items-center gap-4">
            <Avatar className="h-10 w-10 border border-slate-100">
              <AvatarImage src={profile?.avatar_url || undefined} />
              <AvatarFallback className="bg-indigo-50 text-indigo-600 font-bold">
                 {profile?.username?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 bg-slate-50 hover:bg-white border border-transparent hover:border-slate-200 rounded-full h-11 px-5 flex items-center text-slate-400 font-medium transition-all">
              Create a post...
            </div>
            <Button size="icon" className="rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 shrink-0 h-10 w-10">
              <Plus className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[650px] p-0 gap-0 overflow-hidden bg-white border-0 shadow-2xl sm:rounded-2xl">
        
        {/* HEADER: Community & User Context */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100 bg-slate-50/50">
           <div className="flex items-center gap-3">
              <Select value={selectedCommunityId} onValueChange={setSelectedCommunityId}>
                <SelectTrigger className="h-9 min-w-[160px] bg-white border-slate-200 hover:border-indigo-300 text-slate-700 font-medium rounded-full shadow-sm focus:ring-0 focus:ring-offset-0 px-4">
                   <div className="flex items-center gap-2">
                     <div className="bg-indigo-100 p-1 rounded-full">
                       <Users className="h-3 w-3 text-indigo-600" />
                     </div>
                     <SelectValue placeholder="Choose Community" />
                   </div>
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {communities.map((c) => (
                    <SelectItem key={c.id} value={c.id} className="font-medium cursor-pointer py-3">
                      <span className="text-slate-500 mr-1">c/</span>{c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
           </div>

           <Button variant="ghost" size="icon" onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-600 rounded-full">
             <X className="h-5 w-5" />
           </Button>
        </div>

        {/* MAIN EDITOR */}
        <div className="p-6 md:p-8 flex flex-col gap-4 bg-white min-h-[320px]">
          
          {/* Title Input - Huge & Bold */}
          <Input 
            placeholder="Give it a catchy title..." 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-3xl font-bold border-none shadow-none focus-visible:ring-0 px-0 placeholder:text-slate-300 h-auto leading-tight"
          />
          
          {/* Content Input - Spacious */}
          <Textarea 
            placeholder="Share your thoughts, ask a question, or tell a story..." 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-1 min-h-[200px] resize-none border-none shadow-none focus-visible:ring-0 px-0 text-lg text-slate-600 placeholder:text-slate-300 leading-relaxed -ml-1"
          />

        </div>

        {/* FOOTER: Actions */}
        <div className="p-4 px-6 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Left: Options */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
             <div 
               className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all border ${
                 isAnonymous 
                   ? "bg-slate-800 border-slate-800 text-white" 
                   : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100"
               }`}
               onClick={() => setIsAnonymous(!isAnonymous)}
             >
                <Ghost className="h-4 w-4" />
                <span className="text-sm font-medium">Anonymous</span>
                <Switch 
                  checked={isAnonymous}
                  onCheckedChange={setIsAnonymous}
                  className="ml-1 scale-75 data-[state=checked]:bg-slate-500"
                />
             </div>
          </div>

          {/* Right: Post Button */}
          <div className="flex gap-3 w-full sm:w-auto">
             <Button variant="ghost" onClick={() => setOpen(false)} className="flex-1 sm:flex-none text-slate-500 hover:bg-slate-200">
               Cancel
             </Button>
             <Button 
               onClick={handleSubmit} 
               disabled={loading || !title || !content}
               className="flex-1 sm:flex-none bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-lg shadow-indigo-200 px-8 transition-all hover:scale-105 active:scale-95"
             >
               {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Post"}
             </Button>
          </div>

        </div>

      </DialogContent>
    </Dialog>
  );
}
