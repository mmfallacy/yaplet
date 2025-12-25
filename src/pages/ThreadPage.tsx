import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { getThreadById, getPostsByThreadId } from "@/lib/posts";
import { Thread, Post } from "@/types/post";
import { Header } from "@/components/Header";
import { PostCard } from "@/components/PostCard";
import { Button } from "@/components/ui/button";

export default function ThreadPage() {
  const { threadId } = useParams<{ threadId: string }>();
  const [thread, setThread] = useState<Thread | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!threadId) return;

    Promise.all([getThreadById(threadId), getPostsByThreadId(threadId)])
      .then(([threadData, postsData]) => {
        setThread(threadData);
        setPosts(postsData);
      })
      .finally(() => setLoading(false));
  }, [threadId]);

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

  if (!thread) {
    return (
      <div className="min-h-screen bg-background transition-theme">
        <Header showSearch={false} />
        <main className="max-w-2xl mx-auto border-x border-border min-h-screen">
          <div className="p-4 text-center">
            <p className="text-muted-foreground">Thread not found.</p>
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
        {/* Thread header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <Link to="/">
              <Button variant="ghost" size="icon" className="text-foreground">
                <ArrowLeft size={20} />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-semibold text-foreground">{thread.title}</h1>
              <p className="text-sm text-muted-foreground mt-0.5">{thread.description}</p>
            </div>
          </div>
        </div>

        {/* Thread indicator line */}
        <div className="relative">
          <div className="absolute left-[34px] sm:left-[38px] top-0 bottom-0 w-0.5 bg-primary/20" />
          
          {/* Thread posts */}
          {posts.map((post, index) => (
            <div key={post.id} className="relative">
              {/* Thread number badge */}
              <div className="absolute left-4 sm:left-5 top-4 sm:top-5 z-10">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
                  {index + 1}
                </div>
              </div>
              <PostCard
                post={{ ...post, thread: undefined }}
                showThreadLink={false}
                className="pl-14 sm:pl-16"
              />
            </div>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No posts in this thread yet.
          </div>
        )}
      </main>
    </div>
  );
}
