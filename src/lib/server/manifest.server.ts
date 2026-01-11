import { ManifestSchema } from '$lib/schema';
import { fetchFromGithubApi } from '$lib/server/github.server';

function toDateMs(a: string) {
	return new Date(a).getTime();
}

export async function getManifest(offset: number, limit?: number) {
	const data = await fetchFromGithubApi('content/manifest.v1.json');

	const decoded = Buffer.from(data.content, 'base64').toString('utf-8');
	const parsed = JSON.parse(decoded);
	const manifest = ManifestSchema.parse(parsed);

	// end = q.offset + q.limit; if q.limit undefined, then end = undefined so slice end is until end of array
	let end = limit;
	if (end) end += offset;

	// Sort Descending (i.e. latest post first)
	// NOTE: Array.prototype.sort returns reference to same array.
	const slice = manifest
		.sort((a, b) => toDateMs(b.createdAt) - toDateMs(a.createdAt))
		.slice(offset, end);

	return slice;
}
