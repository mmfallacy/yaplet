<script lang="ts">
	import type { Post } from '$lib/shared/types';
	import { resolve } from '$app/paths';
	import Renderer from '$lib/features/markdown/Renderer.svelte';
	import PostImages from './PostImages.svelte';
	import PostActions from './PostActions.svelte';
	import Footnotes from './Footnotes.svelte';
	import PostHeader from './PostHeader.svelte';
	import { cn } from '$lib/utils';
	import { goto } from '$app/navigation';

	type ValidHref = `/post/${string}` | `/thread/${string}/${string}`;

	let {
		post,
		href,
		showActions = true,
		class: className
	}: {
		post: Post;
		href?: ValidHref;
		showActions?: boolean;
		class?: string;
	} = $props();
</script>

<article
	class={cn(
		'transition-theme animate-fade-in border-b border-border p-4 hover:bg-muted/30 sm:p-5',
		className
	)}
>
	<button
		role="link"
		onclick={() => href && goto(resolve(href))}
		class={cn('grid grid-cols-[auto_1fr] gap-x-3 text-left', href && 'cursor-pointer')}
	>
		<PostHeader createdAt={post.createdAt.toISOString()} />

		<div class="col-start-2 min-w-0">
			<!-- Content -->
			<div class="text-foreground">
				<Renderer content={post.content} />
			</div>

			<!-- Footnotes -->
			{#if post.footnotes}
				<Footnotes footnotes={post.footnotes} prefix={post.id} order={post.footnotes_order} />
			{/if}

			<!-- Images -->
			{#if post.images?.length > 0}
				<PostImages images={post.images} class="mt-3" />
			{/if}

			<!-- Actions -->
			{#if showActions}
				<PostActions postId={post.id} initialLikes={post.likes ?? 0} />
			{/if}

			<!-- Tags -->
			{#if post.tags?.length > 0}
				<div class="mt-3 flex flex-wrap gap-1.5">
					{#each post.tags as tag (tag)}
						<span
							class="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground"
						>
							#{tag}
						</span>
					{/each}
				</div>
			{/if}
		</div>
	</button>
</article>
