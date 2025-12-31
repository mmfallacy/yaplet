import type { Thread, Manifest } from './types';

let threadsCache: Thread[] | null = null;

export async function fetchThreads(): Promise<Thread[]> {
	if (threadsCache) return threadsCache;

	const manifestRes = await fetch('/api/content/manifest.json');
	if (!manifestRes.ok) {
		throw new Error(
			'Failed to load manifest. If content was recently updated, cache invalidation may be pending.'
		);
	}
	const manifest: Manifest = await manifestRes.json();

	const threads: Thread[] = [];

	for (const threadId of manifest.threads) {
		const metaRes = await fetch(`/api/content/threads/${threadId}/meta.json`);
		const meta: Thread = await metaRes.json();
		threads.push(meta);
	}

	threadsCache = threads;
	return threads;
}

export async function getThreadById(id: string): Promise<Thread | null> {
	const threads = await fetchThreads();
	return threads.find((t) => t.id === id) || null;
}
