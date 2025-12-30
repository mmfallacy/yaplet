import type { Thread, Manifest } from './types';

let threadsCache: Thread[] | null = null;

export async function fetchThreads(): Promise<Thread[]> {
	if (threadsCache) return threadsCache;

	const manifestRes = await fetch('/content/manifest.json');
	const manifest: Manifest = await manifestRes.json();

	const threads: Thread[] = [];

	for (const threadId of manifest.threads) {
		const metaRes = await fetch(`/content/threads/${threadId}/meta.json`);
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
