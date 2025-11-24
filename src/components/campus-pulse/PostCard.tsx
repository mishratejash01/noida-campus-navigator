import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Share2, ArrowBigUp, ArrowBigDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { useProfile } from "@/hooks/use-profile";
import { toast } from "sonner";
import { CommentSection } from "./CommentSection"; // We will create this next

export const PostCard = ({ post }: { post: any }) => {
  const { profile } = useProfile();
  const [voteStatus, setVoteStatus] = useState<number>(0); // 0, 1, or -1
  const [score, setScore] = useState(post.upvotes - (post.downvotes || 0));
  const [showComments, setShowComments] = useState(false);

  // Check if user has already voted on load
  useEffect(() => {
    if (post.my_vote && post.my_vote.length > 0) {
      setVoteStatus(post.my_vote[0].vote_type);
    }
  }, [post.my_vote]);

  const handleVote = async (type: 1 | -1) => {
    if (!profile) return toast.error("Login to vote!");

    const newVote = voteStatus === type ? 0 : type; // Toggle off if same click
    const previousVote = voteStatus;
    
    // Optimistic UI Update
    setVoteStatus(newVote);
    setScore(s => s - previousVote + newVote);

    // Backend Update
    if (newVote === 0) {
      await supabase.from("post_votes").delete().match({ post_id: post.id, user_id: profile.id });
    } else {
      await supabase.from("post_votes").upsert({ 
        post_id: post.id, 
        user_id: profile.id, 
        vote_type: newVote 
      });
    }
  };

  return (
    <Card className="hover:border-slate-300 transition-all duration-200">
      <div className="flex">
        {/* Vote Sidebar */}
        <div className="w-12 bg-slate-50/50 flex flex-col items-center py-4 gap-1 border-r border-slate-100 rounded-l-xl">
          <Button 
            variant="ghost" 
            size="sm" 
            className={cn("p-0 h-8 w-8 hover:bg-orange-100 hover:text-orange-600", voteStatus === 1 && "text-orange-600")}
            onClick={() => handleVote(1)}
          >
            <ArrowBigUp className={cn("h-6 w-6", voteStatus === 1 && "fill-current")} />
          </Button>
          <span className={cn("text-sm font-bold", voteStatus === 1 ? "text-orange-600" : voteStatus === -1 ? "text-blue-600" : "text-slate-700")}>
            {score}
          </span>
          <Button 
            variant="ghost" 
            size="sm" 
            className={cn("p-0 h-8 w-8 hover:bg-blue-100 hover:text-blue-600", voteStatus === -1 && "text-blue-600")}
            onClick={() => handleVote(-1)}
          >
            <ArrowBigDown className={cn("h-6 w-6", voteStatus === -1 && "fill-current")} />
          </Button>
        </div>

        <div className="flex-1">
          <CardHeader className="flex flex-row items-center gap-2 p-3 pb-1">
            <Avatar className="h-6 w-6">
              <AvatarImage src={post.is_anonymous ? undefined : post.author?.avatar_url} />
              <AvatarFallback>{post.is_anonymous ? "?" : post.author?.username?.[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="font-semibold text-slate-900">
                {post.is_anonymous ? "u/Anonymous" : `u/${post.author?.username || 'user'}`}
              </span>
              <span>•</span>
              <span>{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</span>
              <span className="bg-slate-100 px-2 py-0.5 rounded-full text-slate-600 font-medium">
                {post.category}
              </span>
            </div>
          </CardHeader>
          
          <CardContent className="p-3 pt-1">
            <h3 className="text-lg font-bold text-slate-900 leading-snug mb-1">{post.title}</h3>
            <p className="text-slate-600 whitespace-pre-wrap text-sm">{post.content}</p>
          </CardContent>

          <CardFooter className="p-3 pt-0 flex gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 text-slate-500 hover:bg-slate-100"
              onClick={() => setShowComments(!showComments)}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              {/* Note: You need to add a comment_count to your post query for this number */}
              Comments
            </Button>
            <Button variant="ghost" size="sm" className="h-8 text-slate-500 hover:bg-slate-100">
              <Share2 className="mr-2 h-4 w-4" /> Share
            </Button>
          </CardFooter>

          {showComments && (
            <div className="border-t bg-slate-50/50 p-4">
              <CommentSection postId={post.id} />
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
