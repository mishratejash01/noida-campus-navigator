// ... imports
// Add this import:
import { useEffect } from "react";

export function CreatePostDialog({ onPostCreated }: { onPostCreated: () => void }) {
  // ... existing hooks
  
  // NEW STATE for loading communities
  const [communities, setCommunities] = useState<{id: string, name: string}[]>([]);
  const [selectedCommunityId, setSelectedCommunityId] = useState<string>("");

  // Load communities on mount
  useEffect(() => {
    supabase.from("communities").select("id, name").then(({ data }) => {
      if (data) {
        setCommunities(data);
        if(data.length > 0) setSelectedCommunityId(data[0].id); // Default to first
      }
    });
  }, []);

  const handleSubmit = async () => {
    if (!profile) return toast.error("You must be logged in to post!");
    if (!title.trim() || !content.trim()) return toast.error("Title and content are required");

    setLoading(true);
    
    // UPDATED INSERT QUERY
    const { error } = await supabase.from("posts").insert({
      title,
      content,
      community_id: selectedCommunityId, // Use ID instead of text category
      author_id: profile.id,
      is_anonymous: isAnonymous,
    });

    setLoading(false);
    // ... rest of error handling
  };

  return (
    // ... Dialog wrappers
        <div className="grid gap-4 py-4">
          {/* ... Title/Textarea ... */}
          
          <div className="flex items-center justify-between gap-4">
            {/* UPDATED SELECTOR */}
            <Select value={selectedCommunityId} onValueChange={setSelectedCommunityId}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Community" />
              </SelectTrigger>
              <SelectContent>
                {communities.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* ... Anonymous Switch ... */}
          </div>
        </div>
    // ...
  );
}
