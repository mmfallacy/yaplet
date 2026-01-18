<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Header from '$lib/components/Header.svelte';
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
		<div class="min-h-screen bg-background transition-colors">
			<Header showSearch={false} />

			<main class="mx-auto min-h-screen max-w-2xl border-x border-border">
				{@render children()}
			</main>
		</div>
	</div>
	<Toaster />
</TooltipProvider>
