<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { Toaster } from '$lib/components/ui/sonner';
	import { TooltipProvider } from '$lib/components/ui/tooltip';
	import { theme } from '$lib/hooks/theme.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<TooltipProvider>
	<div class="min-h-screen bg-background text-foreground transition-colors">
		{@render children()}
	</div>
	<Toaster />
</TooltipProvider>
