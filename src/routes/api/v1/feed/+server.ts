import { ManifestSchema } from '$lib/schema';
import { fetchFromGithubApi } from '$lib/server/github.server';
import { json, type RequestHandler } from '@sveltejs/kit';
import z from 'zod/v4';

function toDateMs(a: string) {
	return new Date(a).getTime();
}

const QuerySchema = z.object({
	offset: z.coerce.number().int().positive().default(0),
	limit: z.coerce.number().int().positive().optional()
});

export const GET: RequestHandler = async ({ url }) => {
	const q = QuerySchema.parse(Object.fromEntries(url.searchParams));

	const data = await fetchFromGithubApi('content/manifest.v1.json');

	const decoded = Buffer.from(data.content, 'base64').toString('utf-8');
	const parsed = JSON.parse(decoded);
	const manifest = ManifestSchema.parse(parsed);

	// end = q.offset + q.limit; if q.limit undefined, then end = undefined so slice end is until end of array
	let end = q.limit;
	if (end) end += q.offset;

	// Sort Descending (i.e. latest post first)
	// NOTE: Array.prototype.sort returns reference to same array.
	const slice = manifest
		.sort((a, b) => toDateMs(b.createdAt) - toDateMs(a.createdAt))
		.slice(q.offset, end);

	return json(slice);
};
