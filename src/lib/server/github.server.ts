import { GITHUB_PAT, CONTENT_BASE_URL } from '$env/static/private';
import assert from 'node:assert';
import z from 'zod';

export async function fetchContent(path: string): Promise<Response> {
	const url = new URL(path, CONTENT_BASE_URL);
	url.searchParams.set('raw', 'true');

	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${GITHUB_PAT}`,
			Accept: 'application/vnd.github.raw'
		}
	});

	if (!response.ok) {
		throw new Error(`Failed to fetch ${path}: ${response.status} ${response.statusText}`);
	}

	return response;
}

const API_CONTENT_BASE_URL = 'https://api.github.com/repos/mmfallacy/yaplet-content/contents/';
const API_CONTENT_REF = 'main';

const MemoryCache = new Map<string, { etag: string; data: GhContentResponse }>();

const GhContentResponseSchema = z.object({
	name: z.string(),
	path: z.string(),
	sha: z.string(),
	size: z.int(),
	type: z.literal('file'),
	content: z.string(),
	encoding: z.literal('base64')
});

type GhContentResponse = z.infer<typeof GhContentResponseSchema>;

export async function fetchFromGithubApi(path: string): Promise<GhContentResponse> {
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

	if (response.status == 304) {
		console.log('Matched Etag, using cache');
		assert(typeof entry !== 'undefined');
		return entry.data;
	}

	if (!response.ok) {
		throw new Error(`Failed to fetch ${path}: ${response.status} ${response.statusText}`);
	}

	const etag = response.headers.get('etag') || '';
	const parsed = GhContentResponseSchema.safeParse(await response.json());

	if (!parsed.success) {
		throw new Error('GhContentResponse assertions failed');
	}

	const data = parsed.data;

	MemoryCache.set(path, {
		etag,
		data
	});

	return data;
}
