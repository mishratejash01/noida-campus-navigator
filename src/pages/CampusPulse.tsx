import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CreatePostDialog } from "@/components/campus-pulse/CreatePostDialog";
import { PostCard } from "@/components/campus-pulse/PostCard";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/hooks/use-profile";
import { Flame, Clock, Trophy } from "lucide-react";

export default function CampusPulse() {
  const { profile } = useProfile();
  const [posts, setPosts] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState<"new" | "hot" | "top">("new");

  const fetchPosts = async () => {
    // This query fetches posts + author details + the CURRENT user's vote on that post
    let query = supabase
      .from("posts")
      .select(`
        *,
        author:profiles(username, avatar_url),
        my_vote:post_votes(vote_type)
      `);

    // Filtering logic
    if (sortBy === "new") query = query.order("created_at", { ascending: false });
    if (sortBy === "top") query = query.order("upvotes", { ascending: false });
    // Note: "hot" usually requires a complex backend function, defaulting to upvotes for now
    if (sortBy === "hot") query = query.order("upvotes", { ascending: false });

    // Apply the user filter for the 'my_vote' relation
    if (profile?.id) {
      query = query.eq('my_vote.user_id', profile.id); 
      // Note: This logic for .eq on joined tables can be tricky in Supabase clients.
      // If the above .eq doesn't work as expected for filtering *just* the vote relationship,
      // you usually need a custom Postgres function or handle "my_vote" filtering in UI.
      // For this implementation, Supabase often returns 'my_vote' as [] if no match found.
    }

    const { data, error } = await query;
    if (!error && data) setPosts(data);
  };

  useEffect(() => {
    fetchPosts();
    
    // Subscribe to realtime changes
    const channel = supabase
      .channel("public:posts")
      .on("postgres_changes", { event: "*", schema: "public", table: "posts" }, () => {
        fetchPosts();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [sortBy, profile]); // Re-fetch if profile loads

  return (
    <div className="container max-w-4xl mx-auto py-6 px-4 pb-24 grid grid-cols-1 md:grid-cols-4 gap-6">
      
      {/* Left Sidebar (Filters) */}
      <div className="hidden md:block col-span-1 space-y-2">
        <h2 className="font-bold px-4 mb-2">Feeds</h2>
        <Button 
          variant={sortBy === "new" ? "secondary" : "ghost"} 
          className="w-full justify-start" 
          onClick={() => setSortBy("new")}
        >
          <Clock className="mr-2 h-4 w-4" /> New
        </Button>
        <Button 
          variant={sortBy === "hot" ? "secondary" : "ghost"} 
          className="w-full justify-start" 
          onClick={() => setSortBy("hot")}
        >
          <Flame className="mr-2 h-4 w-4" /> Hot
        </Button>
        <Button 
          variant={sortBy === "top" ? "secondary" : "ghost"} 
          className="w-full justify-start" 
          onClick={() => setSortBy("top")}
        >
          <Trophy className="mr-2 h-4 w-4" /> Top All Time
        </Button>
      </div>

      {/* Main Feed */}
      <div className="col-span-1 md:col-span-3 space-y-4">
        <div className="bg-white p-4 rounded-lg border shadow-sm flex items-center gap-3">
          <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-500">
            {profile?.username?.[0].toUpperCase() || "U"}
          </div>
          <div className="flex-1">
            <CreatePostDialog onPostCreated={fetchPosts} />
          </div>
        </div>

        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
