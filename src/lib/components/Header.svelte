<script lang="ts">
	import { Leaf } from '@lucide/svelte';
	import { resolve } from '$app/paths';
	import ThemeToggle from './ThemeToggle.svelte';
	import SearchFilter from './SearchFilter.svelte';
	import UserMenu from './UserMenu.svelte';

	let { onSearch, showSearch = true } = $props<{
		onSearch?: (query: string) => void;
		showSearch?: boolean;
	}>();
</script>

<header
	class="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md transition-colors"
>
	<div class="mx-auto flex h-14 max-w-2xl items-center justify-between px-4">
		<a href={resolve('/')} class="flex items-center gap-2 transition-opacity hover:opacity-80">
			<div class="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
				<Leaf size={18} class="text-primary-foreground" />
			</div>
			<span class="hidden text-lg font-semibold text-foreground sm:block"> Journal </span>
		</a>

		<div class="flex items-center gap-2">
			{#if showSearch && onSearch}
				<SearchFilter {onSearch} />
			{/if}
			<ThemeToggle />
			<UserMenu />
		</div>
	</div>
</header>
