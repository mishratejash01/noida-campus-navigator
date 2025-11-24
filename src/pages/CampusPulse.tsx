import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CreatePostDialog } from "@/components/campus-pulse/CreatePostDialog";
import { PostCard } from "@/components/campus-pulse/PostCard";
import { SearchBar } from "@/components/campus-pulse/SearchBar";
import { CommunitySidebar } from "@/components/campus-pulse/CommunitySidebar"; // Import new sidebar
import { Button } from "@/components/ui/button";
import { useProfile } from "@/hooks/use-profile";
import { Flame, Clock, Trophy, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function CampusPulse() {
  const { profile } = useProfile();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // FILTERS
  const [sortBy, setSortBy] = useState<"new" | "hot" | "top">("new");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCommunity, setSelectedCommunity] = useState<string | null>(null);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("posts")
        .select(`
          *,
          author:profiles(username, avatar_url),
          community:communities(name),
          my_vote:post_votes(vote_type)
        `);

      // 1. Filter by Community
      if (selectedCommunity) {
        query = query.eq("community_id", selectedCommunity);
      }

      // 2. Filter by Search (Simple text match)
      if (searchQuery.trim()) {
        query = query.ilike("title", `%${searchQuery}%`);
      }

      // 3. Sorting
      if (sortBy === "new") query = query.order("created_at", { ascending: false });
      if (sortBy === "top" || sortBy === "hot") query = query.order("upvotes", { ascending: false });

      // 4. User Vote check
      if (profile?.id) {
        // query = query.eq('my_vote.user_id', profile.id); // Keeping this simplified based on prev debugging
      }

      const { data, error } = await query;
      if (error) throw error;
      setPosts(data || []);
    } catch (error: any) {
      console.error("Error fetching posts:", error);
      toast.error("Failed to load feed");
    } finally {
      setLoading(false);
    }
  };

  // Debounce search to avoid too many requests
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPosts();
    }, 500); // Wait 500ms after typing stops
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCommunity, sortBy, profile]);

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="container max-w-6xl mx-auto py-6 px-4">
        
        {/* TOP: Search Bar */}
        <SearchBar value={searchQuery} onChange={setSearchQuery} />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          {/* LEFT: Communities Sidebar */}
          <div className="hidden md:block col-span-1 space-y-4">
            <CommunitySidebar selectedId={selectedCommunity} onSelect={setSelectedCommunity} />
            
            {/* Sort Filters (Moved here for better layout) */}
            <div className="bg-white rounded-xl border border-slate-200 p-2 space-y-1">
              <Button variant={sortBy === "new" ? "secondary" : "ghost"} className="w-full justify-start" onClick={() => setSortBy("new")}>
                <Clock className="mr-2 h-4 w-4" /> Newest
              </Button>
              <Button variant={sortBy === "hot" ? "secondary" : "ghost"} className="w-full justify-start" onClick={() => setSortBy("hot")}>
                <Flame className="mr-2 h-4 w-4" /> Hot
              </Button>
              <Button variant={sortBy === "top" ? "secondary" : "ghost"} className="w-full justify-start" onClick={() => setSortBy("top")}>
                <Trophy className="mr-2 h-4 w-4" /> Top All Time
              </Button>
            </div>
          </div>

          {/* RIGHT: Main Feed */}
          <div className="col-span-1 md:col-span-3 space-y-4">
            {/* Create Post Widget */}
            <div className="bg-white p-4 rounded-xl border shadow-sm flex items-center gap-3">
              <div className="h-10 w-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold">
                {profile?.username?.[0]?.toUpperCase() || "U"}
              </div>
              <div className="flex-1">
                <CreatePostDialog onPostCreated={fetchPosts} />
              </div>
            </div>

            {/* Content */}
            {loading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-10 text-slate-500">
                <p>No posts found matching your search.</p>
              </div>
            ) : (
              posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
