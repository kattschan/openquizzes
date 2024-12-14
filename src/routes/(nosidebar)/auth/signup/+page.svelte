<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
</script>

<div class="flex h-screen w-full items-center justify-center px-4">
	<Card.Root class="mx-auto max-w-sm">
		<Card.Header>
			<Card.Title class="text-2xl">Sign up</Card.Title>
			<Card.Description>Create your email and password to use openquizzes</Card.Description>
		</Card.Header>
		<form method="POST">
			<Card.Content>
				<div class="grid gap-4">
					<div class="grid gap-2">
						<Label for="name">Full Name</Label>
						<Input name="name" placeholder="David Tennant" required />
					</div>
					<div class="grid gap-2">
						<Label for="email">Email</Label>
						<Input name="email" type="email" placeholder="m@example.com" required />
					</div>
					<div class="grid gap-2">
						<div class="flex items-center">
							<Label for="password">Password</Label>
							<!-- 							<a href="##" class="ml-auto inline-block text-sm underline">
								Forgot your password?
							</a> -->
						</div>
						<Input name="password" type="password" placeholder="••••••••" required />
					</div>
					<Button type="submit" class="w-full">Sign up</Button>
				</div>
				<div class="mt-4 text-center text-sm">
					Already registered?
					<a href="/auth/login" class="underline"> Log in </a>
				</div>
			</Card.Content>
		</form>
	</Card.Root>
</div>
