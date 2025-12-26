import { Link } from "react-router-dom";
import { ChevronRight, MessageCircle } from "lucide-react";
import { PostWithThread } from "@/types/post";
import { formatDate } from "@/lib/posts";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { PostImages } from "./PostImages";
import { PostActions } from "./PostActions";
import { cn } from "@/lib/utils";

interface ThreadPreviewProps {
  post: PostWithThread;
  totalPosts: number;
  className?: string;
}

export function ThreadPreview({ post, totalPosts, className }: ThreadPreviewProps) {
  return (
    <article
      className={cn(
        "p-4 sm:p-5 border-b border-border transition-theme hover:bg-muted/30 animate-fade-in",
        className
      )}
    >
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-primary font-medium text-sm sm:text-base">J</span>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-foreground">Journal</span>
            <span className="text-muted-foreground">·</span>
            <time className="text-muted-foreground text-sm" dateTime={post.createdAt}>
              {formatDate(post.createdAt)}
            </time>
          </div>

          {/* Thread badge - clickable */}
          {post.thread && (
            <Link
              to={`/thread/${post.threadId}`}
              className="inline-flex items-center gap-1.5 mt-1.5 px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full hover:bg-primary/20 transition-colors"
            >
              <MessageCircle size={12} />
              <span>{post.thread.title}</span>
              <span className="text-primary/70">· {totalPosts} posts</span>
            </Link>
          )}

          {/* Content */}
          <div className="mt-2 text-foreground">
            <MarkdownRenderer content={post.content} />
          </div>

          {/* Images */}
          {post.images.length > 0 && (
            <PostImages images={post.images} className="mt-3" />
          )}

          {/* Actions */}
          <PostActions postId={post.id} initialLikes={post.likes} />

          {/* View thread link */}
          {post.thread && totalPosts > 1 && (
            <Link
              to={`/thread/${post.threadId}`}
              className="flex items-center gap-1 mt-3 text-sm text-primary hover:underline group"
            >
              <span>Show this thread</span>
              <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
