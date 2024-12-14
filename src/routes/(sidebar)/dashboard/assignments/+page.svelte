<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { Delete, Edit, Eye, Plus, Loader2 } from 'lucide-svelte';
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';

	interface Assignment {
		id: string;
		title: string;
		description: string | null;
	}

	let { data }: { data: PageData } = $props();
	let assignments: Assignment[] = $state([]);

	const loadAssignments = async () => {
		const { data: assignmentsData } = await data.supabase.from('assignments').select('*');
		assignments = assignmentsData || [];
	};
	loadAssignments();

	data.supabase
		.channel('assignments')
		.on(
			'postgres_changes',
			{ event: '*', schema: 'public', table: 'assignments' },
			(payload: { new: Assignment; old: { id: string } }) => {
				let id = payload.old.id;

				let index = assignments.findIndex((a: Assignment) => a.id === id);
				if (JSON.stringify(payload.new) == '{}') {
					assignments.splice(index, 1);
					return;
				}
				if (index !== -1) {
					assignments[index] = payload.new;
				} else {
					assignments = [...assignments, payload.new];
				}
			}
		)
		.subscribe();

	let creating = $state(false);
	let deletingAssignment: Assignment | null = $state(null);
	let isDeleteDialogOpen = $state(false);

	const confirmDeletion = async () => {
		if (deletingAssignment) {
			await data.supabase.from('assignments').delete().eq('id', deletingAssignment.id);
			assignments = assignments.filter((a) => a.id !== deletingAssignment?.id);
			deletingAssignment = null;
		}
	};
</script>

<div class="mx-auto my-4 w-full max-w-2xl">
	<div class="flex items-center justify-between">
		<h1 class="text-2xl font-semibold">Assignments</h1>
		<form
			method="POST"
			use:enhance={() => {
				creating = true;
				return async ({ update }) => {
					await update();
					creating = false;
				};
			}}
		>
			<Button type="submit" disabled={creating}>
				{#if creating}
					<Loader2 class="mr-2 h-4 w-4 animate-spin" />
					Creating...
				{:else}
					<Plus class="mr-2" /> New Assignment
				{/if}
			</Button>
		</form>
	</div>

	{#if assignments.length === 0}
		<p class="mt-4">No assignments found.</p>
	{:else}
		<ul class="mt-4 space-y-4">
			{#each assignments as assignment}
				<Card.Root>
					<Card.Header>
						<Card.Title>{assignment.title}</Card.Title>
						<Card.Description
							>{assignment.description ?? '<em>No description provided.</em>'}</Card.Description
						>
					</Card.Header>
					<Card.Footer>
						<div class="row pt-2">
							<a href="/dashboard/assignments/{assignment.id}/view">
								<Button class="mr-1">
									<Eye /> View
								</Button>
							</a>
							<a href="/dashboard/assignments/{assignment.id}/edit">
								<Button class="mr-1">
									<Edit /> Edit
								</Button>
							</a>
							<Button
								variant="destructive"
								class="mr-1"
								onclick={() => {
									deletingAssignment = assignment;
									isDeleteDialogOpen = true;
								}}
							>
								<Delete /> Delete
							</Button>
						</div>
					</Card.Footer>
				</Card.Root>
			{/each}
		</ul>
	{/if}
</div>

<AlertDialog.Root bind:open={deletingAssignment}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Confirm deletion</AlertDialog.Title>
			<AlertDialog.Description>
				Are you sure you want to delete the assignment? <strong>This cannot be undone.</strong>
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action onclick={confirmDeletion}>Delete</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
