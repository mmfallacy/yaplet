<script lang="ts">
	import { ChevronRight, MessageCircle } from '@lucide/svelte';
	import type { PostWithThread } from '$lib/types';
	import { formatDate } from '$lib/utils';
	import MarkdownRenderer from './MarkdownRenderer.svelte';
	import PostImages from './PostImages.svelte';
	import PostActions from './PostActions.svelte';
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
	<div class="flex gap-3">
		<!-- Avatar -->
		<div class="flex-shrink-0">
			<div
				class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 sm:h-12 sm:w-12"
			>
				<span class="text-sm font-medium text-primary sm:text-base">J</span>
			</div>
		</div>

		<div class="min-w-0 flex-1">
			<!-- Header -->
			<div class="flex flex-wrap items-center gap-2">
				<span class="font-medium text-foreground">Journal</span>
				<span class="text-muted-foreground">·</span>
				<time class="text-sm text-muted-foreground" datetime={post.createdAt}>
					{formatDate(post.createdAt)}
				</time>
			</div>

			<!-- Thread badge - clickable -->
			{#if post.thread}
				<a
					href={`/thread/${post.threadId}`}
					class="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary transition-colors hover:bg-primary/20"
				>
					<MessageCircle size={12} />
					<span>{post.thread.title}</span>
					<span class="text-primary/70">· {totalPosts} posts</span>
				</a>
			{/if}

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
					href={`/thread/${post.threadId}`}
					class="group mt-3 flex items-center gap-1 text-sm text-primary hover:underline"
				>
					<span>Show this thread</span>
					<ChevronRight size={16} class="transition-transform group-hover:translate-x-0.5" />
				</a>
			{/if}
		</div>
	</div>
</article>
