import { Heart, MessageCircle, Share2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface PostActionsProps {
  postId: string;
  initialLikes: number;
  commentCount?: number;
  onCommentClick?: () => void;
  className?: string;
}

export function PostActions({
  postId,
  initialLikes,
  commentCount = 0,
  onCommentClick,
  className,
}: PostActionsProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);

  const handleLike = () => {
    // Stub: In Next.js, this would call an API
    setLiked(!liked);
    setLikes((prev) => (liked ? prev - 1 : prev + 1));
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/post/${postId}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check out this post",
          url,
        });
      } catch {
        // User cancelled or share failed
      }
    } else {
      await navigator.clipboard.writeText(url);
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 2000);
    }
  };

  return (
    <div className={cn("flex items-center gap-6 mt-3", className)}>
      {/* Comments */}
      <button
        onClick={onCommentClick}
        className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors group"
      >
        <MessageCircle
          size={18}
          className="group-hover:scale-110 transition-transform"
        />
        <span className="text-sm">{commentCount}</span>
      </button>

      {/* Likes */}
      <button
        onClick={handleLike}
        className={cn(
          "flex items-center gap-1.5 transition-colors group",
          liked ? "text-red-500" : "text-muted-foreground hover:text-red-500"
        )}
      >
        <Heart
          size={18}
          className={cn(
            "group-hover:scale-110 transition-transform",
            liked && "fill-current"
          )}
        />
        <span className="text-sm">{likes}</span>
      </button>

      {/* Share */}
      <div className="relative">
        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors group"
        >
          <Share2
            size={18}
            className="group-hover:scale-110 transition-transform"
          />
        </button>
        {showShareToast && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-foreground text-background text-xs rounded whitespace-nowrap">
            Link copied!
          </div>
        )}
      </div>
    </div>
  );
}
