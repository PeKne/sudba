<script lang="ts">
	import { Accordion, Button, Select } from 'flowbite-svelte';

	import OffendersAccordion from '../lib/components/OffendersAccordion.svelte';
	import CrimesAccordion from '../lib/components/CrimesAccordion.svelte';
	import ResultAccordion from '../lib/components/ResultAccordion.svelte';
	import GeneralAccordion from '../lib/components/GeneralAccordion.svelte';
	import SentencesAccordion from '../lib/components/SentencesAccordion.svelte';

	import { DownloadSolid, UploadSolid, FileSolid } from 'flowbite-svelte-icons';

	import { confirmUnsavedChanges, readCaseFromFile, saveCaseToFile } from '../lib/fileSystem';
	import { A, D, F, pipe } from '@mobily/ts-belt';

	import SaveBadge from '../lib/components/SaveBadge.svelte';
	import { attachTauriListeners } from '../lib/tauriListeners';
	import { formStore } from '../lib/caseStore';
	import { testCaseFixtures } from '../lib/fixtures/caseSolver.fixture';

	const resetForm = async () => {
		if (!(await confirmUnsavedChanges())) return;
		formStore.reset();
	};
	attachTauriListeners();

	const items = pipe(
		testCaseFixtures,
		D.toPairs,
		A.map(([key, value]) => ({ value: key, name: value.fileId })),
		F.toMutable
	);

	const handleSelectTestCase = (event: Event) => {
		const input = event.target as HTMLInputElement;
		const testCaseKey = input.value;

		const selectedTestCase = testCaseFixtures[testCaseKey];

		formStore.set(selectedTestCase);
	};
</script>

<div class="flex flex-col space-y-2 pb-3">
	<SaveBadge />
	<div class="flex space-x-2 w-full items-center">
		<Button size="lg" color="primary" on:click={saveCaseToFile}
			><DownloadSolid class="me-2" />Uložit</Button
		>
		<Button size="lg" color="primary" on:click={readCaseFromFile}
			><UploadSolid class="me-2" />Načíst</Button
		>
		<Button size="lg" color="primary" on:click={resetForm}><FileSolid class="me-2" />Nový</Button>
		<Select {items} on:change={handleSelectTestCase} placeholder="vyberte testový příklad" />
	</div>
</div>

<Accordion multiple>
	<GeneralAccordion />
	<OffendersAccordion />
	<CrimesAccordion />
	<SentencesAccordion />
	<ResultAccordion />
</Accordion>
