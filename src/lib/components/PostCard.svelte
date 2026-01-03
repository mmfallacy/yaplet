<script lang="ts">
	import { SvelteMap } from 'svelte/reactivity';
	import type { PostWithThread } from '$lib/types';
	import { resolve } from '$app/paths';
	import MarkdownRenderer from './MarkdownRenderer.svelte';
	import PostImages from './PostImages.svelte';
	import PostActions from './PostActions.svelte';
	import Footnotes from './Footnotes.svelte';
	import PostHeader from './PostHeader.svelte';
	import { cn } from '$lib/utils';

	let {
		post,
		showActions = true,
		class: className
	} = $props<{
		post: PostWithThread;
		showActions?: boolean;
		class?: string;
	}>();

	function preprocessFootnotes(
		text: string,
		footnotes?: Record<string, string>
	): {
		processed: string;
		referencedKeys: string[];
	} {
		if (!footnotes) {
			return { processed: text, referencedKeys: [] };
		}

		const footnotePattern = /\[\^([^\]]+)\]/g;
		const referencedKeys: string[] = [];
		const keyToNumber = new SvelteMap<string, number>();

		let match: RegExpExecArray | null;
		let result = text;
		let offset = 0;

		while ((match = footnotePattern.exec(text)) !== null) {
			const [fullMatch, key] = match;
			const matchIndex = match.index + offset;

			if (Object.hasOwn(footnotes, key)) {
				if (!keyToNumber.has(key)) {
					const num = keyToNumber.size + 1;
					keyToNumber.set(key, num);
					referencedKeys.push(key);
				}

				const num = keyToNumber.get(key)!;
				const replacement = `<sup><a href="#fn${num}" id="ref${num}" class="footnote-ref">[${num}]</a></sup>`;
				result =
					result.substring(0, matchIndex) +
					replacement +
					result.substring(matchIndex + fullMatch.length);
				offset += replacement.length - fullMatch.length;
			}
		}

		return { processed: result, referencedKeys };
	}

	let preprocessResult = $derived.by(() => preprocessFootnotes(post.content, post.footnotes));
	let processedContent = $derived(preprocessResult.processed);
	let referencedFootnoteKeys = $derived(preprocessResult.referencedKeys);
</script>

<article
	class={cn(
		'transition-theme animate-fade-in border-b border-border p-4 hover:bg-muted/30 sm:p-5',
		className
	)}
>
	<a href={resolve(`/post/${post.id}`)} class="block grid grid-cols-[auto_1fr] gap-x-3">
		<PostHeader
			createdAt={post.createdAt}
			threadTitle={post.thread?.title}
			threadId={post.threadId}
		/>

		<div class="col-start-2 min-w-0">
			<!-- Content -->
			<div class="text-foreground">
				<MarkdownRenderer content={processedContent} />
			</div>

			<!-- Footnotes -->
			{#if post.footnotes && referencedFootnoteKeys.length > 0}
				<Footnotes footnotes={post.footnotes} order={referencedFootnoteKeys} />
			{/if}

			<!-- Images -->
			{#if post.images.length > 0}
				<PostImages images={post.images} class="mt-3" />
			{/if}

			<!-- Actions -->
			{#if showActions}
				<PostActions postId={post.id} initialLikes={post.likes} />
			{/if}

			<!-- Tags -->
			{#if post.tags.length > 0}
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
	</a>
</article>
