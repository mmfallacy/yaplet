<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { getThreadById } from '$lib/thread';
	import { getPostsByThreadId } from '$lib/post';
	import type { Thread, Post } from '$lib/types';
	import PostCard from '$lib/components/PostCard.svelte';
	import CommentsSection from '$lib/components/CommentsSection.svelte';
	import * as Button from '$lib/components/ui/button';
	import { ArrowLeft, LoaderCircle } from '@lucide/svelte';

	let threadId = $derived(page.params.threadId);
	let thread = $state<Thread | null>(null);
	let posts = $state<Post[]>([]);
	let loading = $state(true);

	onMount(async () => {
		if (!threadId) return;

		loading = true;
		try {
			const [threadData, postsData] = await Promise.all([
				getThreadById(threadId),
				getPostsByThreadId(threadId)
			]);
			thread = threadData;
			posts = postsData;
		} finally {
			loading = false;
		}
	});
</script>

<main class="mx-auto min-h-screen max-w-2xl border-x border-border">
	{#if loading}
		<div class="flex items-center justify-center py-12">
			<LoaderCircle class="h-6 w-6 animate-spin text-primary" />
		</div>
	{:else if !thread}
		<div class="p-4 text-center">
			<p class="text-muted-foreground">Thread not found.</p>
			<a href={resolve('/')} class="mt-2 inline-block text-primary hover:underline">
				Back to home
			</a>
		</div>
	{:else}
		<div class="border-b border-border p-4">
			<div class="flex items-center gap-3">
				<Button.Root href={resolve('/')} variant="ghost" size="icon" class="text-foreground">
					<ArrowLeft size={20} />
				</Button.Root>
				<div>
					<h1 class="text-xl font-semibold text-foreground">{thread.title}</h1>
					<p class="mt-0.5 text-sm text-muted-foreground">{thread.description}</p>
				</div>
			</div>
		</div>

		<div class="relative pl-2">
			<div class="absolute top-0 bottom-0 left-6 w-0.5 bg-primary/20 sm:left-8"></div>

			{#each posts as post, index (post.id)}
				<div class="relative grid grid-cols-[auto_1fr]">
					<div
						class="relative z-10 col-start-1 row-start-1 flex h-10 w-10 items-center justify-center sm:h-12 sm:w-12"
					>
						<div
							class="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground"
						>
							{index + 1}
						</div>
					</div>

					<div class="col-start-2 row-start-1">
						<PostCard post={{ ...post, thread: undefined }} />
					</div>
				</div>
			{/each}
		</div>

		{#if posts.length === 0}
			<div class="py-12 text-center text-muted-foreground">No posts in this thread yet.</div>
		{/if}

		{#if posts.length > 0}
			<div class="p-4 sm:p-5">
				<CommentsSection postId={thread.id} comments={[]} />
			</div>
		{/if}
	{/if}
</main>
