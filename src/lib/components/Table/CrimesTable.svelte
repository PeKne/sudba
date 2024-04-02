<script lang="ts">
	import {
		Button,
		DropdownDivider,
		Heading,
		Table,
		TableBody,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	import type { RawCrime } from '../../types';
	import { formStore, createEmptyCrime } from '../../caseStore';
	import CrimeTableRow from './CrimeTableRow.svelte';
	import { PlusSolid } from 'flowbite-svelte-icons';

	export let wasSentenced = false;
	export let crimes: RawCrime[] = [];
	$: header = wasSentenced ? 'Odsouzené' : 'K odsouzení';

	$: handleAddCrime = wasSentenced
		? () => ($formStore.sentencedCrimes = [...$formStore.sentencedCrimes, createEmptyCrime()])
		: () => ($formStore.crimes = [...$formStore.crimes, createEmptyCrime()]);
</script>

<Heading tag="h4">{header}:</Heading>
<Table divClass="pt-3" striped shadow>
	<TableHead class="divide-y">
		<TableHeadCell>Značka</TableHeadCell>
		<TableHeadCell>Datum</TableHeadCell>
		<TableHeadCell>Pravní kvalifikace</TableHeadCell>
		<TableHeadCell>Jedná se o útok?</TableHeadCell>
		<TableHeadCell>Byl hlavním pachatelem?</TableHeadCell>
		<TableHeadCell>Datum sdělení obvinění</TableHeadCell>
		<TableHeadCell>Škoda odcizením</TableHeadCell>
		<TableHeadCell>Škoda poškozením</TableHeadCell>
		<TableHeadCell>Škoda celkem</TableHeadCell>
		<TableHeadCell>Poznámka</TableHeadCell>
		<TableHeadCell
			><div class="flex items-center justify-center space-x-2">
				<!-- <SortButton on:click={sortFunction} /> -->
			</div>
		</TableHeadCell>
	</TableHead>
	<TableBody>
		{#each crimes as crime, crimeIndex (crime.id)}
			<CrimeTableRow {crime} {crimeIndex} {wasSentenced} />
		{/each}
	</TableBody>
</Table>
<DropdownDivider />
<div class="pb-5 pt-5 space-x-2 w-full flex justify-end">
	<Button size="lg" color="primary" on:click={handleAddCrime}
		><PlusSolid class="me-2" />Přidat Skutek</Button
	>
</div>
