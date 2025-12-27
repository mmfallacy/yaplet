<script lang="ts">
	import { Search, X } from '@lucide/svelte';
	import * as Input from '$lib/components/ui/input';
	import * as Button from '$lib/components/ui/button';
	import { cn } from '$lib/utils';

	let {
		onSearch,
		class: className
	} = $props<{
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
				<Search
					size={18}
					class="text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2"
				/>
				<Input.Root
					type="text"
					placeholder="Search posts..."
					bind:value={query}
					oninput={() => onSearch(query)}
					class="bg-muted/50 border-border focus:bg-background pl-10 pr-10"
					autofocus
				/>
				{#if query}
					<button
						type="button"
						onclick={handleClear}
						class="text-muted-foreground hover:text-foreground absolute right-3 top-1/2 -translate-y-1/2"
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
