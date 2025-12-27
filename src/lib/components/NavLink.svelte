<script lang="ts">
	import { page } from '$app/state';
	import { cn } from '$lib/utils';

	let {
		href,
		class: className,
		activeClass,
		children,
		...props
	} = $props<{
		href: string;
		class?: string;
		activeClass?: string;
		children?: import('svelte').Snippet;
		[key: string]: any;
	}>();

	let isActive = $derived(page.url.pathname === href || (page.url.pathname.startsWith(href) && href !== '/'));
</script>

<a {href} class={cn(className, isActive && activeClass)} {...props}>
	{@render children?.()}
</a>
