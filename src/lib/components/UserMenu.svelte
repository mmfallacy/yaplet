<script lang="ts">
	import { LogIn, LogOut } from '@lucide/svelte';
	import * as Button from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { auth } from '$lib/hooks/auth.svelte';
</script>

{#if !auth.isAuthenticated}
	<Button.Root href="/login" variant="outline" size="sm" class="gap-2">
		<LogIn size={16} />
		<span class="hidden sm:inline">Sign in</span>
	</Button.Root>
{:else}
	<DropdownMenu.Root>
		<DropdownMenu.Trigger>
			{#snippet child({ props })}
				<Button.Root {...props} variant="ghost" size="icon" class="rounded-full">
					<div class="bg-primary/20 flex h-8 w-8 items-center justify-center rounded-full">
						<span class="text-primary text-sm font-medium">
							{auth.user?.name?.charAt(0) || 'U'}
						</span>
					</div>
				</Button.Root>
			{/snippet}
		</DropdownMenu.Trigger>
		<DropdownMenu.Content align="end" class="w-48">
			<div class="px-2 py-1.5">
				<p class="text-foreground text-sm font-medium">{auth.user?.name}</p>
				{#if auth.user?.githubUsername}
					<p class="text-muted-foreground text-xs">@{auth.user.githubUsername}</p>
				{/if}
			</div>
			<DropdownMenu.Separator />
			<DropdownMenu.Item onclick={() => auth.logout()} class="text-destructive cursor-pointer">
				<LogOut size={16} class="mr-2" />
				Sign out
			</DropdownMenu.Item>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
{/if}
