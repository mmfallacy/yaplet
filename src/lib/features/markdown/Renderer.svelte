<script lang="ts">
	import DOMPurify from 'dompurify';
	import { cn } from '$lib/utils';
	import { onMount } from 'svelte';
	import { DOMPURIFY_CONFIG, uponSanitizeAttributeHook } from './purify';

	let { content, class: className }: { content: string; class?: string } = $props();

	// Render straight html content from props (Assumption: content is from server)
	let renderedHtml = $derived(content);

	// On mount, sanitize again for good measures
	onMount(function () {
		DOMPurify.addHook('uponSanitizeAttribute', uponSanitizeAttributeHook);
		renderedHtml = DOMPurify.sanitize(renderedHtml, DOMPURIFY_CONFIG);
	});
</script>

<div class={cn('prose-journal', className)}>
	<!-- renderedHtml is sanitized by DOMPurify prior to rendering -->
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html renderedHtml}
</div>
