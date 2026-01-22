import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getPostById } from '$lib/server/post/getPostById';

// Note: I am not reusing parent load functions here for the following reason:
// - Performance benefit only exists when we navigate from /thread/threadId to /thread/threadId/postId
// - Large detriment if otherwise! Why? Since we need to resolve the whole posts array before I can get the current post
// The current implementation just refetches the post, which seems like a better deal for both cases.
// Not too much overhead to refetch as it should go through the same memory cache,
// Fetch as needed instead of fetching whole posts array only to pick one.
export const load: PageServerLoad = async ({ params }) => {
	const basePath = `content/threads/${params.threadId}`;

	const post = await getPostById(params.postId, basePath);

	if (!post.ok) {
		error(404, 'Thread Post not found');
	}

	return { threadId: params.threadId, post: post.value };
};
