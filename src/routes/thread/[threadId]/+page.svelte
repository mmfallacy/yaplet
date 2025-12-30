<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { getThreadById } from '$lib/thread';
	import { getPostsByThreadId } from '$lib/post';
	import type { Thread, Post } from '$lib/types';
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

<div class="min-h-screen bg-background transition-colors">
	<Header showSearch={false} />

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
			<!-- Thread header -->
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

			<div class="relative">
				<div class="absolute top-0 bottom-0 left-[34px] w-0.5 bg-primary/20 sm:left-[38px]"></div>

				<!-- Thread posts -->
				{#each posts as post, index (post.id)}
					<div class="relative">
						<!-- Thread number badge -->
						<div class="absolute top-4 left-4 z-10 sm:top-5 sm:left-5">
							<div
								class="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground"
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
				<div class="py-12 text-center text-muted-foreground">No posts in this thread yet.</div>
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
