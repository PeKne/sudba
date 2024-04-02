<script lang="ts">
	import { Checkbox, TableBodyCell, TableBodyRow } from 'flowbite-svelte';
	import { formStore, formErrorsStore } from '../../caseStore';
	import DeleteButton from '../atoms/DeleteButton.svelte';
	import MyTextarea from '../atoms/MyTextarea.svelte';
	import ValidatedInput from '../atoms/ValidatedInput.svelte';
	import type { AttackOption, RawCrime } from '../../types';
	import ValidatedSelect from '../atoms/ValidatedSelect.svelte';

	export let wasSentenced = false;
	export let crime: RawCrime;
	export let crimeIndex: number;

	export let labelPrefix = '';

	const crimeLabel = wasSentenced ? 'OSK' : 'SK';
	const attackLabel = wasSentenced ? 'OU' : 'U';

	$: label = crime.isAttack !== 'no' ? attackLabel : crimeLabel;

	$: handleRemoveCrime = (index: number) => {
		const crimesCopy = [...(wasSentenced ? $formStore.sentencedCrimes : $formStore.crimes)];
		crimesCopy.splice(index, 1);

		if (wasSentenced) $formStore.sentencedCrimes = crimesCopy;
		else $formStore.crimes = crimesCopy;
	};

	const handleIsAttackChange = (event: Event) => {
		const input = event.target as HTMLInputElement;
		const value = input.value as AttackOption;

		crime.isAttack = value;

		if (value === 'no') {
			crime.isMainOffender = false;
			crime.dateDisclosed = undefined;
			crime.valueStolen = undefined;
			crime.valueDestroyed = undefined;
		}
	};

	const handleParagraphChange = (event: Event) => {
		const input = event.target as HTMLInputElement;
		const value = input.value as AttackOption;

		crime.paragraph = value;
	};

	$: errors =
		(wasSentenced
			? $formErrorsStore.sentencedCrimes[crime.id]
			: $formErrorsStore.crimes[crime.id]) ?? {};
	$: textColorClass = wasSentenced ? 'text-black' : 'text-red-500';

	$: paragraphOptions = [
		{ value: '1', name: 'paragraf 1' },
		{ value: '2', name: 'paragraf 2' },
		{ value: '3', name: 'paragraf 3' }
	];

	$: attackOptions = [
		{ value: 'no', name: 'Ne' },
		{ value: 'yes', name: 'Ano' },
		{ value: 'maybe', name: 'Možná' }
	] as { value: AttackOption; name: string }[];

	$: areAttackOptionsDisabled = crime.isAttack === 'no';
</script>

<TableBodyRow>
	<TableBodyCell
		><span class={textColorClass}>{labelPrefix}{label}{crimeIndex + 1}</span></TableBodyCell
	>
	<TableBodyCell
		><ValidatedInput type="date" required bind:value={crime.date} error={errors.date} />
	</TableBodyCell>
	<TableBodyCell
		><ValidatedSelect
			on:change={handleParagraphChange}
			items={paragraphOptions}
			error={errors.paragraph}
		/></TableBodyCell
	>
	<TableBodyCell
		><ValidatedSelect
			value={crime.isAttack}
			on:change={handleIsAttackChange}
			items={attackOptions}
			error={errors.isAttack}
		/></TableBodyCell
	>
	<TableBodyCell
		><Checkbox
			bind:checked={crime.isMainOffender}
			error={errors.isMainOffender}
			disabled={areAttackOptionsDisabled}
		/></TableBodyCell
	>
	<TableBodyCell
		><ValidatedInput
			type="date"
			required
			bind:value={crime.dateDisclosed}
			error={errors.dateDisclosed}
			disabled={areAttackOptionsDisabled}
		/></TableBodyCell
	>

	<TableBodyCell
		><ValidatedInput
			type="number"
			bind:value={crime.valueStolen}
			error={errors.valueStolen}
			disabled={areAttackOptionsDisabled}
		/></TableBodyCell
	>
	<TableBodyCell
		><ValidatedInput
			type="number"
			bind:value={crime.valueDestroyed}
			error={errors.valueDestroyed}
			disabled={areAttackOptionsDisabled}
		/></TableBodyCell
	>
	<TableBodyCell><MyTextarea bind:value={crime.note} /></TableBodyCell>
	<TableBodyCell class="flex items-center justify-center space-x-2">
		{#if crimeIndex !== 0}
			<DeleteButton on:click={() => handleRemoveCrime(crimeIndex)} />
		{/if}
	</TableBodyCell>
</TableBodyRow>
