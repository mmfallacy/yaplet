import { Post, Thread, PostWithThread } from "@/types/post";

const POSTS_URL = "/data/posts.json";
const THREADS_URL = "/data/threads.json";

let postsCache: Post[] | null = null;
let threadsCache: Thread[] | null = null;

export async function fetchPosts(): Promise<Post[]> {
  if (postsCache) return postsCache;
  
  const response = await fetch(POSTS_URL);
  if (!response.ok) throw new Error("Failed to fetch posts");
  
  postsCache = await response.json();
  return postsCache!;
}

export async function fetchThreads(): Promise<Thread[]> {
  if (threadsCache) return threadsCache;
  
  const response = await fetch(THREADS_URL);
  if (!response.ok) throw new Error("Failed to fetch threads");
  
  threadsCache = await response.json();
  return threadsCache!;
}

export async function getPostsWithThreads(): Promise<PostWithThread[]> {
  const [posts, threads] = await Promise.all([fetchPosts(), fetchThreads()]);
  
  return posts.map((post) => ({
    ...post,
    thread: post.threadId 
      ? threads.find((t) => t.id === post.threadId) 
      : undefined,
  }));
}

export async function getPostById(id: string): Promise<PostWithThread | null> {
  const posts = await getPostsWithThreads();
  return posts.find((p) => p.id === id) || null;
}

export async function getThreadById(id: string): Promise<Thread | null> {
  const threads = await fetchThreads();
  return threads.find((t) => t.id === id) || null;
}

export async function getPostsByThreadId(threadId: string): Promise<Post[]> {
  const posts = await fetchPosts();
  return posts
    .filter((p) => p.threadId === threadId)
    .sort((a, b) => (a.threadOrder || 0) - (b.threadOrder || 0));
}

export async function getFeedPosts(): Promise<PostWithThread[]> {
  const posts = await getPostsWithThreads();
  // Sort by date, newest first
  return posts.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function searchPosts(posts: PostWithThread[], query: string): PostWithThread[] {
  if (!query.trim()) return posts;
  
  const lowerQuery = query.toLowerCase();
  return posts.filter(
    (post) =>
      post.content.toLowerCase().includes(lowerQuery) ||
      post.thread?.title.toLowerCase().includes(lowerQuery)
  );
}

export function filterByDateRange(
  posts: PostWithThread[],
  startDate?: Date,
  endDate?: Date
): PostWithThread[] {
  return posts.filter((post) => {
    const postDate = new Date(post.createdAt);
    if (startDate && postDate < startDate) return false;
    if (endDate && postDate > endDate) return false;
    return true;
  });
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

export const MAX_CHARS = 400;

export function validateContent(content: string): { valid: boolean; error?: string } {
  if (!content.trim()) {
    return { valid: false, error: "Content cannot be empty" };
  }
  if (content.length > MAX_CHARS) {
    return { valid: false, error: `Content exceeds ${MAX_CHARS} characters` };
  }
  return { valid: true };
}
