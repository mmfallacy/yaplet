<script lang="ts">
	import { page } from '$app/state';

	$effect(() => {
		console.error('404 Error: User attempted to access non-existent route:', page.url.pathname);
	});
</script>

<div class="bg-muted flex min-h-screen items-center justify-center">
	<div class="text-center">
		<h1 class="mb-4 text-4xl font-bold">404</h1>
		<p class="text-muted-foreground mb-4 text-xl">Oops! Page not found</p>
		<a href="/" class="text-primary hover:text-primary/90 underline"> Return to Home </a>
	</div>
</div>
