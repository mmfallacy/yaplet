<script lang="ts">
	import type { Comment } from '$lib/types';
	import { formatDate } from '$lib/utils';
	import * as Button from '$lib/components/ui/button';
	import { Textarea } from '$lib/components/ui/textarea';
	import { auth } from '$lib/hooks/auth.svelte';

	let { postId, comments, onAddComment } = $props<{
		postId: string;
		comments: Comment[];
		onAddComment?: (content: string) => void;
	}>();

	let newComment = $state('');
	let isSubmitting = $state(false);

	async function handleSubmit(e: Event) {
		e.preventDefault();
		if (!newComment.trim() || !auth.isAuthenticated) return;

		isSubmitting = true;
		// Stub: In a real app, this would call an API
		onAddComment?.(newComment);
		newComment = '';
		isSubmitting = false;
	}
</script>

<div class="mt-4 border-t border-border pt-4">
	<h3 class="mb-4 text-sm font-medium text-foreground">
		Comments ({comments.length})
	</h3>

	<!-- Comment form -->
	{#if auth.isAuthenticated}
		<form onsubmit={handleSubmit} class="mb-4">
			<div class="flex gap-3">
				<div class="flex-shrink-0">
					<div class="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
						<span class="text-xs font-medium text-primary">
							{auth.user?.name?.charAt(0) || 'U'}
						</span>
					</div>
				</div>
				<div class="flex-1">
					<Textarea
						bind:value={newComment}
						placeholder="Write a comment..."
						class="min-h-[80px] resize-none bg-muted/50"
						maxlength={280}
					/>
					<div class="mt-2 flex items-center justify-between">
						<span class="text-xs text-muted-foreground">
							{newComment.length}/280
						</span>
						<Button.Root type="submit" size="sm" disabled={!newComment.trim() || isSubmitting}>
							{isSubmitting ? 'Posting...' : 'Comment'}
						</Button.Root>
					</div>
				</div>
			</div>
		</form>
	{:else}
		<div class="mb-4 rounded-lg bg-muted/50 p-3 text-center">
			<p class="text-sm text-muted-foreground">
				<a href="/login" class="text-primary hover:underline"> Sign in </a>
				to leave a comment
			</p>
		</div>
	{/if}

	<!-- Comments list -->
	<div class="space-y-4">
		{#if comments.length === 0}
			<p class="py-4 text-center text-sm text-muted-foreground">
				No comments yet. Be the first to comment!
			</p>
		{:else}
			{#each comments as comment (comment.id)}
				<div class="flex gap-3">
					<div class="flex-shrink-0">
						<div class="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
							<span class="text-xs font-medium text-muted-foreground">
								{comment.userName.charAt(0)}
							</span>
						</div>
					</div>
					<div class="min-w-0 flex-1">
						<div class="flex items-center gap-2">
							<span class="text-sm font-medium text-foreground">
								{comment.userName}
							</span>
							<span class="text-xs text-muted-foreground">
								{formatDate(comment.createdAt)}
							</span>
						</div>
						<p class="mt-1 text-sm text-foreground">{comment.content}</p>
					</div>
				</div>
			{/each}
		{/if}
	</div>
</div>
