<script lang="ts">
	import {
		Heading,
		Input,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	import DeleteButton from '../atoms/DeleteButton.svelte';
	import MyTextarea from '../atoms/MyTextarea.svelte';
	import type { Crime } from '../../types';
	import { activeCaseStore, createEmptyCrime } from '../../caseStore';
	import AddButton from '../atoms/AddButton.svelte';
	import SortButton from '../atoms/SortButton.svelte';

	export let wasSentenced = false;
	export let crimes: Crime[] = [];
	export let labelPrefix = '';

	const label = wasSentenced ? 'OSK' : 'SK';

	// TODO: move to the store
	const handleAddCrime = () => (crimes = [...crimes, createEmptyCrime()]);

	const handleRemoveCrime = (index: number) => {
		const crimesCopy = [...crimes];
		crimesCopy.splice(index, 1);
		crimes = crimesCopy;
	};

	let header = '';
	let textColorClass = '';
	let sortFunction: (() => void) | null = null;
	$: {
		sortFunction = wasSentenced ? activeCaseStore.sortSentencedCrimes : activeCaseStore.sortCrimes;
		textColorClass = wasSentenced ? 'text-black' : 'text-red-500';
		header = wasSentenced ? 'Odsouzené skutky' : 'Skutky k odsouzení';
	}
</script>

<Heading tag="h5">{header}:</Heading>
<Table divClass="pt-3">
	<TableHead>
		<TableHeadCell>Značka</TableHeadCell>
		<TableHeadCell>Datum</TableHeadCell>
		<TableHeadCell>Škoda odcizením</TableHeadCell>
		<TableHeadCell>Škoda poškozením</TableHeadCell>
		<TableHeadCell>Poznámka</TableHeadCell>
		<TableHeadCell
			><div class="flex items-center justify-center space-x-2">
				<SortButton on:click={sortFunction} />
			</div>
		</TableHeadCell>
	</TableHead>
	<TableBody>
		{#each crimes as crime, index}
			<TableBodyRow>
				<TableBodyCell
					><span class={textColorClass}>{labelPrefix}{label}{index + 1}</span></TableBodyCell
				>
				<TableBodyCell
					><Input type="date" id="first_name" required bind:value={crime.date} />
				</TableBodyCell>
				<TableBodyCell><Input type="number" bind:value={crime.valueStolen} /></TableBodyCell>
				<TableBodyCell><Input type="number" bind:value={crime.valueDestroyed} /></TableBodyCell>
				<TableBodyCell><MyTextarea bind:value={crime.note} /></TableBodyCell>
				<TableBodyCell class="flex items-center justify-center space-x-2">
					{#if crimes.length !== 1}
						<DeleteButton on:click={() => handleRemoveCrime(index)} />
					{/if}
					{#if index === crimes.length - 1}
						<!-- content here -->
						<AddButton on:click={handleAddCrime} />
					{/if}
				</TableBodyCell>
			</TableBodyRow>
		{/each}
	</TableBody>
</Table>
