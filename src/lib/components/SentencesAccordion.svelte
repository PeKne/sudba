<script lang="ts">
	import {
		AccordionItem,
		Button,
		Heading,
		Table,
		TableBody,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';

	import { formStore, createEmptySentence } from '../caseStore';
	import SentenceTableRow from './Table/SentenceTableRow.svelte';
	import { PlusSolid } from 'flowbite-svelte-icons';

	const handleAddSentence = () => {
		$formStore.sentences = [...$formStore.sentences, createEmptySentence()];
	};
</script>

<!-- TODO: refactor to reusable table for any data -->
<AccordionItem open>
	<div slot="header" class="flexflex-row flex-1">
		<Heading tag="h4">Rozsudky:</Heading>
	</div>
	<Table divClass="mb-5" striped shadow>
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
					<!-- <SortButton on:click={activeCaseStore.sortSentences} /> -->
				</div>
			</TableHeadCell>
		</TableHead>
		<TableBody>
			{#each $formStore.sentences as sentence, sentenceIndex (sentence.id)}
				<SentenceTableRow {sentence} {sentenceIndex} />
			{/each}
		</TableBody>
	</Table>
	<div class="pb-5 pt-5 space-x-2 w-full flex justify-end">
		<Button size="lg" color="primary" on:click={handleAddSentence}
			><PlusSolid class="me-2" />Přidat rozsudek</Button
		>
	</div>
</AccordionItem>
