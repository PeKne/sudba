import { TauriEvent } from '@tauri-apps/api/event';
import { appWindow } from '@tauri-apps/api/window';
import { readCaseFromFile, saveCaseToFile, confirmUnsavedChanges } from './fileSystem';

export const attachTauriListeners = () => {
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
		const confirmed = await confirmUnsavedChanges();
		if (!confirmed) {
			// user did not confirm closing the window; let's prevent it
			event.preventDefault();
		}
	});
};
