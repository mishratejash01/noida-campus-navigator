import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Loader2, Users, Ghost } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/use-profile";
import { toast } from "sonner";

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
      toast.success("Post created!");
      setOpen(false);
      setTitle("");
      setContent("");
      onPostCreated();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full justify-start text-slate-500 bg-slate-100 hover:bg-slate-200 border-none shadow-inner h-12 rounded-full px-6" variant="secondary">
          <Plus className="mr-2 h-5 w-5" /> Create a post...
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[600px] p-0 gap-0 overflow-hidden bg-white">
        {/* HEADER */}
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="text-xl font-bold">Create a Post</DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-6">
          
          {/* TOP ROW: Community & Privacy */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Community Selector */}
            <div className="w-full sm:w-[240px]">
              <Select value={selectedCommunityId} onValueChange={setSelectedCommunityId}>
                <SelectTrigger className="w-full bg-slate-50 border-slate-200 focus:ring-indigo-500">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Users className="h-4 w-4 text-indigo-500" />
                    <SelectValue placeholder="Select Community" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {communities.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      <span className="font-medium">c/{c.name}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Anonymous Toggle */}
            <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
              <Switch 
                id="anonymous" 
                checked={isAnonymous} 
                onCheckedChange={setIsAnonymous}
                className="data-[state=checked]:bg-indigo-600"
              />
              <Label htmlFor="anonymous" className="flex items-center gap-1.5 cursor-pointer text-sm font-medium text-slate-700">
                <Ghost className="h-3.5 w-3.5" /> 
                Post Anonymously
              </Label>
            </div>
          </div>

          {/* MAIN INPUTS */}
          <div className="space-y-4">
            <Input 
              placeholder="Title" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg font-bold border-x-0 border-t-0 border-b-2 border-slate-100 rounded-none px-0 focus-visible:ring-0 focus-visible:border-indigo-500 placeholder:text-slate-400"
            />
            
            <Textarea 
              placeholder="What's on your mind? Share links, thoughts, or questions..." 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[200px] resize-none border-none bg-slate-50/50 p-4 rounded-xl focus-visible:ring-0 text-base"
            />
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-4 border-t bg-slate-50 flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setOpen(false)} className="hover:bg-slate-200">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[100px]"
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Post"}
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
}
