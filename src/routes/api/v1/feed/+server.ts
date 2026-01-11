import { getManifest } from '$lib/server/manifest.server';
import { json, type RequestHandler } from '@sveltejs/kit';
import z from 'zod/v4';

const QuerySchema = z.object({
	offset: z.coerce.number().int().positive().default(0),
	limit: z.coerce.number().int().positive().optional()
});

export const GET: RequestHandler = async ({ url }) => {
	const q = QuerySchema.parse(Object.fromEntries(url.searchParams));

	const manifest = await getManifest(q.offset, q.limit);

	return json(manifest);
};
