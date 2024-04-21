<script lang="ts">
	import { TableBodyRow, TableBodyCell, Checkbox } from 'flowbite-svelte';
	import { formStore, formErrorsStore } from '../../caseStore';
	import DeleteButton from '../atoms/DeleteButton.svelte';
	import type { RawSentence, SentenceId } from '../../types';
	import ValidatedInput from '../atoms/ValidatedInput.svelte';
	import ValidatedMultiSelect from '../atoms/ValidatedMultiSelect.svelte';
	import ValidatedSelect from '../atoms/ValidatedSelect.svelte';

	export let sentence: RawSentence;
	export let sentenceIndex: number;

	const handleRemoveSentence = (index: number) => {
		const sentencesCopy = [...$formStore.sentences];
		sentencesCopy.splice(index, 1);
		$formStore.sentences = sentencesCopy;
	};

	$: errors = $formErrorsStore.sentences[sentence.id] ?? {};
	$: crimeOptions = $formStore.sentencedCrimes.map((crime, index) => ({
		value: crime.id,
		name: `OSK${index + 1}`
	}));

	$: sentenceOptions = [
		{ value: 'X', name: 'neruší žádný' },
		...$formStore.sentences
			.map((s, index) => ({ ...s, originalIndex: index }))
			.filter((s) => s.id !== sentence.id)
			.map((s) => ({
				value: s.id,
				name: `R${s.originalIndex + 1}`
			}))
	];

	const handleCanceledSentenceChange = (event: Event) => {
		const input = event.target as HTMLInputElement;
		const value = input.value as SentenceId;

		if (value === 'X') {
			sentence.cancelsSentece = undefined;
		}

		sentence.cancelsSentece = value;
	};
</script>

<TableBodyRow>
	<TableBodyCell>R{sentenceIndex + 1}</TableBodyCell>
	<TableBodyCell
		><ValidatedInput bind:value={sentence.fileId} error={errors.fileId} /></TableBodyCell
	>
	<TableBodyCell
		><ValidatedInput
			type="number"
			bind:value={sentence.filePage}
			error={errors.filePage}
		/></TableBodyCell
	>
	<TableBodyCell
		><ValidatedInput
			type="date"
			bind:value={sentence.dateAnnounced}
			error={errors.dateAnnounced}
		/></TableBodyCell
	>
	<TableBodyCell><Checkbox bind:checked={sentence.isLegallyForced} /></TableBodyCell>
	<TableBodyCell>
		<ValidatedInput
			type="date"
			bind:value={sentence.dateLegallyForced}
			disabled={!sentence.isLegallyForced}
			error={errors.dateLegallyForced}
		/>
	</TableBodyCell>
	<TableBodyCell>
		<ValidatedMultiSelect items={crimeOptions} bind:value={sentence.crimes} error={errors.crimes} />
	</TableBodyCell>
	<TableBodyCell>
		<ValidatedSelect
			items={sentenceOptions}
			on:change={handleCanceledSentenceChange}
			error={errors.cancelsSentece}
		/>
	</TableBodyCell>
	<TableBodyCell class="flex items-center justify-center space-x-2">
		<DeleteButton on:click={() => handleRemoveSentence(sentenceIndex)} />
	</TableBodyCell>
</TableBodyRow>
