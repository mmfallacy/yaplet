import { ManifestSchema } from '$lib/shared/schema';
import type { Manifest, Result } from '$lib/shared/types';
import { getContent } from '../github/repo';

function toDateMs(a: string) {
	return new Date(a).getTime();
}

export async function getManifest(
	offset: number,
	limit?: number
): Promise<Result<Manifest, Error>> {
	const result = await getContent('content/manifest.v1.json');
	if (!result.ok) return { ok: false, error: new Error('Failed to get manifest from repository') };

	const decoded = Buffer.from(result.value.content, 'base64').toString('utf-8');
	const parsed = JSON.parse(decoded);
	const manifest = ManifestSchema.parse(parsed);

	// end = q.offset + q.limit; if q.limit undefined, then end = undefined so slice end is until end of array
	let end = limit;
	if (end) end += offset;

	// Sort Descending (i.e. latest post first)
	// NOTE: Array.prototype.sort returns reference to same array.
	// Return only slice.
	const slice = manifest
		.sort((a, b) => toDateMs(b.createdAt) - toDateMs(a.createdAt))
		.slice(offset, end);

	return { ok: true, value: slice };
}
