<script lang="ts">
	import { Moon, Sun } from '@lucide/svelte';
	import { theme } from '$lib/hooks/theme.svelte';
	import * as Button from '$lib/components/ui/button';
</script>

<Button.Root
	variant="ghost"
	size="icon"
	onclick={() => theme.toggleTheme()}
	class="text-muted-foreground hover:text-foreground hover:bg-muted"
	aria-label={`Switch to ${theme.theme === 'dark' ? 'light' : 'dark'} mode`}
>
	{#if theme.theme === 'dark'}
		<Sun size={20} />
	{:else}
		<Moon size={20} />
	{/if}
</Button.Root>
