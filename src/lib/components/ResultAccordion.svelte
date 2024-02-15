<script lang="ts">
	import { AccordionItem, Alert, Heading } from 'flowbite-svelte';

	import Timeline from './Timeline/Timeline.svelte';
	import { InfoCircleSolid } from 'flowbite-svelte-icons';
	import { activeCaseStore, resultActiveCaseStore } from '../caseStore';
	import { formatCaseResultMessage, calculateCaseResult } from '../caseSolver';
	let isTimelineDisplayed = false;
	$: {
		isTimelineDisplayed = $activeCaseStore.crimes.filter((crime) => crime.date !== '').length > 0;
	}

	let resultMessage = '';
	$: {
		console.log('fjdslfjsdl');
		const caseResult = calculateCaseResult($resultActiveCaseStore);
		resultMessage = caseResult ? formatCaseResultMessage(caseResult) : 'FAIL';
	}
</script>

<AccordionItem open={isTimelineDisplayed}>
	<span slot="header"><Heading tag="h5">Výsledek:</Heading></span>
	<div class="flex justify-center items-center">
		{#if isTimelineDisplayed}
			<Timeline />
			{resultMessage}
		{:else}
			<Alert border color="dark">
				<InfoCircleSolid slot="icon" class="w-4 h-4" />
				Zatím nebyly zadána žádná data. Pro zobrazení časové osy, začněte vyplňovat formulář.
			</Alert>
		{/if}
	</div>
</AccordionItem>
