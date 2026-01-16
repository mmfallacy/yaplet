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
				return `<a href="${href}" onclick="event.stopPropagation()" title="${title || ''}" target="_blank" rel="noopener noreferrer" class="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors">${text}</a>`;
			default:
				return `<a href="${href}" onclick="event.stopPropagation()" title="${title || ''}" onclick="location.reload();" class="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-sm text-primary transition-colors hover:bg-primary/20 [&>svg]:size-3" >
				${MessageCircle}
				${text}
				</a>
					`;
		}
	};
	renderer.image = () => {
		console.warn('ContentError: Posts cannot contain images');
		return '';
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
				FORBID_TAGS: ['script', 'iframe', 'object', 'embed'],
				ALLOWED_TAGS: [
					'u',
					's',
					'del',
					'ins',
					'sub',
					'sup',
					'h1',
					'h2',
					'h3',
					'h4',
					'h5',
					'h6',
					'p',
					'br',
					'hr',
					'strong',
					'em',
					'strong',
					'b',
					'i',
					'code',
					'pre',
					'a',
					'ul',
					'ol',
					'li',
					'blockquote',
					'figure',
					'figcaption',
					'table',
					'thead',
					'tbody',
					'tr',
					'th',
					'td',
					'img',
					'div',
					'span'
				]
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
