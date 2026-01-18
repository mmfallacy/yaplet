import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getPostById } from '$lib/server/post/getPostById';

export const load: PageServerLoad = async ({ params }) => {
	const post = await getPostById(params.postId);
	console.log(post);

	if (!post.ok) {
		error(404, 'Post not found');
	}

	return { post: post.value };
};
