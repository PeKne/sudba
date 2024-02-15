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

export const generateCrimeId = (): CrimeId => uuid4() as CrimeId;
export const generateSentenceId = (): CrimeId => uuid4() as CrimeId;

export const createEmptyCrime = (): Crime => ({ ...EMPTY_CRIME_TEMPLATE, id: uuid4() as CrimeId });
export const createEmptySentence = (): Sentence => ({
	...EMPTY_SENTENCE_TEMPLATE,
	id: uuid4() as SentenceId
});

export const EMPTY_CRIME_TEMPLATE: Omit<Crime, 'id'> = {
	date: '',
	valueStolen: 0,
	valueDestroyed: 0,
	note: ''
};

export const EMPTY_SENTENCE_TEMPLATE = {
	fileId: '',
	filePage: 0,
	court: '',
	dateAnnounced: 'Date',
	isLegallyForced: false,
	dateLegallyForced: ''
};

const defaultCaseValue: Case = {
	fileId: '',
	offender: {
		name: ''
	},
	crimes: [createEmptyCrime()],
	sentencedCrimes: [createEmptyCrime()],
	sentences: [createEmptySentence()]
};

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

export const resultActiveCaseStore = derived(activeCaseStore, ($activeCase) => {
	const sentencedCrimes = $activeCase.sentencedCrimes.map((crime, index) => ({
		...crime,
		label: `OSK${index + 1}`
	}));
	return {
		...$activeCase,
		crimes: $activeCase.crimes.map((crime, index) => ({ ...crime, label: `SK${index + 1}` })),
		sentences: $activeCase.sentences.map((sentence, index) => ({
			...sentence,
			label: `R${index + 1}`,
			// crimesData: (sentence.crimes?.map((crimeId) =>
			// 	$activeCase.sentencedCrimes.find((crime) => {
			// 		console.log(crimeId, crime);
			// 		crime.id === crimeId;
			// 	})

			crimesData: sentencedCrimes.filter(
				(crime) => sentence.crimes?.includes(crime.id) ?? false
			) as LabeledCrime[]
		})),
		sentencedCrimes
	} as ResultCaseStore;
});

//  TODO: on deleted crime, remove it from senteces
