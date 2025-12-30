<script lang="ts">
	import { ChevronRight } from '@lucide/svelte';
	import type { PostWithThread } from '$lib/types';
	import { resolve } from '$app/paths';
	import MarkdownRenderer from './MarkdownRenderer.svelte';
	import PostImages from './PostImages.svelte';
	import PostActions from './PostActions.svelte';
	import PostHeader from './PostHeader.svelte';
	import { cn } from '$lib/utils';

	let {
		post,
		totalPosts,
		class: className
	} = $props<{
		post: PostWithThread;
		totalPosts: number;
		class?: string;
	}>();
</script>

<article
	class={cn(
		'transition-theme animate-fade-in border-b border-border p-4 hover:bg-muted/30 sm:p-5',
		className
	)}
>
	<div class="grid grid-cols-[auto_1fr] gap-x-3">
		<PostHeader
			createdAt={post.createdAt}
			threadTitle={post.thread?.title}
			threadId={post.threadId}
			postCount={totalPosts}
		/>

		<div class="col-start-2 min-w-0">
			<!-- Content -->
			<div class="mt-2 text-foreground">
				<MarkdownRenderer content={post.content} />
			</div>

			<!-- Images -->
			{#if post.images.length > 0}
				<PostImages images={post.images} class="mt-3" />
			{/if}

			<!-- Actions -->
			<PostActions postId={post.id} initialLikes={post.likes} />

			<!-- View thread link -->
			{#if post.thread && totalPosts > 1}
				<a
					href={resolve(`/thread/${post.threadId}`)}
					class="group mt-3 flex items-center gap-1 text-sm text-primary hover:underline"
				>
					<span>Show this thread</span>
					<ChevronRight size={16} class="transition-transform group-hover:translate-x-0.5" />
				</a>
			{/if}
		</div>
	</div>
</article>
