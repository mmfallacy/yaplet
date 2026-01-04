<script lang="ts">
	import { cn } from '$lib/utils';

	let {
		footnotes,
		order = [],
		class: className
	} = $props<{
		footnotes: Record<string, string>;
		order?: string[];
		class?: string;
	}>();

	let orderedEntries = $derived.by(() => {
		const keys = order.length > 0 ? order : Object.keys(footnotes);
		return keys
			.filter((k: string) => footnotes[k])
			.map((k: string) => [k, footnotes[k]] as [string, string]);
	});
</script>

{#if orderedEntries.length > 0}
	<section class={cn('mt-4 border-t border-border pt-4', className)}>
		<ol class="list-inside list-decimal space-y-2 text-sm text-muted-foreground">
			{#each orderedEntries as [key, value], index (key)}
				<li id="fn{index + 1}" class="pl-1">
					<span class="text-foreground">{value}</span>
				</li>
			{/each}
		</ol>
	</section>
{/if}
