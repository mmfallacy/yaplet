<script lang="ts">
	import { resolve } from '$app/paths';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Dialog as DialogPrimitive } from 'bits-ui';
	import XIcon from '@lucide/svelte/icons/x';
	import ChevronLeftIcon from '@lucide/svelte/icons/chevron-left';
	import ChevronRightIcon from '@lucide/svelte/icons/chevron-right';
	import { cn, stopPropagation } from '$lib/utils';

	let { images, class: className } = $props<{
		images: string[];
		class?: string;
	}>();

	let selectedIndex = $state<number | null>(null);
	let dialogOpen = $derived(selectedIndex !== null);

	let currentImage = $derived(selectedIndex !== null ? images[selectedIndex] : null);
	let hasNext = $derived(selectedIndex !== null && selectedIndex < images.length - 1);
	let hasPrev = $derived(selectedIndex !== null && selectedIndex > 0);

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

	function handleNext() {
		if (hasNext && selectedIndex !== null) {
			selectedIndex++;
		}
	}

	function handlePrev() {
		if (hasPrev && selectedIndex !== null) {
			selectedIndex--;
		}
	}

	function handleClose() {
		selectedIndex = null;
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'ArrowRight' && hasNext) {
			handleNext();
		} else if (e.key === 'ArrowLeft' && hasPrev) {
			handlePrev();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

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
				onclick={() => (selectedIndex = index)}
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

<Dialog.Root bind:open={dialogOpen}>
	<Dialog.Portal>
		<Dialog.Overlay class="fixed inset-0 z-40 bg-black/90" />
		<DialogPrimitive.Content
			class="fixed top-[50%] left-[50%] z-50 translate-x-[-50%] translate-y-[-50%]"
		>
			<button
				type="button"
				class="absolute top-0 right-0 z-50 -translate-y-[calc(100%+16px)] rounded-full bg-black/30 p-2 text-white transition-colors hover:bg-black/50"
				onclick={handleClose}
			>
				<XIcon class="size-6" />
				<span class="sr-only">Close</span>
			</button>

			{#if hasPrev}
				<button
					type="button"
					class="absolute top-1/2 left-0 z-50 -translate-x-[calc(100%+16px)] -translate-y-1/2 rounded-full bg-black/30 p-3 text-white transition-colors hover:bg-black/50"
					onclick={handlePrev}
				>
					<ChevronLeftIcon class="size-6" />
					<span class="sr-only">Previous image</span>
				</button>
			{/if}

			<img
				src={currentImage ? getImageSrc(currentImage) : ''}
				alt="Full size image"
				class="max-h-[90vh] max-w-[90vw] object-contain"
			/>

			{#if hasNext}
				<button
					type="button"
					class="absolute top-1/2 right-0 z-50 translate-x-[calc(100%+16px)] -translate-y-1/2 rounded-full bg-black/30 p-3 text-white transition-colors hover:bg-black/50"
					onclick={handleNext}
				>
					<ChevronRightIcon class="size-6" />
					<span class="sr-only">Next image</span>
				</button>
			{/if}

			{#if images.length > 1 && selectedIndex !== null}
				<div
					class="absolute bottom-0 left-1/2 z-50 -translate-x-1/2 translate-y-[calc(100%+16px)] rounded-full bg-black/30 px-3 py-1 text-sm text-white"
				>
					{selectedIndex + 1} / {images.length}
				</div>
			{/if}
		</DialogPrimitive.Content>
	</Dialog.Portal>
</Dialog.Root>
