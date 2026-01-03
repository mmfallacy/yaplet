import type { Post, Thread, PostWithThread } from './types';
import { fetchMarkdownFile, parseMarkdownPost } from './parser';

let postsCache: Post[] | null = null;

export function searchPosts(posts: PostWithThread[], query: string): PostWithThread[] {
	if (!query.trim()) return posts;

	const lowerQuery = query.toLowerCase();
	return posts.filter(
		(post) =>
			post.content.toLowerCase().includes(lowerQuery) ||
			post.thread?.title.toLowerCase().includes(lowerQuery) ||
			post.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
	);
}

export async function fetchPosts(): Promise<Post[]> {
	if (postsCache) return postsCache;

	const manifestRes = await fetch('/api/content/manifest.json');
	if (!manifestRes.ok) {
		throw new Error(
			'Failed to load manifest. If content was recently updated, cache invalidation may be pending.'
		);
	}
	const manifest = await manifestRes.json();

	const posts: Post[] = [];

	for (const filename of manifest.standalone) {
		const md = await fetchMarkdownFile(`/api/content/standalone/${filename}`);
		const post = await parseMarkdownPost(md, null);
		posts.push(post);
	}

	for (const threadId of manifest.threads) {
		const metaRes = await fetch(`/api/content/threads/${threadId}/meta.json`);
		const threadMeta = await metaRes.json();
		for (const filename of threadMeta.posts) {
			const md = await fetchMarkdownFile(`/api/content/threads/${threadId}/${filename}`);
			const post = await parseMarkdownPost(md, threadId);
			posts.push(post);
		}
	}

	postsCache = posts;
	return posts;
}

export async function getPostsWithThreads(): Promise<PostWithThread[]> {
	const [posts, threads] = await Promise.all([
		fetchPosts(),
		import('./thread').then((m) => m.fetchThreads())
	]);

	return posts.map((post) => ({
		...post,
		thread: post.threadId ? threads.find((t: Thread) => t.id === post.threadId) : undefined
	}));
}

export async function getPostById(id: string): Promise<PostWithThread | null> {
	const posts = await getPostsWithThreads();
	return posts.find((p) => p.id === id) || null;
}

export async function getPostsByThreadId(threadId: string): Promise<Post[]> {
	const posts = await fetchPosts();
	return posts.filter((p) => p.threadId === threadId);
}

export async function getFirstPostByThreadId(threadId: string): Promise<Post | null> {
	const posts = await getPostsByThreadId(threadId);
	return posts[0] || null;
}

export async function getFeedPosts(): Promise<PostWithThread[]> {
	const posts = await getPostsWithThreads();
	return posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getFeedPostsCollapsed(): Promise<PostWithThread[]> {
	const allPosts = await getPostsWithThreads();
	const seenThreads = new Set<string>();
	const result: PostWithThread[] = [];

	const sorted = allPosts.sort(
		(a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
	);

	for (const post of sorted) {
		if (post.threadId) {
			if (!seenThreads.has(post.threadId)) {
				const threadPosts = sorted.filter((p) => p.threadId === post.threadId);
				if (threadPosts[0]) {
					result.push(threadPosts[0]);
					seenThreads.add(post.threadId);
				}
			}
		} else {
			result.push(post);
		}
	}

	return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}
