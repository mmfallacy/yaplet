<script lang="ts">
	import type { ThreadWithPreview } from '$lib/shared/types';
	import PostCard from '$lib/features/post/PostCard.svelte';
	import { resolve } from '$app/paths';
	import { ChevronRight } from '@lucide/svelte';

	let {
		thread,
		class: className
	}: {
		thread: ThreadWithPreview;
		class?: string;
	} = $props();
</script>

<article class={className}>
	<a href={resolve(`/thread/${thread.id}`)} class="block transition-opacity hover:opacity-80">
		<div class="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
			<span class="font-medium text-primary">{thread.title}</span>
			<span>·</span>
			<span>{thread.posts.length} {thread.posts.length === 1 ? 'post' : 'posts'}</span>
		</div>
	</a>

	<PostCard post={thread.preview} showActions={false} />

	<a
		href={resolve(`/thread/${thread.id}`)}
		class="mt-2 flex items-center gap-1 text-sm text-primary hover:underline"
	>
		<span>View thread</span>
		<ChevronRight size={16} />
	</a>
</article>
