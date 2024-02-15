<script>
	import { Accordion, Button } from 'flowbite-svelte';

	import OffendersAccordion from '../lib/components/OffendersAccordion.svelte';
	import CrimesAccordion from '../lib/components/CrimesAccordion.svelte';
	import ResultAccordion from '../lib/components/ResultAccordion.svelte';
	import GeneralAccordion from '../lib/components/GeneralAccordion.svelte';
	import SentencesAccordion from '../lib/components/SentencesAccordion.svelte';

	import { DownloadSolid, UploadSolid } from 'flowbite-svelte-icons';

	import { readCaseFromFile, saveCaseToFile } from '../lib/fileSystem';
</script>

<div class="pb-5 space-x-2 w-full">
	<Button size="lg" color="primary" on:click={saveCaseToFile}
		><DownloadSolid class="me-2" /> Uložit</Button
	>
	<Button size="lg" color="primary" on:click={readCaseFromFile}
		><UploadSolid class="me-2" />Načíst</Button
	>
</div>

<Accordion multiple>
	<GeneralAccordion />
	<OffendersAccordion />
	<CrimesAccordion />
	<SentencesAccordion />
	<ResultAccordion />
</Accordion>
