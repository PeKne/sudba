import { open, message, save } from '@tauri-apps/api/dialog';
import { invoke } from '@tauri-apps/api/tauri';
import { readTextFile } from '@tauri-apps/api/fs';

import { get } from 'svelte/store';

import { activeCaseStore } from './caseStore';

export const readCaseFromFile = async () => {
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
		activeCaseStore.set(JSON.parse(fileContent as string));

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
		const savePath = await save({ title: 'Uložit případ.', defaultPath: activeCaseValues.fileId });
		if (!savePath) return;
		await invoke('save_file', {
			path: `${savePath}.sudba`,
			contents: JSON.stringify(get(activeCaseStore))
		});

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
