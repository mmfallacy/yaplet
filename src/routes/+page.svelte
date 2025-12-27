<script lang="ts">
	import { onMount } from 'svelte';
	import { getFeedPostsCollapsed, searchPosts, getPostsByThreadId } from '$lib/posts';
	import type { PostWithThread } from '$lib/types/post';
	import Header from '$lib/components/Header.svelte';
	import PostCard from '$lib/components/PostCard.svelte';
	import ThreadPreview from '$lib/components/ThreadPreview.svelte';
	import { LoaderCircle } from '@lucide/svelte';

	let posts = $state<PostWithThread[]>([]);
	let threadCounts = $state<Record<string, number>>({});
	let loading = $state(true);
	let searchQuery = $state('');

	onMount(async () => {
		try {
			const feedPosts = await getFeedPostsCollapsed();
			posts = feedPosts;

			// Get counts for each thread
			const counts: Record<string, number> = {};
			for (const post of feedPosts) {
				if (post.threadId) {
					const threadPosts = await getPostsByThreadId(post.threadId);
					counts[post.threadId] = threadPosts.length;
				}
			}
			threadCounts = counts;
		} finally {
			loading = false;
		}
	});

	let filteredPosts = $derived(searchPosts(posts, searchQuery));
</script>

<div class="bg-background min-h-screen transition-colors">
	<Header onSearch={(q) => (searchQuery = q)} />

	<main class="border-border mx-auto min-h-screen max-w-2xl border-x">
		<!-- Page title -->
		<div class="border-border border-b p-4">
			<h1 class="text-foreground text-xl font-semibold">Home</h1>
		</div>

		<!-- Posts feed -->
		{#if loading}
			<div class="flex items-center justify-center py-12">
				<LoaderCircle class="text-primary h-6 w-6 animate-spin" />
			</div>
		{:else if filteredPosts.length === 0}
			<div class="text-muted-foreground py-12 text-center">
				{searchQuery ? 'No posts match your search.' : 'No posts yet.'}
			</div>
		{:else}
			<div>
				{#each filteredPosts as post (post.id)}
					{#if post.threadId}
						<ThreadPreview {post} totalPosts={threadCounts[post.threadId] || 1} />
					{:else}
						<PostCard {post} />
					{/if}
				{/each}
			</div>
		{/if}
	</main>
</div>
