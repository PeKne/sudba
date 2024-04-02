<script lang="ts">
	import { AccordionItem, Heading } from 'flowbite-svelte';
	import { formStore } from '../caseStore';

	import CrimesTable from './Table/CrimesTable.svelte';
</script>

<AccordionItem open>
	<span slot="header"><Heading tag="h4">Skutky / Útoky:</Heading></span>
	<CrimesTable bind:crimes={$formStore.crimes} />
	<CrimesTable bind:crimes={$formStore.sentencedCrimes} wasSentenced />
</AccordionItem>
