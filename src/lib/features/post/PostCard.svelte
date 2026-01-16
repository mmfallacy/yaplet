<script lang="ts">
	import { SvelteMap } from 'svelte/reactivity';
	import type { Post } from '$lib/shared/types';
	import { resolve } from '$app/paths';
	import Renderer from '$lib/features/markdown/Renderer.svelte';
	import PostImages from './PostImages.svelte';
	import PostActions from './PostActions.svelte';
	import Footnotes from '$lib/components/Footnotes.svelte';
	import PostHeader from './PostHeader.svelte';
	import { cn } from '$lib/utils';
	import { goto } from '$app/navigation';

	let {
		post,
		showActions = true,
		class: className
	} = $props<{
		post: Post;
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

	const preprocessResult = $derived.by(() => preprocessFootnotes(post.content, post.footnotes));
	const processedContent = $derived(preprocessResult.processed);
	const referencedFootnoteKeys = $derived(preprocessResult.referencedKeys);
</script>

<article
	class={cn(
		'transition-theme animate-fade-in border-b border-border p-4 hover:bg-muted/30 sm:p-5',
		className
	)}
>
	<button
		role="link"
		onclick={() => goto(resolve(`/post/${post.id}`))}
		class="block grid cursor-pointer grid-cols-[auto_1fr] gap-x-3 text-left"
	>
		<PostHeader createdAt={post.createdAt.toISOString()} />

		<div class="col-start-2 min-w-0">
			<!-- Content -->
			<div class="text-foreground">
				<Renderer content={processedContent} />
			</div>

			<!-- Footnotes -->
			{#if post.footnotes && referencedFootnoteKeys.length > 0}
				<Footnotes footnotes={post.footnotes} order={referencedFootnoteKeys} />
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
