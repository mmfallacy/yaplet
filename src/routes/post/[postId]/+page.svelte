<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { getPostById } from '$lib/post';
	import type { PostWithThread, Comment } from '$lib/types';
	import Header from '$lib/components/Header.svelte';
	import PostCard from '$lib/components/PostCard.svelte';
	import CommentsSection from '$lib/components/CommentsSection.svelte';
	import * as Button from '$lib/components/ui/button';
	import { ArrowLeft, LoaderCircle } from '@lucide/svelte';

	let postId = $derived(page.params.postId);
	let post = $state<PostWithThread | null>(null);
	let comments = $state<Comment[]>([]);
	let loading = $state(true);

	$effect(() => {
		if (!postId) return;

		loading = true;
		try {
			(async function () {
				const postData = await getPostById(postId);
				post = postData;
				comments = [];
			})();
		} finally {
			loading = false;
		}
	});

	function handleAddComment(content: string) {
		// Stub: In a real app, this would call an API
		const newComment: Comment = {
			id: `comment-${Date.now()}`,
			postId: postId!,
			userId: 'user-1',
			userName: 'Demo User',
			content,
			createdAt: new Date().toISOString()
		};
		comments = [...comments, newComment];
	}
</script>

<div class="min-h-screen bg-background transition-colors">
	<Header showSearch={false} />

	<main class="mx-auto min-h-screen max-w-2xl border-x border-border">
		{#if loading}
			<div class="flex items-center justify-center py-12">
				<LoaderCircle class="h-6 w-6 animate-spin text-primary" />
			</div>
		{:else if !post}
			<div class="p-4 text-center">
				<p class="text-muted-foreground">Post not found.</p>
				<a href={resolve('/')} class="mt-2 inline-block text-primary hover:underline">
					Back to home
				</a>
			</div>
		{:else}
			<!-- Header -->
			<div class="border-b border-border p-4">
				<div class="flex items-center gap-3">
					<Button.Root href={resolve('/')} variant="ghost" size="icon" class="text-foreground">
						<ArrowLeft size={20} />
					</Button.Root>
					<h1 class="text-xl font-semibold text-foreground">Post</h1>
				</div>
			</div>

			<!-- Post -->
			<PostCard {post} />

			<!-- Comments -->
			<div class="p-4 sm:p-5">
				<CommentsSection postId={post.id} {comments} onAddComment={handleAddComment} />
			</div>
		{/if}
	</main>
</div>
