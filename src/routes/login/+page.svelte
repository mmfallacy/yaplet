<script lang="ts">
	import { goto } from '$app/navigation';
	import { Github, ArrowLeft } from '@lucide/svelte';
	import * as Button from '$lib/components/ui/button';
	import { auth } from '$lib/hooks/auth.svelte';

	$effect(() => {
		if (auth.isAuthenticated && !auth.isLoading) {
			goto('/');
		}
	});

	async function handleGitHubLogin() {
		// Stub: In a real app, this would initiate GitHub OAuth flow
		await auth.login();
		goto('/');
	}
</script>

<div class="bg-background flex min-h-screen flex-col">
	<!-- Header -->
	<header class="border-border border-b p-4">
		<div class="mx-auto flex max-w-2xl items-center gap-3">
			<Button.Root href="/" variant="ghost" size="icon">
				<ArrowLeft size={20} />
			</Button.Root>
			<span class="text-foreground font-semibold">Back to Journal</span>
		</div>
	</header>

	<!-- Login content -->
	<main class="flex flex-1 items-center justify-center p-4">
		<div class="w-full max-w-sm">
			<div class="mb-8 text-center">
				<div class="bg-primary/20 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
					<span class="text-primary text-2xl font-bold">J</span>
				</div>
				<h1 class="text-foreground mb-2 text-2xl font-bold">Welcome back</h1>
				<p class="text-muted-foreground">Sign in to like posts and leave comments</p>
			</div>

			<div class="space-y-4">
				<Button.Root onclick={handleGitHubLogin} class="h-12 w-full gap-3 text-base" variant="outline">
					<Github size={20} />
					Continue with GitHub
				</Button.Root>

				<p class="text-muted-foreground text-center text-xs">
					By signing in, you agree to our{' '}
					<a href="/" class="text-primary hover:underline"> Terms of Service </a>{' '}
					and{' '}
					<a href="/" class="text-primary hover:underline"> Privacy Policy </a>
				</p>
			</div>
		</div>
	</main>
</div>
