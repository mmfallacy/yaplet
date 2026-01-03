<script lang="ts">
	import { marked } from 'marked';
	import DOMPurify from 'dompurify';
	import { browser } from '$app/environment';
	import { cn } from '$lib/utils';
	import { MessageCircle } from 'lucide-static';

	let { content, class: className } = $props<{
		content: string;
		class?: string;
	}>();

	const renderer = new marked.Renderer();

	renderer.link = function ({ href, title, text }) {
		switch (true) {
			case href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:'):
				return `<a href="${href}" title="${title || ''}" target="_blank" rel="noopener noreferrer" class="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors">${text}</a>`;
			default:
				return ` <a href="${href}" title="${title || ''} "class="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-sm text-primary transition-colors hover:bg-primary/20 [&>svg]:size-3" >
				${MessageCircle}
				${text}
				</a>
					`;
		}
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
	<!-- renderedHtml is sanitized by DOMPurify prior to rendering -->
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html renderedHtml}
</div>
