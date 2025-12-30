<script lang="ts">
	import { Search, X } from '@lucide/svelte';
	import * as Input from '$lib/components/ui/input';
	import * as Button from '$lib/components/ui/button';
	import { cn } from '$lib/utils';

	let { onSearch, class: className } = $props<{
		onSearch: (query: string) => void;
		class?: string;
	}>();

	let query = $state('');
	let isExpanded = $state(false);

	function handleSubmit(e: Event) {
		e.preventDefault();
		onSearch(query);
	}

	function handleClear() {
		query = '';
		onSearch('');
	}
</script>

<form onsubmit={handleSubmit} class={cn('relative', className)}>
	<div class="flex items-center gap-2">
		{#if !isExpanded}
			<Button.Root
				type="button"
				variant="ghost"
				size="icon"
				onclick={() => (isExpanded = true)}
				class="text-muted-foreground hover:text-foreground"
			>
				<Search size={20} />
			</Button.Root>
		{:else}
			<div class="relative flex-1">
				<Search size={18} class="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground" />
				<Input.Root
					type="text"
					placeholder="Search posts..."
					bind:value={query}
					oninput={() => onSearch(query)}
					class="border-border bg-muted/50 pr-10 pl-10 focus:bg-background"
					autofocus
				/>
				{#if query}
					<button
						type="button"
						onclick={handleClear}
						class="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
					>
						<X size={16} />
					</button>
				{/if}
			</div>
			<Button.Root
				type="button"
				variant="ghost"
				size="sm"
				onclick={() => {
					isExpanded = false;
					handleClear();
				}}
				class="text-muted-foreground"
			>
				Cancel
			</Button.Root>
		{/if}
	</div>
</form>
