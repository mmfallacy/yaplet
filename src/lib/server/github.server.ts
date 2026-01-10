import { GITHUB_PAT, CONTENT_BASE_URL } from '$env/static/private';
import assert from 'node:assert';

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

const MemoryCache = new Map<string, { etag: string; data: Response }>();

export async function fetchFromGithubApi(path: string): Promise<Response> {
	const url = new URL(path, API_CONTENT_BASE_URL);
	url.searchParams.set('ref', API_CONTENT_REF);

	const entry = MemoryCache.get(path);
	console.log(entry);

	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${GITHUB_PAT}`,
			Accept: 'application/vnd.github.object+json',
			'X-GitHub-Api-Version': '2022-11-28',
			'If-None-Match': `${entry?.etag ?? 'v1'}`
		}
	});

	console.log(`FETCH [${path}]: ${response.status} ${response.statusText}`);
	console.log(response.headers);

	if (response.status == 304) {
		console.log('Matched Etag, using cache');
		assert(typeof entry !== 'undefined');
		return entry.data;
	}

	if (!response.ok) {
		throw new Error(`Failed to fetch ${path}: ${response.status} ${response.statusText}`);
	}

	const etag = response.headers.get('etag') || '';
	console.log(etag);
	MemoryCache.set(path, {
		etag,
		data: response
	});

	return response;
}
