import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useProfile } from "@/hooks/use-profile";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  author: { username: string; avatar_url: string } | null;
}

export function CommentSection({ postId }: { postId: string }) {
  const { profile } = useProfile();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchComments = async () => {
    const { data } = await supabase
      .from("comments")
      .select(`
        *,
        author:profiles(username, avatar_url)
      `)
      .eq("post_id", postId)
      .order("created_at", { ascending: true });

    if (data) setComments(data);
  };

  useEffect(() => { fetchComments(); }, [postId]);

  const handleSubmit = async () => {
    if (!newComment.trim()) return;
    if (!profile) return toast.error("Please login");

    setLoading(true);
    const { error } = await supabase.from("comments").insert({
      post_id: postId,
      content: newComment,
      author_id: profile.id
    });
    setLoading(false);

    if (error) toast.error("Failed to post");
    else {
      setNewComment("");
      fetchComments();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <Textarea 
          value={newComment} 
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="What are your thoughts?"
          className="min-h-[80px] bg-white"
        />
        <Button onClick={handleSubmit} disabled={loading} className="h-auto">
          Post
        </Button>
      </div>

      <div className="space-y-4 mt-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={comment.author?.avatar_url} />
              <AvatarFallback>{comment.author?.username?.[0] || "?"}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                <span className="font-semibold text-slate-900">{comment.author?.username || "Unknown"}</span>
                <span>{formatDistanceToNow(new Date(comment.created_at))} ago</span>
              </div>
              <p className="text-sm text-slate-800">{comment.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
