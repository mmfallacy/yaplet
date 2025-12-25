import { useState, useEffect, useMemo } from "react";
import { getFeedPosts, searchPosts } from "@/lib/posts";
import { PostWithThread } from "@/types/post";
import { Header } from "@/components/Header";
import { PostCard } from "@/components/PostCard";
import { Loader2 } from "lucide-react";

export default function Feed() {
  const [posts, setPosts] = useState<PostWithThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getFeedPosts()
      .then(setPosts)
      .finally(() => setLoading(false));
  }, []);

  const filteredPosts = useMemo(() => {
    return searchPosts(posts, searchQuery);
  }, [posts, searchQuery]);

  return (
    <div className="min-h-screen bg-background transition-theme">
      <Header onSearch={setSearchQuery} />

      <main className="max-w-2xl mx-auto border-x border-border min-h-screen">
        {/* Page title */}
        <div className="p-4 border-b border-border">
          <h1 className="text-xl font-semibold text-foreground">Home</h1>
        </div>

        {/* Posts feed */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            {searchQuery ? "No posts match your search." : "No posts yet."}
          </div>
        ) : (
          <div>
            {filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
