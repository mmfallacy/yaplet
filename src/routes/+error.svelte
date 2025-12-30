<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';

	$effect(() => {
		console.error('404 Error: User attempted to access non-existent route:', page.url.pathname);
	});
</script>

<div class="flex min-h-screen items-center justify-center bg-muted">
	<div class="text-center">
		<h1 class="mb-4 text-4xl font-bold">404</h1>
		<p class="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
		<a href={resolve('/')} class="text-primary underline hover:text-primary/90"> Return to Home </a>
	</div>
</div>
