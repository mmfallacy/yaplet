<script lang="ts">
	import { LogIn, LogOut } from '@lucide/svelte';
	import * as Button from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { authClient } from '$lib/client';

	const session = authClient.useSession;
</script>

{#if !$session.data}
	<Button.Root href="/login" variant="outline" size="sm" class="gap-2">
		<LogIn size={16} />
		<span class="hidden sm:inline">Sign in</span>
	</Button.Root>
{:else}
	{@const user = $session.data.user}
	<DropdownMenu.Root>
		<DropdownMenu.Trigger>
			{#snippet child({ props })}
				<Button.Root {...props} variant="ghost" size="icon" class="rounded-full">
					<img
						class="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20"
						alt={user.name}
						src={user.image}
					/>
				</Button.Root>
			{/snippet}
		</DropdownMenu.Trigger>
		<DropdownMenu.Content align="end" class="w-48">
			<div class="px-2 py-1.5">
				<p class="text-sm font-medium text-foreground">{user.name}</p>
				{#if user.name}
					<p class="text-xs text-muted-foreground">@{user.username}</p>
				{/if}
			</div>
			<DropdownMenu.Separator />
			<DropdownMenu.Item
				onclick={() => authClient.signOut()}
				class="cursor-pointer text-destructive"
			>
				<LogOut size={16} class="mr-2" />
				Sign out
			</DropdownMenu.Item>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
{/if}
