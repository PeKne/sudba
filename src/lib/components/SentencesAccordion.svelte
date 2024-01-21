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
		Button,
		Select
	} from 'flowbite-svelte';

	import { EMPTY_SENTENCE_TEMPLATE, activeCaseStore } from '../caseStore';

	let countries = [
		{ value: '1', name: 'Praha' },
		{ value: '2', name: 'Brno' },
		{ value: '3', name: 'Ostrava' }
	];

	const handleAddSentence = () =>
		($activeCaseStore.sentences = [...$activeCaseStore.sentences, { ...EMPTY_SENTENCE_TEMPLATE }]);
	const handleRemoveSentence = (index: number) => {
		const sentencesCopy = [...$activeCaseStore.sentences];
		sentencesCopy.splice(index, 1);
		$activeCaseStore.sentences = sentencesCopy;
	};
</script>

<AccordionItem open>
	<span slot="header"><Heading tag="h5">Rozsudky</Heading></span>
	<Table>
		<TableHead>
			<TableHeadCell>Soud který vydal rozhodnutí</TableHeadCell>
			<TableHeadCell>Spisová značka</TableHeadCell>
			<TableHeadCell>číslo listu</TableHeadCell>
			<TableHeadCell>Datum vyhlášení</TableHeadCell>
			<TableHeadCell>Nabyl právní moci?</TableHeadCell>
			<TableHeadCell>Datum nabytí právní moci</TableHeadCell>
		</TableHead>
		<TableBody>
			{#each $activeCaseStore.sentences as sentence, index}
				<Button on:click={() => handleRemoveSentence(index)}>Odstranit rozsudek</Button>
				<TableBodyRow>
					<TableBodyCell><Select items={countries} bind:value={sentence.court} /></TableBodyCell>
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
				</TableBodyRow>
				<TableBodyRow>
					<TableBodyCell><Select items={countries} bind:value={sentence.court} /></TableBodyCell>
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
				</TableBodyRow>
			{/each}
			<Button on:click={() => handleAddSentence()}>Pridat rozsudek</Button>
		</TableBody>
	</Table>
</AccordionItem>
