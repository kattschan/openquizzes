<script lang="ts">
	import { PlusCircle, Trash2, MoveUp, MoveDown } from 'lucide-svelte';
	import * as Card from '$lib/components/ui/card';
	import * as Select from '$lib/components/ui/select';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { enhance } from '$app/forms';
	import { Loader2 } from 'lucide-svelte';
	import type { PageData } from './$types';

	type QuestionType = 'multiple-choice' | 'short-answer' | 'long-answer' | 'true-false';

	interface QuestionTypeOption {
		value: QuestionType;
		label: string;
	}

	interface Question {
		id: number;
		type: QuestionType;
		text: string;
		options: string[];
		points: number;
		answer?: string;
	}
	let { data }: { data: PageData } = $props();
	let title = $state(data.assignment.title);
	let description = $state(data.assignment.description);
	let questions = $state<Question[]>(data.assignment.questions || []);
	let isSubmitting = $state(false);

	const questionTypes: QuestionTypeOption[] = [
		{ value: 'multiple-choice', label: 'Multiple Choice' },
		{ value: 'short-answer', label: 'Short Answer' },
		{ value: 'long-answer', label: 'Long Answer' },
		{ value: 'true-false', label: 'True/False' }
	];

	const getDefaultDataForType = (type: QuestionType) => {
		switch (type) {
			case 'multiple-choice':
				return {
					choices: ['', ''],
					correctAnswer: 0
				};
			case 'short-answer':
				return {
					answer: ''
				};
			case 'long-answer':
				return {
					answer: ''
				};
			case 'true-false':
				return {
					correctAnswer: true
				};
			default:
				return {};
		}
	};

	function addQuestion(): void {
		questions = [
			...questions,
			{
				id: Date.now(),
				type: 'multiple-choice',
				text: '',
				options: ['Option 1'],
				points: 1
			}
		];
	}

	function removeQuestion(index: number): void {
		questions = questions.filter((_, i) => i !== index);
	}

	function moveQuestion(index: number, direction: 'up' | 'down'): void {
		if (
			(direction === 'up' && index === 0) ||
			(direction === 'down' && index === questions.length - 1)
		)
			return;

		const newIndex = direction === 'up' ? index - 1 : index + 1;
		const newQuestions = [...questions];
		[newQuestions[index], newQuestions[newIndex]] = [newQuestions[newIndex], newQuestions[index]];
		questions = newQuestions;
	}

	const updateQuestion = (index: number, field: string, value: any) => {
		const updatedQuestions = [...questions];
		if (field === 'type') {
			updatedQuestions[index] = {
				...updatedQuestions[index],
				type: value,
				...getDefaultDataForType(value)
			};
		} else {
			updatedQuestions[index] = {
				...updatedQuestions[index],
				[field]: value
			};
		}
		questions = updatedQuestions;
	};

	function addOption(questionIndex: number): void {
		questions = questions.map((q, i) => {
			if (i === questionIndex) {
				const optionsLength = q.options.length;
				return {
					...q,
					options: [...q.options, `Option ${optionsLength + 1}`]
				};
			}
			return q;
		});
	}

	function updateOption(questionIndex: number, optionIndex: number, value: string): void {
		questions = questions.map((q, i) => {
			if (i === questionIndex) {
				const newOptions = [...q.options];
				newOptions[optionIndex] = value;
				return { ...q, options: newOptions };
			}
			return q;
		});
	}

	function removeOption(questionIndex: number, optionIndex: number): void {
		questions = questions.map((q, i) => {
			if (i === questionIndex) {
				const newOptions = [...q.options];
				newOptions.splice(optionIndex, 1);
				return { ...q, options: newOptions };
			}
			return q;
		});
	}

	function handlePointsChange(event: Event, index: number): void {
		const input = event.target as HTMLInputElement;
		const value = parseInt(input.value) || 0;
		updateQuestion(index, 'points', value);
	}

	function handleQuestionTextChange(event: Event, index: number): void {
		const input = event.target as HTMLTextAreaElement;
		updateQuestion(index, 'text', input.value);
	}

	function handleOptionChange(event: Event, questionIndex: number, optionIndex: number): void {
		const input = event.target as HTMLInputElement;
		updateOption(questionIndex, optionIndex, input.value);
	}
	let questionCount = $derived(questions.length);
	let totalPoints = $derived(questions.reduce((sum, q) => sum + q.points, 0));
</script>

<form
	method="POST"
	class="mx-auto max-w-4xl space-y-4 p-4"
	use:enhance={() => {
		isSubmitting = true;
		return async ({ result }) => {
			isSubmitting = false;
			if (result.type === 'success') {
			}
		};
	}}
>
	<input type="hidden" name="data" value={JSON.stringify({ title, description, questions })} />

	<Card.Root>
		<Card.Header>
			<Card.Title>Create Assignment</Card.Title>
		</Card.Header>
		<Card.Content class="space-y-4">
			<Input placeholder="Assignment Title" bind:value={title} class="text-lg font-semibold" />
			<Textarea placeholder="Assignment Description" bind:value={description} class="h-24" />
			{#if questionCount > 0}
				<div class="text-sm text-gray-500">
					Total Questions: {questionCount} | Total Points: {totalPoints}
				</div>
			{/if}
		</Card.Content>
	</Card.Root>

	{#each questions as question, questionIndex}
		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between">
				<Card.Title class="flex items-center gap-4">
					Question {questionIndex + 1}
					<div class="flex gap-2">
						<Button
							variant="ghost"
							size="icon"
							onclick={() => moveQuestion(questionIndex, 'up')}
							disabled={questionIndex === 0}
						>
							<MoveUp class="h-4 w-4" />
						</Button>
						<Button
							variant="ghost"
							size="icon"
							onclick={() => moveQuestion(questionIndex, 'down')}
							disabled={questionIndex === questions.length - 1}
						>
							<MoveDown class="h-4 w-4" />
						</Button>
					</div>
				</Card.Title>
				<Button variant="ghost" size="icon" onclick={() => removeQuestion(questionIndex)}>
					<Trash2 class="h-4 w-4" />
				</Button>
			</Card.Header>
			<Card.Content class="space-y-4">
				<div class="flex gap-4">
					<Select.Root
						value={question.type}
						onValueChange={(value) => updateQuestion(questionIndex, 'type', value as QuestionType)}
						type="single"
					>
						<Select.Trigger>
							{#if question.type === 'multiple-choice'}
								Multiple Choice
							{:else if question.type === 'short-answer'}
								Short Answer
							{:else if question.type === 'long-answer'}
								Long Answer
							{:else if question.type === 'true-false'}
								True/False
							{:else}
								Select Question Type
							{/if}
						</Select.Trigger>
						<Select.Content>
							{#each questionTypes as type}
								<Select.Item value={type.value}>
									{type.label}
								</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
					<Input
						type="number"
						placeholder="Points"
						value={question.points}
						oninput={(e) => handlePointsChange(e, questionIndex)}
						class="w-24"
						min="0"
					/>
				</div>
				<Textarea
					placeholder="Question text"
					value={question.text}
					oninput={(e) => handleQuestionTextChange(e, questionIndex)}
				/>

				{#if question.type === 'multiple-choice'}
					<div class="space-y-2">
						{#each question.options as option, optionIndex}
							<div class="flex items-center gap-2">
								<input
									type="radio"
									name={`correct-${questionIndex}`}
									checked={question.answer === optionIndex.toString()}
									onchange={() => {
										question.answer = optionIndex.toString();
									}}
								/>
								<Input
									value={option}
									oninput={(e) => handleOptionChange(e, questionIndex, optionIndex)}
									placeholder={`Option ${optionIndex + 1}`}
								/>
								<Button
									variant="ghost"
									size="icon"
									onclick={() => removeOption(questionIndex, optionIndex)}
									disabled={question.options.length <= 1}
								>
									<Trash2 class="h-4 w-4" />
								</Button>
							</div>
						{/each}
						<Button
							variant="outline"
							size="sm"
							onclick={() => addOption(questionIndex)}
							class="mt-2"
						>
							Add Option
						</Button>
					</div>
				{/if}
				{#if question.type === 'short-answer'}
					<Input placeholder="Answer" bind:value={question.answer} />
				{/if}
				{#if question.type === 'long-answer'}
					<Textarea placeholder="Answer" class="h-24" bind:value={question.answer} />
				{/if}
				{#if question.type === 'true-false'}
					<div class="flex gap-4">
						<Button
							variant={question.answer === 'true' ? 'default' : 'outline'}
							size="sm"
							onclick={() => (question.answer = 'true')}>True</Button
						>
						<Button
							variant={question.answer === 'false' ? 'default' : 'outline'}
							size="sm"
							onclick={() => (question.answer = 'false')}>False</Button
						>
					</div>
				{/if}
			</Card.Content>
		</Card.Root>
	{/each}

	<Button onclick={addQuestion} class="w-full" variant="outline">
		<PlusCircle class="mr-2 h-4 w-4" />
		Add Question
	</Button>
	<div class="flex gap-4">
		<Button type="submit" class="w-full" disabled={isSubmitting}>
			{#if isSubmitting}
				<Loader2 class="mr-2 h-4 w-4 animate-spin" />
				Saving...
			{:else}
				Save Assignment
			{/if}
		</Button>
	</div>
</form>
