<script lang="ts">
	import { AccordionItem, Heading } from 'flowbite-svelte';
	import { activeCaseStore } from '../caseStore';

	import CrimesTable from './Table/CrimesTable.svelte';
</script>

<AccordionItem open>
	<span slot="header"><Heading tag="h5">Skutky:</Heading></span>
	<CrimesTable bind:crimes={$activeCaseStore.crimes} />
	<CrimesTable bind:crimes={$activeCaseStore.sentencedCrimes} wasSentenced />
</AccordionItem>
