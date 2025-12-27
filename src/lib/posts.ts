import type { Post, Thread, PostWithThread } from "$lib/types/post";

interface Manifest {
  standalone: string[];
  threads: { id: string; posts: string[] }[];
}

let postsCache: Post[] | null = null;
let threadsCache: Thread[] | null = null;

// Simple frontmatter parser (browser-compatible, no Node.js Buffer needed)
function parseFrontmatter(content: string): { data: Record<string, unknown>; content: string } {
  const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    return { data: {}, content: content.trim() };
  }
  
  const [, frontmatterStr, body] = match;
  const data: Record<string, unknown> = {};
  
  // Parse YAML-like frontmatter (simple key: value pairs and arrays)
  const lines = frontmatterStr.split('\n');
  let currentKey = '';
  let currentArray: string[] = [];
  let inArray = false;
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    
    // Check if it's an array item
    if (trimmed.startsWith('- ')) {
      if (inArray) {
        currentArray.push(trimmed.slice(2).trim().replace(/^["']|["']$/g, ''));
      }
      continue;
    }
    
    // Save previous array if we were in one
    if (inArray && currentKey) {
      data[currentKey] = currentArray;
      inArray = false;
      currentArray = [];
    }
    
    // Parse key: value
    const colonIndex = trimmed.indexOf(':');
    if (colonIndex > 0) {
      const key = trimmed.slice(0, colonIndex).trim();
      const value = trimmed.slice(colonIndex + 1).trim();
      
      if (value === '' || value === '[]') {
        // Empty value or empty array - might be start of array
        currentKey = key;
        inArray = true;
        currentArray = [];
        if (value === '[]') {
          data[key] = [];
          inArray = false;
        }
      } else {
        // Regular value
        let parsedValue: unknown = value.replace(/^["']|["']$/g, '');
        // Try to parse numbers
        if (!isNaN(Number(parsedValue)) && parsedValue !== '') {
          parsedValue = Number(parsedValue);
        }
        data[key] = parsedValue;
      }
    }
  }
  
  // Don't forget the last array
  if (inArray && currentKey) {
    data[currentKey] = currentArray;
  }
  
  return { data, content: body.trim() };
}

async function fetchMarkdownFile(path: string): Promise<string> {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Failed to fetch ${path}`);
  return response.text();
}

async function parseMarkdownPost(
  content: string,
  threadId: string | null = null
): Promise<Post> {
  const { data, content: body } = parseFrontmatter(content);
  return {
    id: data.id as string,
    content: body.trim(),
    createdAt: data.createdAt as string,
    threadId,
    threadOrder: data.threadOrder as number | undefined,
    images: (data.images as string[]) || [],
    likes: (data.likes as number) || 0,
  };
}

export async function fetchPosts(): Promise<Post[]> {
  if (postsCache) return postsCache;

  const manifestRes = await fetch("/content/manifest.json");
  const manifest: Manifest = await manifestRes.json();

  const posts: Post[] = [];

  // Fetch standalone posts
  for (const filename of manifest.standalone) {
    const md = await fetchMarkdownFile(`/content/standalone/${filename}`);
    const post = await parseMarkdownPost(md, null);
    posts.push(post);
  }

  // Fetch thread posts
  for (const thread of manifest.threads) {
    for (const filename of thread.posts) {
      const md = await fetchMarkdownFile(
        `/content/threads/${thread.id}/${filename}`
      );
      const post = await parseMarkdownPost(md, thread.id);
      posts.push(post);
    }
  }

  postsCache = posts;
  return posts;
}

export async function fetchThreads(): Promise<Thread[]> {
  if (threadsCache) return threadsCache;

  const manifestRes = await fetch("/content/manifest.json");
  const manifest: Manifest = await manifestRes.json();

  const threads: Thread[] = [];

  for (const threadInfo of manifest.threads) {
    const metaRes = await fetch(`/content/threads/${threadInfo.id}/meta.json`);
    const meta: Thread = await metaRes.json();
    threads.push(meta);
  }

  threadsCache = threads;
  return threads;
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

export async function getFirstPostByThreadId(
  threadId: string
): Promise<Post | null> {
  const posts = await getPostsByThreadId(threadId);
  return posts[0] || null;
}

export async function getFeedPosts(): Promise<PostWithThread[]> {
  const posts = await getPostsWithThreads();
  // Sort by date, newest first
  return posts.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

// Get feed with threads collapsed (only first post shown)
export async function getFeedPostsCollapsed(): Promise<PostWithThread[]> {
  const allPosts = await getPostsWithThreads();
  const seenThreads = new Set<string>();
  const result: PostWithThread[] = [];

  // Sort by date first
  const sorted = allPosts.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  for (const post of sorted) {
    if (post.threadId) {
      // Only include first post of each thread
      if (!seenThreads.has(post.threadId)) {
        // Find the actual first post of the thread
        const threadPosts = sorted
          .filter((p) => p.threadId === post.threadId)
          .sort((a, b) => (a.threadOrder || 0) - (b.threadOrder || 0));
        if (threadPosts[0]) {
          result.push(threadPosts[0]);
          seenThreads.add(post.threadId);
        }
      }
    } else {
      result.push(post);
    }
  }

  // Re-sort by date after collecting
  return result.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function searchPosts(
  posts: PostWithThread[],
  query: string
): PostWithThread[] {
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

export function validateContent(content: string): {
  valid: boolean;
  error?: string;
} {
  if (!content.trim()) {
    return { valid: false, error: "Content cannot be empty" };
  }
  if (content.length > MAX_CHARS) {
    return { valid: false, error: `Content exceeds ${MAX_CHARS} characters` };
  }
  return { valid: true };
}
