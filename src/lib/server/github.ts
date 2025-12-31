import { GITHUB_PAT, CONTENT_BASE_URL } from '$env/static/private';

interface CacheEntry {
	content: string;
	timestamp: number;
}

const CACHE_TTL = 8 * 60 * 60 * 1000;

const cache = new Map<string, CacheEntry>();

function getCacheKey(path: string): string {
	return path;
}

function isExpired(entry: CacheEntry): boolean {
	return Date.now() - entry.timestamp > CACHE_TTL;
}

export async function fetchContent(path: string): Promise<string> {
	const cacheKey = getCacheKey(path);

	const cached = cache.get(cacheKey);
	if (cached && !isExpired(cached)) {
		return cached.content;
	}

	const url = new URL(path, CONTENT_BASE_URL);

	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${GITHUB_PAT}`,
			Accept: 'application/vnd.github.raw'
		}
	});

	if (!response.ok) {
		if (cached) {
			return cached.content;
		}
		throw new Error(`Failed to fetch ${path}: ${response.status} ${response.statusText}`);
	}

	const content = await response.text();

	cache.set(cacheKey, {
		content,
		timestamp: Date.now()
	});

	return content;
}

export function invalidateCache(path?: string): void {
	if (path) {
		const cacheKey = getCacheKey(path);
		cache.delete(cacheKey);
	} else {
		cache.clear();
	}
}

// Entries: path |-> timestamp in utc
type Entries = Record<string, string>;
export function getCacheStats(): { size: number; entries: Entries } {
	const entries: Entries = {};
	let c = 0;
	for (const [key, entry] of cache.entries()) {
		if (!isExpired(entry)) {
			c += 1;
			entries[key] = new Date(entry.timestamp).toISOString();
		}
	}
	return {
		size: c,
		entries
	};
}
