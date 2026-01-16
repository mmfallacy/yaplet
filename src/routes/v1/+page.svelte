<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import PostCard from '$lib/features/post/PostCard.svelte';
	import { LoaderCircle } from '@lucide/svelte';

	const { data } = $props();
	const { stream } = $derived(data);
</script>

<div class="min-h-screen bg-background transition-colors">
	<Header />

	<main class="mx-auto min-h-screen max-w-2xl border-x border-border">
		<!-- Page title -->
		<div class="border-b border-border p-4">
			<h1 class="text-xl font-semibold text-foreground">Home</h1>
		</div>

		<div class="contents">
			{#await stream}
				<div class="flex items-center justify-center py-12">
					<LoaderCircle class="h-6 w-6 animate-spin text-primary" />
				</div>
			{:then data}
				{@const entries = data.feed.filter((entry) => entry.ok).map((entry) => entry.value)}
				{#each entries as entry (entry.id)}
					{#if entry.type === 'thread'}
						<h1>Thread: {entry.id}-{entry.preview.id}</h1>
						<p>{entry.preview.content}</p>
					{:else}
						<PostCard post={entry} />
					{/if}
				{/each}
			{/await}
		</div>
	</main>
</div>
