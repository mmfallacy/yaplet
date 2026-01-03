<script lang="ts">
	import { resolve } from '$app/paths';
	import * as Dialog from '$lib/components/ui/dialog';
	import XIcon from '@lucide/svelte/icons/x';
	import { cn } from '$lib/utils';

	let { images, class: className } = $props<{
		images: string[];
		class?: string;
	}>();

	let selectedImage = $state<string | null>(null);
	let dialogOpen = $derived(Boolean(selectedImage));

	let gridClass = $derived(
		{
			1: 'grid-cols-1',
			2: 'grid-cols-2',
			3: 'grid-cols-2',
			4: 'grid-cols-2'
		}[Math.min(images.length, 4) as 1 | 2 | 3 | 4]
	);

	function getImageSrc(image: string) {
		return image.startsWith('http') ? image : resolve(`/api/content/images/${image}`);
	}

	function handleClose() {
		selectedImage = null;
	}
</script>

{#if images.length > 0}
	<div class={cn('grid gap-1 overflow-hidden rounded-xl', gridClass, className)}>
		{#each images.slice(0, 4) as image, index (`${image}-${index}`)}
			{@const isSingle = images.length === 1}
			<button
				type="button"
				class={cn(
					'relative cursor-zoom-in overflow-hidden border-0 bg-muted p-0',
					isSingle ? 'aspect-auto max-h-[400px] w-full' : 'aspect-video',
					images.length === 3 && index === 0 && !isSingle && 'row-span-2 aspect-square'
				)}
				onclick={() => (selectedImage = image)}
			>
				<img
					src={getImageSrc(image)}
					alt={`Post image ${index + 1}`}
					class={cn(
						'h-full w-full object-cover',
						isSingle && 'h-auto max-h-[400px] w-full object-contain'
					)}
					loading="lazy"
				/>
			</button>
		{/each}
	</div>
{/if}

<Dialog.Root open={dialogOpen} onOpenChange={(open) => !open && handleClose()}>
	<Dialog.Content
		class="flex max-h-[90vh] max-w-[90vw] items-center justify-center border-0 bg-transparent p-2 shadow-none"
	>
		<div class="relative flex items-center justify-center">
			<button
				type="button"
				class="absolute end-2 top-2 z-10 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
				onclick={handleClose}
			>
				<XIcon class="size-4" />
				<span class="sr-only">Close</span>
			</button>
			<img
				src={selectedImage ? getImageSrc(selectedImage) : ''}
				alt="Full size image"
				class="max-h-[85vh] w-auto max-w-[85vw] object-contain"
			/>
		</div>
	</Dialog.Content>
</Dialog.Root>
