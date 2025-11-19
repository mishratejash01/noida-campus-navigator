import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { Heart, Share2, MessageCircle, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "motion/react";

interface Post {
  id: string;
  content: string;
  category: string;
  upvotes: number;
  created_at: string;
  is_anonymous: boolean;
}

const CampusPulse = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostCategory, setNewPostCategory] = useState("Confession");
  const [isPosting, setIsPosting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) {
      toast({
        title: "Empty post",
        description: "Please write something before posting.",
        variant: "destructive",
      });
      return;
    }

    setIsPosting(true);
    try {
      const { error } = await supabase.from("posts").insert({
        content: newPostContent.trim(),
        category: newPostCategory,
        is_anonymous: true,
      });

      if (error) throw error;

      toast({
        title: "Posted!",
        description: "Your post has been shared with the community.",
      });

      setNewPostContent("");
      setNewPostCategory("Confession");
      fetchPosts();
    } catch (error) {
      console.error("Error creating post:", error);
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPosting(false);
    }
  };

  const handleUpvote = async (postId: string, currentUpvotes: number) => {
    try {
      const { error } = await supabase
        .from("posts")
        .update({ upvotes: currentUpvotes + 1 })
        .eq("id", postId);

      if (error) throw error;

      setPosts(posts.map(post =>
        post.id === postId ? { ...post, upvotes: post.upvotes + 1 } : post
      ));
    } catch (error) {
      console.error("Error upvoting post:", error);
    }
  };

  const handleShare = async (post: Post) => {
    try {
      await navigator.clipboard.writeText(post.content);
      toast({
        title: "Copied!",
        description: "Post content copied to clipboard.",
      });
    } catch (error) {
      console.error("Error sharing post:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container py-12 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Campus Pulse</h1>
            <p className="text-muted-foreground">Anonymous confessions, questions, and campus happenings</p>
          </div>

          {/* Create Post Card */}
          <Card className="mb-8 backdrop-blur-md bg-white/5 border-white/10">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-purple-700 flex items-center justify-center">
                    <MessageCircle className="h-5 w-5 text-white" />
                  </div>
                  <p className="text-lg font-medium">What's happening on campus?</p>
                </div>
                <Textarea
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="Share your thoughts anonymously..."
                  rows={4}
                  className="backdrop-blur-md bg-white/5 border-white/10 resize-none"
                />
                <div className="flex items-center justify-between">
                  <Select value={newPostCategory} onValueChange={setNewPostCategory}>
                    <SelectTrigger className="w-[180px] backdrop-blur-md bg-white/5 border-white/10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Confession">Confession</SelectItem>
                      <SelectItem value="Question">Question</SelectItem>
                      <SelectItem value="Event">Event</SelectItem>
                      <SelectItem value="Rant">Rant</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={handleCreatePost} disabled={isPosting} className="gap-2">
                    <Plus className="h-4 w-4" />
                    {isPosting ? "Posting..." : "Post Anonymously"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Posts Feed */}
          <div className="space-y-6">
            {loading ? (
              <>
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="backdrop-blur-md bg-white/5 border-white/10">
                    <CardContent className="pt-6">
                      <Skeleton className="h-4 w-24 mb-4" />
                      <Skeleton className="h-20 w-full mb-4" />
                      <div className="flex gap-4">
                        <Skeleton className="h-8 w-20" />
                        <Skeleton className="h-8 w-20" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </>
            ) : posts.length === 0 ? (
              <Card className="backdrop-blur-md bg-white/5 border-white/10 text-center py-12">
                <CardContent>
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No Posts Yet</h3>
                  <p className="text-muted-foreground">
                    Be the first to share something with the community!
                  </p>
                </CardContent>
              </Card>
            ) : (
              posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="backdrop-blur-md bg-white/5 border-white/10 hover:border-accent/50 hover:shadow-[0_0_20px_rgba(124,58,237,0.2)] transition-all group">
                    <CardContent className="pt-6">
                      <div className="mb-4">
                        <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                          {post.category}
                        </span>
                        <span className="ml-3 text-sm text-muted-foreground">
                          {new Date(post.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-foreground mb-6 leading-relaxed whitespace-pre-wrap">
                        {post.content}
                      </p>
                      <div className="flex items-center gap-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleUpvote(post.id, post.upvotes)}
                          className="gap-2 hover:text-accent hover:bg-accent/10"
                        >
                          <Heart className="h-4 w-4" />
                          {post.upvotes}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleShare(post)}
                          className="gap-2 hover:text-accent hover:bg-accent/10"
                        >
                          <Share2 className="h-4 w-4" />
                          Share
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CampusPulse;
