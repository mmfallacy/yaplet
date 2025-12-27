<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { getThreadById, getPostsByThreadId } from '$lib/posts';
	import type { Thread, Post, PostWithThread } from '$lib/types/post';
	import Header from '$lib/components/Header.svelte';
	import PostCard from '$lib/components/PostCard.svelte';
	import CommentsSection from '$lib/components/CommentsSection.svelte';
	import * as Button from '$lib/components/ui/button';
	import { ArrowLeft, LoaderCircle } from '@lucide/svelte';

	let threadId = $derived(page.params.threadId);
	let thread = $state<Thread | null>(null);
	let posts = $state<Post[]>([]);
	let loading = $state(true);

	$effect(() => {
		if (!threadId) return;

		loading = true;
		Promise.all([getThreadById(threadId), getPostsByThreadId(threadId)])
			.then(([threadData, postsData]) => {
				thread = threadData;
				posts = postsData;
			})
			.finally(() => (loading = false));
	});
</script>

<div class="bg-background min-h-screen transition-colors">
	<Header showSearch={false} />

	<main class="border-border mx-auto min-h-screen max-w-2xl border-x">
		{#if loading}
			<div class="flex items-center justify-center py-12">
				<LoaderCircle class="text-primary h-6 w-6 animate-spin" />
			</div>
		{:else if !thread}
			<div class="p-4 text-center">
				<p class="text-muted-foreground">Thread not found.</p>
				<a href="/" class="text-primary mt-2 inline-block hover:underline"> Back to home </a>
			</div>
		{:else}
			<!-- Thread header -->
			<div class="border-border border-b p-4">
				<div class="flex items-center gap-3">
					<Button.Root href="/" variant="ghost" size="icon" class="text-foreground">
						<ArrowLeft size={20} />
					</Button.Root>
					<div>
						<h1 class="text-foreground text-xl font-semibold">{thread.title}</h1>
						<p class="text-muted-foreground mt-0.5 text-sm">{thread.description}</p>
					</div>
				</div>
			</div>

			<div class="relative">
				<div class="bg-primary/20 absolute bottom-0 left-[34px] top-0 w-0.5 sm:left-[38px]"></div>

				<!-- Thread posts -->
				{#each posts as post, index (post.id)}
					<div class="relative">
						<!-- Thread number badge -->
						<div class="absolute left-4 top-4 z-10 sm:left-5 sm:top-5">
							<div
								class="bg-primary text-primary-foreground flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium"
							>
								{index + 1}
							</div>
						</div>
						<PostCard
							post={{ ...post, thread: undefined }}
							showThreadLink={false}
							class="pl-14 sm:pl-16"
						/>
					</div>
				{/each}
			</div>

			{#if posts.length === 0}
				<div class="text-muted-foreground py-12 text-center">No posts in this thread yet.</div>
			{/if}

			<!-- Comments section for the thread -->
			{#if posts.length > 0}
				<div class="p-4 sm:p-5">
					<CommentsSection postId={thread.id} comments={[]} />
				</div>
			{/if}
		{/if}
	</main>
</div>
