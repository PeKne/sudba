<script>
	import { Accordion, Button } from 'flowbite-svelte';

	import OffendersAccordion from '../lib/components/OffendersAccordion.svelte';
	import CrimesAccordion from '../lib/components/CrimesAccordion.svelte';
	import ResultAccordion from '../lib/components/ResultAccordion.svelte';
	import GeneralAccordion from '../lib/components/GeneralAccordion.svelte';
	import SentencesAccordion from '../lib/components/SentencesAccordion.svelte';

	import { DownloadSolid, UploadSolid } from 'flowbite-svelte-icons';

	import { readCaseFromFile, saveCaseToFile } from '../lib/fileSystem';

	import SaveBadge from '../lib/components/SaveBadge.svelte';
	import { attachTauriListeners } from '../lib/tauriListeners';

	attachTauriListeners();
</script>

<div class="flex flex-col space-y-2 pb-3">
	<SaveBadge />
	<div class="flex space-x-2 w-full items-center">
		<Button size="lg" color="primary" on:click={saveCaseToFile}
			><DownloadSolid class="me-2" /> Uložit</Button
		>
		<Button size="lg" color="primary" on:click={readCaseFromFile}
			><UploadSolid class="me-2" />Načíst</Button
		>
	</div>
</div>

<Accordion multiple>
	<GeneralAccordion />
	<OffendersAccordion />
	<CrimesAccordion />
	<SentencesAccordion />
	<ResultAccordion />
</Accordion>
