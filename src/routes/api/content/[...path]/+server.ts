import { fetchContent } from '$lib/server/github.server';
import { json } from '@sveltejs/kit';
import matter from 'gray-matter';
import type { RequestHandler } from './$types';

function isJsonFile(path: string): boolean {
	return path.endsWith('.json');
}

function isMarkdownFile(path: string): boolean {
	return path.endsWith('.md');
}

export const GET: RequestHandler = async ({ params }) => {
	const path = params.path;

	if (!path) {
		return json({ error: 'Path is required' }, { status: 400 });
	}

	try {
		const content = await fetchContent(path);

		if (isJsonFile(path)) {
			const parsed = JSON.parse(content);
			return json(parsed, {
				headers: {
					'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0'
				}
			});
		}

		if (isMarkdownFile(path)) {
			const { data, content: body } = matter(content);
			return json(
				{ data, content: body },
				{
					headers: {
						'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0'
					}
				}
			);
		}

		return new Response(content, {
			headers: {
				'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0'
			}
		});
	} catch (error) {
		return json(
			{ error: error instanceof Error ? error.message : 'Failed to fetch content' },
			{ status: 500 }
		);
	}
};
