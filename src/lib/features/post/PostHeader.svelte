<script lang="ts">
	import { formatDate } from '$lib/utils';

	const USERNAME = 'mmfallacy';
	const GITHUB_LINK = 'https://www.github.com/mmfallacy';
	const AVATAR = 'https://avatars.githubusercontent.com/u/31348500';

	let { createdAt } = $props<{
		createdAt: string;
		threadTitle?: string;
		threadId?: string;
		postCount?: number;
	}>();
</script>

<a class="relative col-start-1 row-start-1 w-12 flex-shrink-0 self-start" href={GITHUB_LINK}>
	<img
		class="absolute flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 sm:h-12 sm:w-12"
		alt={`${USERNAME}'s GitHub avatar'`}
		src={AVATAR}
	/>
</a>

<div class="col-start-2 row-start-1 min-w-0">
	<div class="flex flex-wrap items-center gap-2">
		<a class="font-medium text-foreground" href={GITHUB_LINK}>{USERNAME}</a>
		<span class="text-muted-foreground">·</span>
		<time class="text-sm text-muted-foreground" datetime={createdAt}>
			{formatDate(createdAt)}
		</time>
	</div>
</div>
