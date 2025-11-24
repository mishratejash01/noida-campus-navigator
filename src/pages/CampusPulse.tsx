import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { FeedHeader } from "@/components/campus-pulse/FeedHeader";
import { PostCard } from "@/components/campus-pulse/PostCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export default function CampusPulse() {
  const [posts, setPosts] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState<"hot" | "new">("new");
  const [newPostContent, setNewPostContent] = useState("");

  // 1. Fetch Posts Logic
  const fetchPosts = async () => {
    let query = supabase.from("posts").select("*");

    if (sortBy === "new") {
      query = query.order("created_at", { ascending: false });
    } else {
      // For "Hot", we ideally use a function, but for now we sort by upvotes
      query = query.order("upvotes", { ascending: false });
    }

    const { data, error } = await query;
    if (!error && data) setPosts(data);
  };

  // 2. Real-time Subscription
  useEffect(() => {
    fetchPosts();

    const channel = supabase
      .channel("schema-db-changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "posts" },
        (payload) => {
          // Add new post to top instantly
          setPosts((current) => [payload.new, ...current]);
          toast.info("New post just dropped! 👀");
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sortBy]);

  // 3. Create Post Logic
  const handlePost = async () => {
    if (!newPostContent.trim()) return;

    const { error } = await supabase.from("posts").insert({
      content: newPostContent,
      category: "General",
      is_anonymous: true,
    });

    if (error) {
      toast.error("Failed to post");
    } else {
      setNewPostContent("");
      toast.success("Sent to the void! 🚀");
    }
  };

  return (
    <div className="container max-w-2xl mx-auto py-6 px-4 pb-24">
      <h1 className="text-3xl font-bold mb-6 text-slate-800 tracking-tight">Campus Pulse 📢</h1>
      
      {/* Input Area */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-8">
        <div className="flex gap-4">
          <Input
            placeholder="What's happening on campus?"
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            className="bg-slate-50 border-0 focus-visible:ring-1 focus-visible:ring-purple-500"
          />
          <Button onClick={handlePost} size="icon" className="bg-purple-600 hover:bg-purple-700 shrink-0">
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <FeedHeader sortBy={sortBy} setSortBy={setSortBy} />

      <div className="space-y-4">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
