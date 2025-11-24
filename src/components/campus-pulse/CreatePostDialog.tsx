import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Loader2 } from "lucide-react";
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

  // Load communities on mount
  useEffect(() => {
    const fetchCommunities = async () => {
      const { data } = await supabase.from("communities").select("id, name").order("name");
      if (data) {
        setCommunities(data);
        // Optional: Select the first community by default
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
      // Reset form
      setTitle("");
      setContent("");
      onPostCreated();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full justify-start text-muted-foreground bg-white border hover:bg-slate-50 shadow-sm" variant="outline">
          <Plus className="mr-2 h-4 w-4" /> Create a post...
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Create Post</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input 
            placeholder="Title" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="font-semibold text-lg"
          />
          <Textarea 
            placeholder="What's on your mind?" 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[150px]"
          />
          
          <div className="flex items-center justify-between gap-2">
            <Select value={selectedCommunityId} onValueChange={setSelectedCommunityId}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select Community" />
              </SelectTrigger>
              <SelectContent>
                {communities.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center space-x-2">
              <Switch id="anonymous" checked={isAnonymous} onCheckedChange={setIsAnonymous} />
              <Label htmlFor="anonymous">Post Anonymously</Label>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Post
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
