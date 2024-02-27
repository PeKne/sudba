<script>
	import { Accordion, Button, Indicator, Badge } from 'flowbite-svelte';

	import OffendersAccordion from '../lib/components/OffendersAccordion.svelte';
	import CrimesAccordion from '../lib/components/CrimesAccordion.svelte';
	import ResultAccordion from '../lib/components/ResultAccordion.svelte';
	import GeneralAccordion from '../lib/components/GeneralAccordion.svelte';
	import SentencesAccordion from '../lib/components/SentencesAccordion.svelte';

	import { DownloadSolid, UploadSolid } from 'flowbite-svelte-icons';

	import { readCaseFromFile, saveCaseToFile, confirmUnsavedChanges } from '../lib/fileSystem';
	import { isUnsavedStore } from '../lib/caseStore';

	import { appWindow } from '@tauri-apps/api/window';
	import { TauriEvent } from '@tauri-apps/api/event';

	appWindow.listen('app:quit', async () => {
		appWindow.emit(TauriEvent.WINDOW_CLOSE_REQUESTED);
	});

	appWindow.listen('file:load-file', () => {
		readCaseFromFile();
	});

	appWindow.listen('file:save-file', () => {
		saveCaseToFile();
	});

	appWindow.onCloseRequested(async (event) => {
		console.log(event);
		const confirmed = await confirmUnsavedChanges();
		if (!confirmed) {
			// user did not confirm closing the window; let's prevent it
			event.preventDefault();
		}
	});
</script>

<div class="flex flex-col space-y-2 pb-3">
	<div>
		<Badge color={$isUnsavedStore ? 'red' : 'green'} rounded class="px-2.5 py-0.5">
			<Indicator color={$isUnsavedStore ? 'red' : 'green'} size="xs" class="me-1" />{$isUnsavedStore
				? 'Neuloženo'
				: 'Uloženo'}
		</Badge>
	</div>
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
