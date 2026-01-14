import assert from 'node:assert';
import { GITHUB_PAT } from '$env/static/private';
import { createMemoryCache } from '$lib/server/cache';
import type { Result } from '$lib/shared/types';
import { GhContentResponseSchema, type GhContentResponse } from './schema';
import HTTP from 'http-status-codes';

// TODO: Extract this as the new env vars
const API_CONTENT_BASE_URL = 'https://api.github.com/repos/mmfallacy/yaplet-content/contents/';
const API_CONTENT_REF = 'v1';

const MemoryCache = createMemoryCache<{ etag: string; data: GhContentResponse }>();

export async function getContent(path: string): Promise<Result<GhContentResponse, Error>> {
	const url = new URL(path, API_CONTENT_BASE_URL);
	url.searchParams.set('ref', API_CONTENT_REF);

	const entry = MemoryCache.get(path);
	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${GITHUB_PAT}`,
			Accept: 'application/vnd.github.object+json',
			'X-GitHub-Api-Version': '2022-11-28',
			'If-None-Match': `${entry?.etag ?? 'v1'}`
		}
	});

	switch (response.status) {
		case HTTP.OK:
			// Pass
			break;
		case HTTP.NOT_MODIFIED:
			console.log('Matched Etag, using cache');
			assert(typeof entry !== 'undefined');
			return { ok: true, value: entry.data };
		default:
			return {
				ok: false,
				error: new Error(`Failed to fetch ${path}: ${response.status} ${response.statusText}`)
			};
	}

	const parsed = GhContentResponseSchema.safeParse(await response.json());
	assert(parsed.success, 'Response doesnt follow the GhContentResponseSchema');

	const etag = response.headers.get('etag');
	assert(etag !== null, 'No valid etag given!');

	MemoryCache.set(path, {
		etag,
		data: parsed.data
	});

	return { ok: true, value: parsed.data };
}
