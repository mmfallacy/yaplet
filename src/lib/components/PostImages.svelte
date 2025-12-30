<script lang="ts">
	import { cn } from '$lib/utils';

	let { images, class: className } = $props<{
		images: string[];
		class?: string;
	}>();

	let gridClass = $derived(
		{
			1: 'grid-cols-1',
			2: 'grid-cols-2',
			3: 'grid-cols-2',
			4: 'grid-cols-2'
		}[Math.min(images.length, 4) as 1 | 2 | 3 | 4]
	);
</script>

{#if images.length > 0}
	<div class={cn('grid gap-1 overflow-hidden rounded-xl', gridClass, className)}>
		{#each images.slice(0, 4) as image, index}
			<div
				class={cn(
					'relative aspect-video bg-muted',
					images.length === 3 && index === 0 && 'row-span-2 aspect-square'
				)}
			>
				<img
					src={image.startsWith('http') ? image : `/images/${image}`}
					alt={`Post image ${index + 1}`}
					class="h-full w-full object-cover"
					loading="lazy"
				/>
			</div>
		{/each}
	</div>
{/if}
