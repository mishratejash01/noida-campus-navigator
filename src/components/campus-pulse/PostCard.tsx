import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, Share2, ThumbsUp } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

// Types (You should ideally put these in a types file)
interface Comment {
  id: string;
  content: string;
  is_op: boolean;
  created_at: string;
}

interface Post {
  id: string;
  content: string;
  category: string;
  upvotes: number;
  created_at: string;
  is_anonymous: boolean;
}

export const PostCard = ({ post }: { post: Post }) => {
  const [votes, setVotes] = useState(post.upvotes);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);

  const handleReaction = async (emoji: string) => {
    // Optimistic UI update
    setVotes((prev) => prev + 1);
    toast.success(`Reacted with ${emoji}`);
    
    // In real app: Update a 'reactions' table. For now, we increment upvotes.
    const { error } = await supabase.rpc('increment_upvotes', { post_id: post.id });
    if (error) console.error(error);
  };

  const fetchComments = async () => {
    if (showComments) {
      setShowComments(false);
      return;
    }
    setLoadingComments(true);
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .eq("post_id", post.id)
      .order("created_at", { ascending: true });
    
    if (data) setComments(data);
    setLoadingComments(false);
    setShowComments(true);
  };

  const submitComment = async () => {
    if (!newComment.trim()) return;
    
    const { error } = await supabase.from("comments").insert({
      post_id: post.id,
      content: newComment,
      is_op: false, // You'd check current user vs post author here
    });

    if (error) {
      toast.error("Failed to comment");
    } else {
      setNewComment("");
      fetchComments(); // Refresh
      toast.success("Comment added!");
    }
  };

  return (
    <Card className="mb-4 hover:shadow-md transition-shadow duration-300 border-slate-200">
      <CardHeader className="flex flex-row items-center gap-3 pb-2">
        <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
          <AvatarImage src={`https://api.dicebear.com/7.x/notionists/svg?seed=${post.id}`} />
          <AvatarFallback>AN</AvatarFallback>
        </Avatar>
        <div>
          <div className="font-bold text-sm text-slate-800">
            {post.is_anonymous ? "Anonymous Student" : "Verified User"}
          </div>
          <div className="text-xs text-slate-500">
            {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })} • {post.category}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pb-2">
        <p className="text-slate-700 whitespace-pre-wrap">{post.content}</p>
      </CardContent>

      <CardFooter className="flex flex-col items-start pt-2">
        <div className="flex w-full justify-between items-center text-slate-500">
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="hover:text-orange-500">
                  <ThumbsUp className="mr-1 h-4 w-4" /> {votes}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-2 flex gap-2">
                {["🔥", "💀", "👀", "🤡"].map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => handleReaction(emoji)}
                    className="hover:scale-125 transition-transform text-xl"
                  >
                    {emoji}
                  </button>
                ))}
              </PopoverContent>
            </Popover>

            <Button variant="ghost" size="sm" onClick={fetchComments} className="hover:text-blue-500">
              <MessageCircle className="mr-1 h-4 w-4" /> Comment
            </Button>
          </div>
          <Button variant="ghost" size="sm">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>

        {showComments && (
          <div className="w-full mt-4 bg-slate-50 rounded-lg p-3">
            {loadingComments ? (
              <p className="text-xs text-center text-slate-400">Loading tea... 🍵</p>
            ) : (
              <div className="space-y-3">
                {comments.map((c) => (
                  <div key={c.id} className="text-sm">
                    <span className="font-bold text-slate-700">
                      {c.is_op ? <span className="text-blue-600 bg-blue-50 px-1 rounded">OP</span> : "Anon"}:
                    </span>{" "}
                    {c.content}
                  </div>
                ))}
              </div>
            )}
            <div className="mt-3 flex gap-2">
              <input
                className="flex-1 bg-white border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Spill the tea..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submitComment()}
              />
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};
