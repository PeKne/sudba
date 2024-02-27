import { open, message, save, ask } from '@tauri-apps/api/dialog';
import { invoke } from '@tauri-apps/api/tauri';
import { readTextFile } from '@tauri-apps/api/fs';

import { get } from 'svelte/store';

import { activeCaseStore, isUnsavedStore, lastSavedState } from './caseStore';
import { S } from '@mobily/ts-belt';

// TODO: check if there are unsaved changes first, if yes offer save
export const confirmUnsavedChanges = async () => {
	if (!get(isUnsavedStore)) return true;

	return await ask(
		"Pokud stisknete 'Ano', přijdete o všechny neuložené změny. Chcete pokračovat?",
		{
			title: 'Neuložené změny',
			okLabel: 'Ano',
			cancelLabel: 'Ne',
			type: 'warning'
		}
	);
};

export const readCaseFromFile = async () => {
	if (!(await confirmUnsavedChanges())) return;

	try {
		const selectedPath = await open({
			multiple: false,
			filters: [
				{
					name: 'Soubory Sudba',
					extensions: ['sudba']
				}
			]
		});
		if (!selectedPath) return null;

		if (selectedPath.includes('.sudba') === false) {
			message(`Soubor ${selectedPath} nelze otevřít. Nahrajte platný soubor s příponou '.sudba'`, {
				title: 'Neplatný soubor!',
				type: 'error'
			});
			return null;
		}

		const fileContent = (await readTextFile(selectedPath as string)) ?? null;
		lastSavedState.set(fileContent as string);

		const parsedValues = JSON.parse(fileContent as string);
		activeCaseStore.set(parsedValues);

		message(`Případ ze souboru ${selectedPath} byl načten.`, {
			title: 'soubor načten',
			type: 'info'
		});
	} catch (error: unknown) {
		message(`Při načítání souboru došlo k chybě: ${(error as Error).message}`, {
			title: 'Chyba',
			type: 'error'
		});
	}
};

export const saveCaseToFile = async () => {
	try {
		// TODO: handle versioning
		const activeCaseValues = get(activeCaseStore);
		const defaultPath = S.isNotEmpty(activeCaseValues.fileId)
			? activeCaseValues.fileId
			: new Date().toLocaleDateString('es-CL');
		const savePath = await save({ title: 'Uložit případ.', defaultPath });
		if (!savePath) return;

		const serializedValues = JSON.stringify(activeCaseValues);
		await invoke('save_file', {
			path: `${savePath}.sudba`,
			contents: serializedValues
		});

		lastSavedState.set(serializedValues);

		message(`Případ byl uložen do souboru ${savePath}.`, {
			title: 'soubor uložen',
			type: 'info'
		});
	} catch (error: unknown) {
		message(`Při ukládání souboru došlo k chybě: ${(error as Error).message}`, {
			title: 'Chyba',
			type: 'error'
		});
	}
};
