<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import AppSidebar from '$lib/components/app-sidebar.svelte';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import Sun from 'lucide-svelte/icons/sun';
	import Moon from 'lucide-svelte/icons/moon';
	import { toggleMode } from 'mode-watcher';
	import { page } from '$app/stores';

	let { children, data } = $props();
	let { session, supabase } = $derived(data);
	const user = $derived(session?.user);

	const sidebarUser = $derived({
		name: user?.user_metadata.name,
		email: user?.email,
		initials: (user?.user_metadata.name || '')
			.split(' ')
			.map((n: string[]) => n[0])
			.join('')
	});
</script>

<Sidebar.Provider>
	<AppSidebar user={sidebarUser} {supabase} />
	<main class="w-full">
		<header class="flex h-12 shrink-0 items-center gap-2 border-b px-4">
			<Sidebar.Trigger class="-ml-1" />
			<Button onclick={toggleMode} variant="ghost" size="icon">
				<Sun
					class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
				/>
				<Moon
					class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
				/>
				<span class="sr-only">Toggle theme</span>
			</Button>
			<Separator orientation="vertical" class="mr-2 h-4" />
			<Breadcrumb.Root>
				<Breadcrumb.List>
					<Breadcrumb.Item class="hidden md:block">
						<Breadcrumb.Link href="#"></Breadcrumb.Link>
					</Breadcrumb.Item>
					<!-- <Breadcrumb.Separator class="hidden md:block" /> -->
					<Breadcrumb.Item>
						<Breadcrumb.Page></Breadcrumb.Page>
					</Breadcrumb.Item>
				</Breadcrumb.List>
			</Breadcrumb.Root>
		</header>
		{@render children?.()}
	</main>
</Sidebar.Provider>
