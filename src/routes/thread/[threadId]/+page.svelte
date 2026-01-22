<script lang="ts">
	import { resolve } from '$app/paths';
	import PostCard from '$lib/features/post/PostCard.svelte';
	import * as Button from '$lib/components/ui/button';
	import { ArrowLeft } from '@lucide/svelte';

	const { data } = $props();
	const { thread, posts } = $derived(data);
	const filtered = $derived(posts.filter((entry) => entry.ok).map((entry) => entry.value));
</script>

<main class="mx-auto min-h-screen max-w-2xl border-x border-border">
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

		{#each filtered as post, index (post.id)}
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
					<PostCard {post} href={`/thread/${thread.id}/${post.id}`} />
				</div>
			</div>
		{/each}
	</div>

	{#if posts.length === 0}
		<div class="py-12 text-center text-muted-foreground">No posts in this thread yet.</div>
	{/if}
</main>
