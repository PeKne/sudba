import { writable, derived, readable } from 'svelte/store';
import { D } from '@mobily/ts-belt';
import { v4 as uuid4 } from 'uuid';

import type { RawForm, RawCrime, CrimeId, RawSentence, SentenceId } from './types';

import { cleanFormData, validateCrimes, validateSentences } from './validators';

const deepCopy = (obj: object) => JSON.parse(JSON.stringify(obj));
export const generateCrimeId = (): CrimeId => uuid4() as CrimeId;
export const generateSentenceId = (): CrimeId => uuid4() as CrimeId;

export const createEmptyCrime = (): RawCrime => ({
	id: uuid4() as CrimeId,
	isAttack: 'no',
	isMainOffender: false
});
export const createEmptySentence = (): RawSentence => ({
	id: uuid4() as SentenceId,
	isLegallyForced: false,
	crimes: []
});

export const defaultFormValues: RawForm = {
	fileId: '',
	offender: {
		name: ''
	},
	crimes: [createEmptyCrime()],
	sentencedCrimes: [],
	sentences: []
};

export const timeStore = readable(new Date(), function start(set) {
	const interval = setInterval(() => {
		set(new Date());
	}, 1000);

	return function stop() {
		clearInterval(interval);
	};
});

// TODO: rename to FormStore!
// also rename Crime, Sentence etc. types to something like ...Input or ...Raw
const createFormStore = () => {
	const store = writable<RawForm>(deepCopy(defaultFormValues));

	return {
		...store,
		// sortSentences: () =>
		// 	store.update((activeCase) => {
		// 		activeCase.sentences = [
		// 			...activeCase.sentences.sort((a, b) => a.dateAnnounced.localeCompare(b.dateAnnounced))
		// 		];
		// 		return activeCase;
		// 	}),
		// sortCrimes: () =>
		// 	store.update((activeCase) => {
		// 		activeCase.crimes = [...activeCase.crimes.sort((a, b) => a.date.localeCompare(b.date))];
		// 		return activeCase;
		// 	}),
		// sortSentencedCrimes: () =>
		// 	store.update((activeCase) => {
		// 		activeCase.sentencedCrimes = [
		// 			...activeCase.sentencedCrimes.sort((a, b) => a.date && a.date?.localeCompare(b.date))
		// 		];
		// 		return activeCase;
		// 	}),
		reset: () => store.set(deepCopy(defaultFormValues))
	};
};

export const formStore = createFormStore();

export const lastSavedSnaphotStore = writable(JSON.stringify(defaultFormValues));
export const isFormUnsavedStore = derived(
	[formStore, lastSavedSnaphotStore, timeStore],
	([$activeCase, $lastSavedState]) => {
		return JSON.stringify($activeCase) !== $lastSavedState;
	}
);
// TODO: no undefines should be present here
export const validatedFormStore = derived([formStore, timeStore], ([$activeCase]) =>
	cleanFormData($activeCase)
);

export const formErrorsStore = derived([formStore, timeStore], ([$formStore]) => {
	return {
		crimes: validateCrimes($formStore.crimes),
		sentencedCrimes: validateCrimes($formStore.sentencedCrimes),
		sentences: validateSentences({
			sentences: $formStore.sentences,
			sentencedCrimes: $formStore.sentencedCrimes
		})
	};
});

export const isErrorStore = derived([formErrorsStore, timeStore], ([$formErrorsStore]) => {
	return (
		D.isNotEmpty($formErrorsStore.crimes) ||
		D.isNotEmpty($formErrorsStore.sentences) ||
		D.isNotEmpty($formErrorsStore.sentencedCrimes)
	);
});
