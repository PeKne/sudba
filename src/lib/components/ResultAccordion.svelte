<script lang="ts">
	import { AccordionItem, Alert, Heading } from 'flowbite-svelte';

	import Timeline from './Timeline/Timeline.svelte';
	import { InfoCircleSolid } from 'flowbite-svelte-icons';
	import { validatedFormStore, isErrorStore, formStore } from '../caseStore';
	import { getResultLevels } from '../caseSolver';
	import { A } from '@mobily/ts-belt';

	$: isAlertDisplayed = $isErrorStore || $formStore.crimes.length === 0;
	$: alertColor = ($isErrorStore ? 'red' : 'dark') as 'red' | 'dark';
	$: alertMessage = $isErrorStore
		? 'Výsledek nelze zobrazit. Ve formuláři se vyskytují chyby.'
		: 'Zatím nebyly zadána žádná data. Pro zobrazení časové osy, začněte vyplňovat formulář.';

	$: resultMessages = getResultLevels($validatedFormStore);
</script>

<AccordionItem open>
	<span slot="header"><Heading tag="h4">Výsledek:</Heading></span>
	<div class="flex justify-center items-center">
		{#if isAlertDisplayed}
			<Alert border color={alertColor}>
				<InfoCircleSolid slot="icon" class="w-4 h-4" />
				{alertMessage}
			</Alert>
		{:else}
			<Timeline />
			<div class="flex flex-col gap-2">
				{#if A.length(resultMessages) > 1}
					<Heading tag="h6">Patrový rozsudek:</Heading>
					{#each resultMessages as message, levelIndex}
						<div>
							{levelIndex + 1}. PATRO: {message}
						</div>
					{/each}
				{:else}
					{resultMessages[0]}
				{/if}
			</div>
		{/if}
	</div>
</AccordionItem>
