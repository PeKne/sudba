<script lang="ts">
	import {
		AccordionItem,
		Heading,
		Input,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Checkbox,
		Select,
		MultiSelect
	} from 'flowbite-svelte';

	import { activeCaseStore, createEmptySentence } from '../caseStore';
	import DeleteButton from './atoms/DeleteButton.svelte';
	import AddButton from './atoms/AddButton.svelte';
	import SortButton from './atoms/SortButton.svelte';
	import type { SelectOptionType } from 'flowbite-svelte/dist/types';
	import type { Sentence, SentenceId } from '../types';

	const handleAddSentence = () =>
		($activeCaseStore.sentences = [...$activeCaseStore.sentences, createEmptySentence()]);
	const handleRemoveSentence = (index: number) => {
		const sentencesCopy = [...$activeCaseStore.sentences];
		sentencesCopy.splice(index, 1);
		$activeCaseStore.sentences = sentencesCopy;
	};

	let crimeOptions: SelectOptionType[] = [];
	let sentenceOptions: SelectOptionType[] = [];
	$: {
		crimeOptions = $activeCaseStore.sentencedCrimes.map((crime, index) => ({
			value: crime.id,
			name: `OSK${index + 1}`
		}));

		// TODO: filter itself and thouse that are later
		sentenceOptions = [
			{ value: 'X', name: 'neruší žádný' },
			...$activeCaseStore.sentences.map((sentence, index) => ({
				value: sentence.id,
				name: `R${index + 1}`
			}))
		];
	}

	const handleCanceledSentenceChange = (event: Event, sentence: Sentence) => {
		const input = event.target as HTMLInputElement;
		const value = input.value as SentenceId;
		console.log('🚀 ~ handleCanceledSentenceChange ~ value:', value);

		if (value === 'X') {
			sentence.cancelsSentece = undefined;
		}

		sentence.cancelsSentece = value;
	};
</script>

<!-- TODO: refactor to reusable table for any data -->
<AccordionItem open>
	<div slot="header" class="flexflex-row flex-1">
		<Heading tag="h5">Rozsudky:</Heading>
	</div>
	<Table>
		<TableHead>
			<TableHeadCell>Značka</TableHeadCell>
			<!-- <TableHeadCell>Soud který vydal rozhodnutí</TableHeadCell> -->
			<TableHeadCell>Spisová značka</TableHeadCell>
			<TableHeadCell>číslo listu</TableHeadCell>
			<TableHeadCell>Datum vyhlášení</TableHeadCell>
			<TableHeadCell>Nabyl právní moci?</TableHeadCell>
			<TableHeadCell>Nabyl právní moci?</TableHeadCell>
			<TableHeadCell>Odsouzené skutky</TableHeadCell>
			<TableHeadCell>Ruší rozsudek</TableHeadCell>
			<TableHeadCell
				><div class="flex items-center justify-center space-x-2">
					<SortButton on:click={activeCaseStore.sortSentences} />
				</div>
			</TableHeadCell>
		</TableHead>
		<TableBody>
			{#each $activeCaseStore.sentences as sentence, sentenceIndex}
				<TableBodyRow>
					<TableBodyCell>R{sentenceIndex + 1}</TableBodyCell>
					<!-- <TableBodyCell><Select items={countries} bind:value={sentence.court} /></TableBodyCell> -->
					<TableBodyCell><Input required bind:value={sentence.fileId} /></TableBodyCell>
					<TableBodyCell><Input type="number" bind:value={sentence.filePage} /></TableBodyCell>
					<TableBodyCell><Input type="date" bind:value={sentence.dateAnnounced} /></TableBodyCell>
					<TableBodyCell><Checkbox bind:checked={sentence.isLegallyForced} /></TableBodyCell>
					<TableBodyCell>
						<Input
							type="date"
							bind:value={sentence.dateLegallyForced}
							disabled={!sentence.isLegallyForced}
						/>
					</TableBodyCell>
					<TableBodyCell>
						<MultiSelect items={crimeOptions} bind:value={sentence.crimes} />
					</TableBodyCell>
					<TableBodyCell>
						<Select
							items={sentenceOptions}
							on:change={(e) => handleCanceledSentenceChange(e, sentence)}
							value={sentence.cancelsSentece ?? 'X'}
						/>
					</TableBodyCell>
					<TableBodyCell class="flex items-center justify-center space-x-2">
						{#if $activeCaseStore.sentences.length !== 1}
							<DeleteButton on:click={() => handleRemoveSentence(sentenceIndex)} />
						{/if}
						{#if sentenceIndex === $activeCaseStore.sentences.length - 1}
							<AddButton on:click={handleAddSentence} />
						{/if}
					</TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>
</AccordionItem>
