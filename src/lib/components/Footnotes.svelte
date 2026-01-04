<script lang="ts">
	import { marked } from 'marked';
	import DOMPurify from 'dompurify';
	import { browser } from '$app/environment';
	import { cn } from '$lib/utils';

	let {
		footnotes,
		order = [],
		class: className
	} = $props<{
		footnotes: Record<string, string>;
		order?: string[];
		class?: string;
	}>();

	const footnoteRenderer = new marked.Renderer();

	footnoteRenderer.link = function ({ href, title, text }) {
		return `<a href="${href}" title="${title || ''}" target="_blank" rel="noopener noreferrer" class="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors">${text}</a>`;
	};

	function renderInlineMarkdown(text: string): string {
		const rawHtml = marked.parse(text, {
			renderer: footnoteRenderer,
			gfm: true,
			breaks: true
		}) as string;

		if (browser) {
			return DOMPurify.sanitize(rawHtml, {
				ADD_ATTR: ['target', 'rel'],
				ALLOWED_TAGS: ['u', 's', 'del', 'ins', 'sub', 'sup', 'strong', 'em', 'b', 'i', 'a', 'span']
			});
		}
		return rawHtml;
	}

	let orderedEntries = $derived.by(() => {
		const keys = order.length > 0 ? order : Object.keys(footnotes);
		return keys
			.filter((k: string) => footnotes[k])
			.map((k: string) => [k, renderInlineMarkdown(footnotes[k])] as [string, string]);
	});
</script>

{#if orderedEntries.length > 0}
	<section class={cn('mt-4 border-t border-border pt-4', className)}>
		<ol class="list-inside list-decimal space-y-2 text-sm text-muted-foreground">
			{#each orderedEntries as [key, renderedValue], index (key)}
				<li id="fn{index + 1}" class="pl-1">
					<span class="prose-journal inline leading-relaxed text-foreground"
						>{@html renderedValue}</span
					>
				</li>
			{/each}
		</ol>
	</section>
{/if}
