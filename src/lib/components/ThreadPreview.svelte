<script lang="ts">
	import { ChevronRight, MessageCircle } from '@lucide/svelte';
	import type { PostWithThread } from '$lib/types/post';
	import { formatDate } from '$lib/posts';
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
		'border-border transition-theme hover:bg-muted/30 animate-fade-in border-b p-4 sm:p-5',
		className
	)}
>
	<div class="flex gap-3">
		<!-- Avatar -->
		<div class="flex-shrink-0">
			<div class="bg-primary/20 flex h-10 w-10 items-center justify-center rounded-full sm:h-12 sm:w-12">
				<span class="text-primary text-sm font-medium sm:text-base">J</span>
			</div>
		</div>

		<div class="flex-1 min-w-0">
			<!-- Header -->
			<div class="flex flex-wrap items-center gap-2">
				<span class="text-foreground font-medium">Journal</span>
				<span class="text-muted-foreground">·</span>
				<time class="text-muted-foreground text-sm" datetime={post.createdAt}>
					{formatDate(post.createdAt)}
				</time>
			</div>

			<!-- Thread badge - clickable -->
			{#if post.thread}
				<a
					href={`/thread/${post.threadId}`}
					class="bg-primary/10 text-primary mt-1.5 inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs transition-colors hover:bg-primary/20"
				>
					<MessageCircle size={12} />
					<span>{post.thread.title}</span>
					<span class="text-primary/70">· {totalPosts} posts</span>
				</a>
			{/if}

			<!-- Content -->
			<div class="text-foreground mt-2">
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
					class="text-primary group mt-3 flex items-center gap-1 text-sm hover:underline"
				>
					<span>Show this thread</span>
					<ChevronRight size={16} class="transition-transform group-hover:translate-x-0.5" />
				</a>
			{/if}
		</div>
	</div>
</article>
