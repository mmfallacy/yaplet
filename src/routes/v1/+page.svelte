<script lang="ts">
	import Header from '$lib/components/Header.svelte';

	let { data } = $props();

	const entries = $derived(data.feed.filter((entry) => entry.ok).map((entry) => entry.value));
</script>

<div class="min-h-screen bg-background transition-colors">
	<Header />

	<main class="mx-auto min-h-screen max-w-2xl border-x border-border">
		<!-- Page title -->
		<div class="border-b border-border p-4">
			<h1 class="text-xl font-semibold text-foreground">Home</h1>
		</div>

		<div>
			{#each entries as entry (entry.id)}
				{#if entry.type === 'thread'}
					<h1>Thread: {entry.id}-{entry.preview.id}</h1>
					<p>{entry.preview.content}</p>
				{:else}
					<h1>Post: {entry.id}</h1>
					<p>{entry.content}</p>
				{/if}
			{/each}
		</div>
	</main>
</div>
