import { writable, derived } from 'svelte/store';
import type {
	Case,
	Crime,
	CrimeId,
	LabeledCrime,
	ResultCaseStore,
	ResultSentence,
	Sentence,
	SentenceId
} from './types';
import { v4 as uuid4 } from 'uuid';
import { G, A, D } from '@mobily/ts-belt';

export const generateCrimeId = (): CrimeId => uuid4() as CrimeId;
export const generateSentenceId = (): CrimeId => uuid4() as CrimeId;

export const createEmptyCrime = (): Crime => ({ id: uuid4() as CrimeId });
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

const deepCopy = (obj: object) => JSON.parse(JSON.stringify(obj));

export const time = readable(new Date(), function start(set) {
	const interval = setInterval(() => {
		set(new Date());
	}, 1000);

	return function stop() {
		clearInterval(interval);
	};
});

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
	const sentencedCrimes = $activeCase.sentencedCrimes
		// .filter((c) => c.date)
		.map((crime, index) => ({
			...crime,
			label: `OSK${index + 1}`
		}));
	const resultData = {
		...$activeCase,
		crimes: $activeCase.crimes
			// .filter((c) => c.date)
			.map((crime, index) => ({ ...crime, label: `SK${index + 1}` })),
		sentences: $activeCase.sentences
			// .filter((s) => s.dateAnnounced)
			.map((sentence, index) => ({
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

type SenteceErrors = Record<keyof Sentence, string>;
type CrimeErrors = Record<keyof Crime, string>;

const validateSentences = (sentences: ResultSentence[]) => {
	const sentenceErrors: Record<SentenceId, SenteceErrors> = {};
	sentences.forEach((sentence) => {
		sentenceErrors[sentence.id] = {} as SenteceErrors;
		const { crimesData, dateAnnounced, dateLegallyForced, cancelsSentenceData } = sentence;
		if (!G.isArray(crimesData) || A.isEmpty(crimesData)) {
			sentenceErrors[sentence.id].crimes = 'Vyberte alespoň jeden skutek.';
		}

		if (G.isArray(crimesData) && dateAnnounced) {
			const laterCrimes = crimesData.filter(
				(crime) => crime.date && new Date(crime.date) > new Date(dateAnnounced)
			);

			if (laterCrimes.length > 0) {
				sentenceErrors[
					sentence.id
				].crimes = `Datum vyhlášení rozsudku nesmí být dříve než datum spáchání skutku ${laterCrimes[0].label}.`;
			}
		}

		if (cancelsSentenceData && cancelsSentenceData.dateAnnounced) {
			if (dateAnnounced && new Date(dateAnnounced) < new Date(cancelsSentenceData.dateAnnounced)) {
				sentenceErrors[
					sentence.id
				].cancelsSentece = `Datum zrušení nesmí být dříve než datum vyhlášení rozsudku ${cancelsSentenceData.label}.`;
			}
		}

		if (G.isNullable(dateAnnounced)) {
			sentenceErrors[sentence.id].dateAnnounced = 'Povinné pole.';
		}

		if (
			dateAnnounced &&
			dateLegallyForced &&
			new Date(dateAnnounced) > new Date(dateLegallyForced)
		) {
			sentenceErrors[sentence.id].dateLegallyForced =
				'Datum nabití právní moci nesmí být dříve než datum vyhlášení rozsudku.';
		}

		if (D.isEmpty(sentenceErrors[sentence.id])) delete sentenceErrors[sentence.id];
	});

	return sentenceErrors;
};

const validateCrimes = (crimes: Crime[]) => {
	const crimeErrors: Record<CrimeId, CrimeErrors> = {};
	crimes.forEach((crime) => {
		const { id, date } = crime;
		crimeErrors[id] = {} as CrimeErrors;
		if (G.isNullable(date)) {
			crimeErrors[id].date = 'Vyplňte datum.';
		}
		if (D.isEmpty(crimeErrors[id])) delete crimeErrors[id];
	});

	return crimeErrors;
};

export const formErrorsStore = derived(
	[resultActiveCaseStore, time],
	([$resultActiveCaseStore]) => {
		return {
			crimes: validateCrimes($resultActiveCaseStore.crimes),
			sentencedCrimes: validateCrimes($resultActiveCaseStore.sentencedCrimes),
			sentences: validateSentences($resultActiveCaseStore.sentences)
		};
	}
);

export const isErrorActive = derived([formErrorsStore, time], ([$formErrorsStore]) => {
	return (
		D.isNotEmpty($formErrorsStore.crimes) ||
		D.isNotEmpty($formErrorsStore.sentences) ||
		D.isNotEmpty($formErrorsStore.sentencedCrimes)
	);
});
