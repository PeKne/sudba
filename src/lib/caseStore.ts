import { writable, derived, readable } from 'svelte/store';
import { D } from '@mobily/ts-belt';
import { v4 as uuid4 } from 'uuid';

import type {
	RawForm,
	RawCrime,
	CrimeId,
	ValidatedCrime,
	ValidatedForm,
	RawSentence,
	SentenceId
} from './types';

import { groupAttacksToCrimes } from './formatters';
import { validateCrimes, validateSentences } from './validators';

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
	sentencedCrimes: [createEmptyCrime()],
	sentences: [createEmptySentence()]
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
		sortSentences: () =>
			store.update((activeCase) => {
				activeCase.sentences = [
					...activeCase.sentences.sort((a, b) => a.dateAnnounced.localeCompare(b.dateAnnounced))
				];
				return activeCase;
			}),
		sortCrimes: () =>
			store.update((activeCase) => {
				activeCase.crimes = [...activeCase.crimes.sort((a, b) => a.date.localeCompare(b.date))];
				return activeCase;
			}),
		sortSentencedCrimes: () =>
			store.update((activeCase) => {
				activeCase.sentencedCrimes = [
					...activeCase.sentencedCrimes.sort((a, b) => a.date.localeCompare(b.date))
				];
				return activeCase;
			}),
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

export const validatedFormStore = derived([formStore, timeStore], ([$activeCase]) => {
	const sentencedCrimes = $activeCase.sentencedCrimes.map((crime, index) => ({
		...crime,
		label: `OSK${index + 1}`
	}));

	const attacks = $activeCase.crimes
		.filter((crime) => crime.isAttack !== 'no')
		.sort(function (crime1, crime2) {
			return new Date(crime1.date!).getMilliseconds() - new Date(crime2.date!).getMilliseconds();
		})
		.map((attack, index) => ({ ...attack, label: `U${index + 1}` }));

	const attackGroups = groupAttacksToCrimes(attacks);

	const resultData = {
		...$activeCase,
		attacks,
		attackGroups,
		crimes: $activeCase.crimes
			.filter((crime) => crime.isAttack === 'no')
			.map((crime, index) => ({ ...crime, label: `SK${index + 1}` })),
		sentences: $activeCase.sentences.map((sentence, index) => ({
			...sentence,
			label: `R${index + 1}`,
			crimesData: sentencedCrimes.filter(
				(crime) => sentence.crimes?.includes(crime.id) ?? false
			) as ValidatedCrime[]
		})),
		sentencedCrimes
	} as ValidatedForm;

	// append related sentence data to each sentence
	resultData.sentences = resultData.sentences.map((sentence) => ({
		...sentence,
		cancelsSentenceData: resultData.sentences.find((s) => s.id === sentence.cancelsSentece)
	}));

	return resultData;
});

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
