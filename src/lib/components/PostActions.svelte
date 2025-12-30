<script lang="ts">
	import { Heart, MessageCircle, Share2 } from '@lucide/svelte';
	import { cn } from '$lib/utils';

	let {
		postId,
		initialLikes,
		commentCount = 0,
		onCommentClick,
		class: className
	} = $props<{
		postId: string;
		initialLikes: number;
		commentCount?: number;
		onCommentClick?: () => void;
		class?: string;
	}>();

	let likes = $state(initialLikes);
	let liked = $state(false);
	let showShareToast = $state(false);

	function handleLike() {
		liked = !liked;
		likes = liked ? likes + 1 : likes - 1;
	}

	async function handleShare() {
		const url = `${window.location.origin}/post/${postId}`;

		if (navigator.share) {
			try {
				await navigator.share({
					title: 'Check out this post',
					url
				});
			} catch {
				// User cancelled or share failed
			}
		} else {
			await navigator.clipboard.writeText(url);
			showShareToast = true;
			setTimeout(() => (showShareToast = false), 2000);
		}
	}
</script>

<div class={cn('mt-3 flex items-center gap-6', className)}>
	<!-- Comments -->
	<button
		onclick={onCommentClick}
		class="group flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-primary"
	>
		<MessageCircle size={18} class="transition-transform group-hover:scale-110" />
		<span class="text-sm">{commentCount}</span>
	</button>

	<!-- Likes -->
	<button
		onclick={handleLike}
		class={cn(
			'group flex items-center gap-1.5 transition-colors',
			liked ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'
		)}
	>
		<Heart
			size={18}
			class={cn('transition-transform group-hover:scale-110', liked && 'fill-current')}
		/>
		<span class="text-sm">{likes}</span>
	</button>

	<!-- Share -->
	<div class="relative">
		<button
			onclick={handleShare}
			class="group flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-primary"
		>
			<Share2 size={18} class="transition-transform group-hover:scale-110" />
		</button>
		{#if showShareToast}
			<div
				class="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 rounded bg-foreground px-2 py-1 text-xs whitespace-nowrap text-background"
			>
				Link copied!
			</div>
		{/if}
	</div>
</div>
