import { ManifestSchema } from '$lib/schema';
import { fetchFromGithubApi } from '$lib/server/github.server';
import { json } from '@sveltejs/kit';

function toDateMs(a: string) {
	return new Date(a).getTime();
}

export async function GET() {
	const data = await fetchFromGithubApi('content/manifest.v1.json');

	const decoded = Buffer.from(data.content, 'base64').toString('utf-8');
	const parsed = JSON.parse(decoded);
	const manifest = ManifestSchema.parse(parsed);

	// Sort Descending (i.e. latest post first)
	manifest.sort((a, b) => toDateMs(b.createdAt) - toDateMs(a.createdAt));

	return json(manifest);
}
