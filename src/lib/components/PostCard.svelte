<script lang="ts">
	import { MessageCircle } from '@lucide/svelte';
	import type { PostWithThread } from '$lib/types';
	import { formatDate } from '$lib/utils';
	import { resolve } from '$app/paths';
	import MarkdownRenderer from './MarkdownRenderer.svelte';
	import PostImages from './PostImages.svelte';
	import PostActions from './PostActions.svelte';
	import { cn } from '$lib/utils';

	let {
		post,
		showThreadLink = true,
		showActions = true,
		class: className
	} = $props<{
		post: PostWithThread;
		showThreadLink?: boolean;
		showActions?: boolean;
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
		<!-- Avatar placeholder - olive accent -->
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

			<!-- Thread badge -->
			{#if showThreadLink && post.thread}
				<a
					href={resolve(`/thread/${post.threadId}`)}
					class="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary transition-colors hover:bg-primary/20"
				>
					<MessageCircle size={12} />
					<span>{post.thread.title}</span>
					{#if post.threadOrder}
						<span class="text-primary/70">#{post.threadOrder}</span>
					{/if}
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
			{#if showActions}
				<PostActions postId={post.id} initialLikes={post.likes} />
			{/if}
		</div>
	</div>
</article>
