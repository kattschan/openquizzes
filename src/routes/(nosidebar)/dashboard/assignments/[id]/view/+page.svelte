<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { RadioGroup, RadioGroupItem } from '$lib/components/ui/radio-group';
	import { CheckCircle, XCircle } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let assignment = $state(data.assignment);
	let currentQuestion = $state(0);
	let selectedAnswers = $state(new Array(assignment.questions.length).fill(''));
	let isSubmitted = $state(false);
	let score = $state(0);

	function handleAnswer(value: string) {
		selectedAnswers[currentQuestion] = value;
	}

	function handlePrevious() {
		if (currentQuestion > 0) {
			currentQuestion--;
		}
	}

	function handleNext() {
		if (currentQuestion < assignment.questions.length - 1) {
			currentQuestion++;
		} else {
			handleSubmit();
		}
	}

	function handleSubmit() {
		isSubmitted = true;
		score = assignment.questions.reduce((acc: number, question: any, index: number) => {
			if (
				question.answer.toString().toLowerCase() === selectedAnswers[index].toString().toLowerCase()
			) {
				return acc + 1;
			}
			return acc;
		}, 0);
	}
</script>

{#if !isSubmitted}
	<Card class="mx-auto w-full max-w-2xl">
		<CardHeader>
			<CardTitle>{assignment.title}</CardTitle>
		</CardHeader>
		<CardContent>
			<div class="space-y-4">
				<div class="text-sm text-gray-500">
					Question {currentQuestion + 1} of {assignment.questions.length}
				</div>

				<h2 class="text-xl font-semibold">
					{assignment.questions[currentQuestion].text}
				</h2>

				{#if assignment.questions[currentQuestion].type === 'multiple-choice'}
					<RadioGroup value={selectedAnswers[currentQuestion]} onValueChange={handleAnswer}>
						{#each assignment.questions[currentQuestion].options as option, index}
							<div class="flex items-center space-x-2">
								<RadioGroupItem value={index.toString()} id={index.toString()} />
								<label
									for={index.toString()}
									class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
								>
									{option}
								</label>
							</div>
						{/each}
					</RadioGroup>
				{:else if assignment.questions[currentQuestion].type === 'short-answer'}
					<input
						type="text"
						class="w-full rounded-lg border p-2"
						placeholder="Type your answer here"
						bind:value={selectedAnswers[currentQuestion]}
					/>
				{:else if assignment.questions[currentQuestion].type === 'true-false'}
					<RadioGroup value={selectedAnswers[currentQuestion]} onValueChange={handleAnswer}>
						<div class="flex items-center space-x-2">
							<RadioGroupItem value="true" id="true" />
							<label
								for="true"
								class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
							>
								True
							</label>
						</div>
						<div class="flex items-center space-x-2">
							<RadioGroupItem value="false" id="false" />
							<label
								for="false"
								class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
							>
								False
							</label>
						</div>
					</RadioGroup>
				{:else if assignment.questions[currentQuestion].type === 'long-answer'}
					<textarea
						class="w-full rounded-lg border p-2"
						placeholder="Type your answer here"
						bind:value={selectedAnswers[currentQuestion]}
					>
					</textarea>
				{/if}

				<div class="mt-6 flex justify-between">
					<Button onclick={handlePrevious} disabled={currentQuestion === 0} variant="outline">
						Previous
					</Button>
					<Button onclick={handleNext} disabled={!selectedAnswers[currentQuestion]}>
						{currentQuestion === assignment.questions.length - 1 ? 'Finish' : 'Next'}
					</Button>
				</div>
			</div>
		</CardContent>
	</Card>
{:else}
	<Card class="mx-auto w-full max-w-2xl">
		<CardHeader>
			<CardTitle>Quiz Results</CardTitle>
		</CardHeader>
		<CardContent>
			<div class="space-y-4">
				<p class="text-xl font-bold">
					Your Score: {score} out of {assignment.questions.length}
				</p>
				{#each assignment.questions as question, index}
					<div class="rounded-lg border p-4">
						<p class="font-medium">{question.text}</p>
						<p class="mt-2">
							{#if question.type === 'multiple-choice'}
								Your answer: {question.options[selectedAnswers[index]]}
							{:else}
								Your answer: {selectedAnswers[index]}
							{/if}
							{#if selectedAnswers[index].toString().toLowerCase() === question.answer
									.toString()
									.toLowerCase()}
								<CheckCircle class="ml-2 inline text-green-500" size={20} />
							{:else}
								<XCircle class="ml-2 inline text-red-500" size={20} />
							{/if}
						</p>
						{#if selectedAnswers[index].toString().toLowerCase() !== question.answer
								.toString()
								.toLowerCase()}
							<p class="mt-1 text-sm text-green-600">
								Correct answer: {question.answer}
							</p>
						{/if}
					</div>
				{/each}
				<a href="/dashboard/assignments">
					<Button class="mt-4">Exit</Button>
				</a>
			</div>
		</CardContent>
	</Card>
{/if}
