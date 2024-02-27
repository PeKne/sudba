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
	id: uuid4() as SentenceId
});

const defaultCaseValue: Case = {
	fileId: '',
	offender: {
		name: ''
	},
	crimes: [createEmptyCrime()],
	sentencedCrimes: [createEmptyCrime()],
	sentences: [createEmptySentence()]
};

import { readable } from 'svelte/store';

export const time = readable(new Date(), function start(set) {
	const interval = setInterval(() => {
		set(new Date());
	}, 1000);

	return function stop() {
		clearInterval(interval);
	};
});

const createCaseStore = () => {
	const store = writable<Case>(defaultCaseValue);

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
			})
	};
};

export const activeCaseStore = createCaseStore();

export const resultActiveCaseStore = derived([activeCaseStore, time], ([$activeCase]) => {
	const sentencedCrimes = $activeCase.sentencedCrimes.map((crime, index) => ({
		...crime,
		label: `OSK${index + 1}`
	}));
	const resultData = {
		...$activeCase,
		crimes: $activeCase.crimes.map((crime, index) => ({ ...crime, label: `SK${index + 1}` })),
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
			console.log(new Date(dateAnnounced), new Date(cancelsSentenceData.dateAnnounced));
			if (dateAnnounced && new Date(dateAnnounced) < new Date(cancelsSentenceData.dateAnnounced)) {
				console.log('HERERERE!!!');
				sentenceErrors[
					sentence.id
				].cancelsSentece = `Datum zrušení nesmí být dříve než datum vyhlášení rozsudku ${cancelsSentenceData.label}.`;
			}
		}

		if (sentence.filePage && sentence.filePage < 5) {
			sentenceErrors[sentence.id].filePage = 'OMG insert the page';
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
