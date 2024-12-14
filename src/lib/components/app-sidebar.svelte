<script lang="ts">
	import { page } from '$app/stores';
	import Calendar from 'lucide-svelte/icons/calendar';
	import House from 'lucide-svelte/icons/house';
	import List from 'lucide-svelte/icons/list';
	import Search from 'lucide-svelte/icons/search';
	import Settings from 'lucide-svelte/icons/settings';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import NavUser from './nav-user.svelte';
	let { user, supabase } = $props();

	// Menu items.
	const items = [
		{
			title: 'Home',
			url: '/',
			icon: House
		},
		{
			title: 'Assignments',
			url: '/assignments',
			icon: List
		},
		// {
		// 	title: 'Calendar',
		// 	url: '#',
		// 	icon: Calendar
		// },
		// {
		// 	title: 'Search',
		// 	url: '#',
		// 	icon: Search
		// },
		{
			title: 'Settings',
			url: '#',
			icon: Settings
		}
	];

	// Check if menu item is active
	let isActive = $state((itemUrl: string) => {
		if (itemUrl === '/') {
			return $page.url.pathname === '/dashboard';
		}
		return $page.url.pathname.startsWith('/dashboard' + itemUrl);
	});
</script>

<Sidebar.Root>
	<Sidebar.Content>
		<Sidebar.Group>
			<Sidebar.GroupLabel>openquizzes</Sidebar.GroupLabel>
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					{#each items as item (item.title)}
						<Sidebar.MenuItem>
							<Sidebar.MenuButton isActive={isActive(item.url)}>
								{#snippet child({ props })}
									<a href={'/dashboard' + item.url} {...props} class:active={isActive(item.url)}>
										<item.icon />
										<span>{item.title}</span>
									</a>
								{/snippet}
							</Sidebar.MenuButton>
						</Sidebar.MenuItem>
					{/each}
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
	</Sidebar.Content>
	<Sidebar.Footer>
		<NavUser {user} {supabase} />
	</Sidebar.Footer>
</Sidebar.Root>

<style>
	a {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		width: 100%;
		padding: 0.5rem;
		text-decoration: none;
		color: inherit;
	}

	.active {
		background-color: hsl(var(--primary) / 0.1);
		color: hsl(var(--primary));
	}
</style>
