<script lang="ts">
	import { MessageCircle } from '@lucide/svelte';
	import { formatDate } from '$lib/utils';
	import { resolve } from '$app/paths';

	const USERNAME = 'mmfallacy';
	const GITHUB_LINK = 'https://www.github.com/mmfallacy';
	const AVATAR = 'https://avatars.githubusercontent.com/u/31348500';

	let { createdAt, threadTitle, threadId, postCount } = $props<{
		createdAt: string;
		threadTitle?: string;
		threadId?: string;
		postCount?: number;
	}>();
</script>

<div class="flex gap-3">
	<a class="flex-shrink-0" href={GITHUB_LINK}>
		<img
			class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 sm:h-12 sm:w-12"
			alt={`${USERNAME}'s GitHub avatar'`}
			src={AVATAR}
		/>
	</a>

	<div class="min-w-0 flex-1">
		<div class="flex flex-wrap items-center gap-2">
			<a class="font-medium text-foreground" href={GITHUB_LINK}>{USERNAME}</a>
			<span class="text-muted-foreground">·</span>
			<time class="text-sm text-muted-foreground" datetime={createdAt}>
				{formatDate(createdAt)}
			</time>
		</div>

		{#if threadId}
			<a
				href={resolve(`/thread/${threadId}`)}
				class="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary transition-colors hover:bg-primary/20"
			>
				<MessageCircle size={12} />
				<span>{threadTitle}</span>
				{#if postCount !== undefined}
					<span class="text-primary/70">· {postCount} posts</span>
				{/if}
			</a>
		{/if}
	</div>
</div>
