import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getContent } from '$lib/server/github/repo';
import HTTP from 'http-status-codes';
import assert from 'node:assert/strict';

function getImageContentType(path: string): string | false {
	switch (true) {
		case path.endsWith('.png'):
			return 'image/png';
		case path.endsWith('.jpg') || path.endsWith('jpeg'):
			return 'image/jpeg';
		case path.endsWith('.gif'):
			return 'image/gif';
		default:
			return false;
	}
}

export const GET: RequestHandler = async function ({ params }) {
	try {
		const path = params.path;
		const ct = getImageContentType(path);
		if (ct === false) error(HTTP.BAD_REQUEST, `Content at ${path} is not a supported image type`);

		const res = await getContent(`content/images/${path}`);
		if (!res.ok) error(HTTP.NOT_FOUND, `Cannot find image at ${path}`);

		assert(res.value.encoding === 'base64', 'Content is not base64!');

		return new Response(Buffer.from(res.value.content, 'base64'), {
			headers: {
				'Content-Type': ct,
				'Cache-Control': 'public, max-age=3600',
				'Content-Disposition': 'inline'
			}
		});
	} catch (err) {
		console.error(err);
		assert(err instanceof Error, `unexpected error: ${String(err)}`);
		return error(500, err);
	}
};
