<script lang="ts">
	import { marked } from 'marked';
	import DOMPurify from 'dompurify';
	import { browser } from '$app/environment';
	import { cn } from '$lib/utils';

	let {
		content,
		class: className
	} = $props<{
		content: string;
		class?: string;
	}>();

	const renderer = new marked.Renderer();
	renderer.link = ({ href, title, text }) => {
		return `<a href="${href}" title="${title || ''}" target="_blank" rel="noopener noreferrer" class="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors">${text}</a>`;
	};
	renderer.image = ({ href, title, text }) => {
		return `<img src="${href}" alt="${text || ''}" title="${title || ''}" class="rounded-lg max-w-full h-auto my-2" loading="lazy" />`;
	};

	let renderedHtml = $derived.by(() => {
		const rawHtml = marked.parse(content, {
			renderer,
			gfm: true,
			breaks: true
		}) as string;

		if (browser) {
			return DOMPurify.sanitize(rawHtml, {
				ADD_ATTR: ['target', 'rel'],
				FORBID_TAGS: ['script', 'iframe', 'object', 'embed']
			});
		}
		return rawHtml;
	});
</script>

<div class={cn('prose-journal', className)}>
	{@html renderedHtml}
</div>
