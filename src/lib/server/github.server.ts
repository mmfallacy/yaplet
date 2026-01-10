import { GITHUB_PAT, CONTENT_BASE_URL } from '$env/static/private';

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

export async function fetchFromGithubApi(path: string): Promise<Response> {
	const url = new URL(path, API_CONTENT_BASE_URL);
	url.searchParams.set('ref', API_CONTENT_REF);

	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${GITHUB_PAT}`,
			Accept: 'application/vnd.github.object+json',
			'X-GitHub-Api-Version': '2022-11-28'
		}
	});

	if (!response.ok) {
		throw new Error(`Failed to fetch ${path}: ${response.status} ${response.statusText}`);
	}

	return response;
}
