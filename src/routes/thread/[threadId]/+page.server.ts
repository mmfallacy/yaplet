import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getThreadById } from '$lib/server/thread/getThreadById';
import { getPostsByIds } from '$lib/server/post/batchGetPostsById';

export const load: PageServerLoad = async ({ params }) => {
	const basePath = `content/threads/${params.threadId}`;

	const thread = await getThreadById(params.threadId);

	if (!thread.ok) {
		error(404, 'Thread not found');
	}

	const posts = await getPostsByIds(thread.value.posts, basePath);

	return { thread: thread.value, posts: posts };
};
