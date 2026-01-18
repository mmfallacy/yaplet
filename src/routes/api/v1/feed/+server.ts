import { getManifest } from '$lib/server/manifest/getManifest';
import { getPostById } from '$lib/server/post/getPostById';
import { getThreadById } from '$lib/server/thread/getThreadById';
import { serializeResult } from '$lib/utils';
import { error, json, type RequestHandler } from '@sveltejs/kit';
import assert from 'node:assert/strict';
import z from 'zod/v4';

const QuerySchema = z.object({
	offset: z.coerce.number().int().positive().default(0),
	limit: z.coerce.number().int().positive().optional()
});

export const GET: RequestHandler = async function ({ url }) {
	try {
		const q = QuerySchema.parse(Object.fromEntries(url.searchParams));

		const result = await getManifest(q.offset, q.limit);
		assert(result.ok, 'There was a problem ');
		const manifest = result.value;

		const mapped = manifest.map(function (entry) {
			switch (entry.type) {
				case 'standalone':
					return getPostById(entry.id);
				case 'thread':
					return getThreadById(entry.id);
				default:
					throw new Error('unhandled manifest entry type');
			}
		});
		const settled = await Promise.allSettled(mapped);
		const unwrapped = settled.map(function (result) {
			switch (result.status) {
				case 'fulfilled':
					return serializeResult(result.value);
				case 'rejected':
					return { ok: false, error: result.reason };
				default:
					throw new Error('Impossible Case');
			}
		});

		return json(unwrapped);
	} catch (err) {
		console.error(err);
		assert(err instanceof Error, `unexpected error: ${String(err)}`);
		return error(500, err);
	}
};
