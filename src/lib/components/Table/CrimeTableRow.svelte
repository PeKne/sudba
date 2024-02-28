<script lang="ts">
	import { Input, TableBodyCell, TableBodyRow } from 'flowbite-svelte';
	import { activeCaseStore, createEmptyCrime, formErrorsStore } from '../../caseStore';
	import AddButton from '../atoms/AddButton.svelte';
	import DeleteButton from '../atoms/DeleteButton.svelte';
	import MyTextarea from '../atoms/MyTextarea.svelte';
	import ValidatedInput from '../atoms/ValidatedInput.svelte';
	import type { Crime } from '../../types';
	import { G } from '@mobily/ts-belt';

	export let wasSentenced = false;
	export let crime: Crime;
	export let crimeIndex: number;

	export let labelPrefix = '';

	const label = wasSentenced ? 'OSK' : 'SK';

	// $: crimesArray = wasSentenced ? $activeCaseStore.sentencedCrimes : $activeCaseStore.crimes;

	$: handleRemoveCrime = (index: number) => {
		const crimesCopy = [
			...(wasSentenced ? $activeCaseStore.sentencedCrimes : $activeCaseStore.crimes)
		];
		crimesCopy.splice(index, 1);

		if (wasSentenced) $activeCaseStore.sentencedCrimes = crimesCopy;
		else $activeCaseStore.crimes = crimesCopy;
	};

	$: errors =
		(wasSentenced
			? $formErrorsStore.sentencedCrimes[crime.id]
			: $formErrorsStore.crimes[crime.id]) ?? {};
	$: textColorClass = wasSentenced ? 'text-black' : 'text-red-500';

	let totalValue = 0;
	$: {
		totalValue = 0;
		if (G.isNotNullable(crime.valueDestroyed)) totalValue += Number(crime.valueDestroyed);
		if (G.isNotNullable(crime.valueStolen)) totalValue += Number(crime.valueStolen);
	}
</script>

<TableBodyRow>
	<TableBodyCell
		><span class={textColorClass}>{labelPrefix}{label}{crimeIndex + 1}</span></TableBodyCell
	>
	<TableBodyCell
		><ValidatedInput type="date" required bind:value={crime.date} error={errors.date} />
	</TableBodyCell>
	<TableBodyCell
		><ValidatedInput
			type="number"
			bind:value={crime.valueStolen}
			error={errors.valueStolen}
		/></TableBodyCell
	>
	<TableBodyCell
		><ValidatedInput
			type="number"
			bind:value={crime.valueDestroyed}
			error={errors.valueDestroyed}
		/></TableBodyCell
	>
	<TableBodyCell>{totalValue}</TableBodyCell>
	<TableBodyCell><MyTextarea bind:value={crime.note} /></TableBodyCell>
	<TableBodyCell class="flex items-center justify-center space-x-2">
		{#if crimeIndex !== 0}
			<DeleteButton on:click={() => handleRemoveCrime(crimeIndex)} />
		{/if}
	</TableBodyCell>
</TableBodyRow>
