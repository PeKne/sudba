import { writable, derived } from 'svelte/store';
import type {
	Case,
	Crime,
	CrimeId,
	LabeledCrime,
	ResultCaseStore,
	Sentence,
	SentenceId
} from './types';
import { v4 as uuid4 } from 'uuid';
import { validateCrimes, validateSentences } from './validators';
import { D } from '@mobily/ts-belt';

export const generateCrimeId = (): CrimeId => uuid4() as CrimeId;
export const generateSentenceId = (): CrimeId => uuid4() as CrimeId;

export const createEmptyCrime = (): Crime => ({
	id: uuid4() as CrimeId,
	isAttack: 'no',
	isMainOffender: false
});
export const createEmptySentence = (): Sentence => ({
	id: uuid4() as SentenceId,
	isLegallyForced: false,
	crimes: []
});

export const defaultCaseValue: Case = {
	fileId: '',
	offender: {
		name: ''
	},
	crimes: [createEmptyCrime()],
	sentencedCrimes: [createEmptyCrime()],
	sentences: [createEmptySentence()]
};

import { readable } from 'svelte/store';
import { groupAttacksToCrimes } from './formatters';

const deepCopy = (obj: object) => JSON.parse(JSON.stringify(obj));

export const time = readable(new Date(), function start(set) {
	const interval = setInterval(() => {
		set(new Date());
	}, 1000);

	return function stop() {
		clearInterval(interval);
	};
});

// TODO: rename to FormStore!
// also rename Crime, Sentence etc. types to something like ...Input or ...Raw
const createCaseStore = () => {
	const store = writable<Case>(deepCopy(defaultCaseValue));

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
		reset: () => store.set(deepCopy(defaultCaseValue))
	};
};

export const activeCaseStore = createCaseStore();

export const lastSavedState = writable(JSON.stringify(defaultCaseValue));
export const isUnsavedStore = derived(
	[activeCaseStore, lastSavedState, time],
	([$activeCase, $lastSavedState]) => {
		return JSON.stringify($activeCase) !== $lastSavedState;
	}
);

export const resultActiveCaseStore = derived([activeCaseStore, time], ([$activeCase]) => {
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
	console.log('🚀 ~ resultActiveCaseStore ~ attackGroups:', attackGroups);

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
			) as LabeledCrime[]
		})),
		sentencedCrimes
	} as ResultCaseStore;

	// append related sentence data to each sentence
	resultData.sentences = resultData.sentences.map((sentence) => ({
		...sentence,
		cancelsSentenceData: resultData.sentences.find((s) => s.id === sentence.cancelsSentece)
	}));

	return resultData;
});

export const formErrorsStore = derived([activeCaseStore, time], ([$activeCaseStore]) => {
	return {
		crimes: validateCrimes($activeCaseStore.crimes),
		sentencedCrimes: validateCrimes($activeCaseStore.sentencedCrimes),
		sentences: validateSentences({
			sentences: $activeCaseStore.sentences,
			sentencedCrimes: $activeCaseStore.sentencedCrimes
		})
	};
});

export const isErrorActive = derived([formErrorsStore, time], ([$formErrorsStore]) => {
	return (
		D.isNotEmpty($formErrorsStore.crimes) ||
		D.isNotEmpty($formErrorsStore.sentences) ||
		D.isNotEmpty($formErrorsStore.sentencedCrimes)
	);
});
