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
		Button
	} from 'flowbite-svelte';

	import MyTextarea from '$lib/components/atoms/MyTextarea.svelte';

	import { EMPTY_CRIME_TEMPLATE, activeCaseStore } from '../caseStore';

	const handleAddCrime = () =>
		($activeCaseStore.crimes = [...$activeCaseStore.crimes, { ...EMPTY_CRIME_TEMPLATE }]);

	const handleRemoveCrime = (index: number) => {
		const crimesCopy = [...$activeCaseStore.crimes];
		crimesCopy.splice(index, 1);
		$activeCaseStore.crimes = crimesCopy;
	};
</script>

<AccordionItem open>
	<span slot="header"><Heading tag="h5">SKUTKY</Heading></span>
	<Table>
		<TableHead>
			<TableHeadCell>Datum</TableHeadCell>
			<TableHeadCell>Škoda odcizením</TableHeadCell>
			<TableHeadCell>Škoda poškozením</TableHeadCell>
			<TableHeadCell>Poznámka</TableHeadCell>
		</TableHead>
		<TableBody>
			{#each $activeCaseStore.crimes as crime, index}
				<Button on:click={() => handleRemoveCrime(index)}>Odstranit skutek</Button>

				<TableBodyRow>
					<TableBodyCell
						><Input type="date" id="first_name" required bind:value={crime.date} /></TableBodyCell
					>
					<TableBodyCell><Input type="number" bind:value={crime.valueStolen} /></TableBodyCell>
					<TableBodyCell><Input type="number" bind:value={crime.valueDestroyed} /></TableBodyCell>
					<TableBodyCell><MyTextarea bind:value={crime.note} /></TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>
	<Button on:click={handleAddCrime}>Přidat skutek</Button>
</AccordionItem>
