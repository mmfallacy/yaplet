import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { getPostById } from "@/lib/posts";
import { PostWithThread, Comment } from "@/types/post";
import { Header } from "@/components/Header";
import { PostCard } from "@/components/PostCard";
import { CommentsSection } from "@/components/CommentsSection";
import { Button } from "@/components/ui/button";

export default function PostPage() {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<PostWithThread | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!postId) return;

    getPostById(postId)
      .then((postData) => {
        setPost(postData);
        // Stub: In Next.js, fetch comments from API
        setComments([]);
      })
      .finally(() => setLoading(false));
  }, [postId]);

  const handleAddComment = (content: string) => {
    // Stub: In Next.js, this would call an API
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      postId: postId!,
      userId: "user-1",
      userName: "Demo User",
      content,
      createdAt: new Date().toISOString(),
    };
    setComments((prev) => [...prev, newComment]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background transition-theme">
        <Header showSearch={false} />
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background transition-theme">
        <Header showSearch={false} />
        <main className="max-w-2xl mx-auto border-x border-border min-h-screen">
          <div className="p-4 text-center">
            <p className="text-muted-foreground">Post not found.</p>
            <Link to="/" className="text-primary hover:underline mt-2 inline-block">
              Back to home
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background transition-theme">
      <Header showSearch={false} />

      <main className="max-w-2xl mx-auto border-x border-border min-h-screen">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <Link to="/">
              <Button variant="ghost" size="icon" className="text-foreground">
                <ArrowLeft size={20} />
              </Button>
            </Link>
            <h1 className="text-xl font-semibold text-foreground">Post</h1>
          </div>
        </div>

        {/* Post */}
        <PostCard post={post} showThreadLink={true} />

        {/* Comments */}
        <div className="p-4 sm:p-5">
          <CommentsSection
            postId={post.id}
            comments={comments}
            onAddComment={handleAddComment}
          />
        </div>
      </main>
    </div>
  );
}
