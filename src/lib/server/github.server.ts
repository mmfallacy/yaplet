import { GITHUB_PAT, CONTENT_BASE_URL } from '$env/static/private';

export async function fetchContent(path: string): Promise<string> {
	const url = new URL(path, CONTENT_BASE_URL);

	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${GITHUB_PAT}`,
			Accept: 'application/vnd.github.raw'
		}
	});

	if (!response.ok) {
		throw new Error(`Failed to fetch ${path}: ${response.status} ${response.statusText}`);
	}

	return response.text();
}
