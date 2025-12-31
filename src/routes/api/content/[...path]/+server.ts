import { fetchContent } from '$lib/server/github';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	const path = params.path;

	if (!path) {
		return json({ error: 'Path is required' }, { status: 400 });
	}

	try {
		const content = await fetchContent(path);
		return new Response(content, {
			headers: {
				'Content-Type': 'application/json',
			}
		});
	} catch (error) {
		return json(
			{ error: error instanceof Error ? error.message : 'Failed to fetch content' },
			{ status: 500 }
		);
	}
};
