<script lang="ts">
	import { Heart, MessageCircle, Share2 } from '@lucide/svelte';
	import { cn, stopPropagation } from '$lib/utils';
	import { toast } from 'svelte-sonner';

	let {
		postId,
		commentCount = 0,
		class: className
	} = $props<{
		postId: string;
		initialLikes: number;
		commentCount?: number;
		onCommentClick?: () => void;
		class?: string;
	}>();

	let likes = 0;

	async function handleShare(e: MouseEvent) {
		e.preventDefault();
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
			toast.success('Link copied!');
		}
	}
</script>

<div class={cn('mt-3 flex items-center gap-6', className)}>
	<!-- Comments -->
	<button
		disabled={true}
		class="group flex items-center gap-1.5 text-muted-foreground disabled:text-shadow-muted-foreground"
	>
		<MessageCircle size={18} />
		<span class="text-sm">{commentCount}</span>
	</button>

	<!-- Likes -->
	<button
		disabled={true}
		class={cn(
			'group flex items-center gap-1.5 text-muted-foreground transition-colors disabled:text-shadow-muted-foreground'
		)}
	>
		<Heart size={18} />
		<span class="text-sm">{likes}</span>
	</button>

	<!-- Share -->
	<div class="relative">
		<button
			onclick={stopPropagation(handleShare)}
			class="group flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-primary"
		>
			<Share2 size={18} class="transition-transform group-hover:scale-110" />
		</button>
	</div>
</div>
