<script lang="ts">
	import { resolve } from '$app/paths';
	import PostCard from '$lib/features/post/PostCard.svelte';
	import * as Button from '$lib/components/ui/button';
	import { ArrowLeft } from '@lucide/svelte';
	import type { Post } from '$lib/shared/types';

	let {
		data
	}: {
		data: {
			threadId: string;
			post: Post;
		};
	} = $props();
</script>

<main class="mx-auto min-h-screen max-w-2xl border-x border-border">
	<div class="border-b border-border p-4">
		<div class="flex items-center gap-3">
			<Button.Root
				href={resolve(`/thread/${data.threadId}`)}
				variant="ghost"
				size="icon"
				class="text-foreground"
			>
				<ArrowLeft size={20} />
			</Button.Root>
			<h1 class="text-xl font-semibold text-foreground">Post</h1>
		</div>
	</div>

	<PostCard post={data.post} />
</main>
