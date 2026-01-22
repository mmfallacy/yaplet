import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getPostById } from '$lib/server/post/getPostById';

export const load: PageServerLoad = async ({ params }) => {
	const basePath = `content/threads/${params.threadId}`;

	const post = await getPostById(params.postId, basePath);

	if (!post.ok) {
		error(404, 'Thread Post not found');
	}

	return { threadId: params.threadId, post: post.value };
};
