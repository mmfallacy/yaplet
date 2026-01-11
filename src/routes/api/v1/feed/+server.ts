import { ManifestSchema } from '$lib/schema';
import { fetchFromGithubApi } from '$lib/server/github.server';
import { json } from '@sveltejs/kit';

export async function GET() {
	const data = await fetchFromGithubApi('content/manifest.v1.json');

	const decoded = Buffer.from(data.content, 'base64').toString('utf-8');
	const parsed = JSON.parse(decoded);
	const manifest = ManifestSchema.parse(parsed);

	return json(manifest);
}
