/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { A, F, G, pipe } from '@mobily/ts-belt';
import type { ValidatedForm, ValidatedCrime, ValidatedSentence, SentenceId } from './types';

type LevelCommon = {
	crimes: ValidatedCrime[];
};

// ještě nepoučený pachatel znovu páchá
type SouhrnLevel = LevelCommon & {
	canceledSentences: ValidatedSentence[];
	readonly __type: 'SOUHRN';
};

// nedoplňuje předchozí rozsudek, protože pachatel už měl být poučen ==> přísnější trest
type SamostatnyLevel = LevelCommon & {
	readonly __type: 'SAMOSTATNY';
};

type Level = SouhrnLevel | SamostatnyLevel;

//TODO: do not pass sentences on every call
const getFirstSentenceDate = (
	sentence: ValidatedSentence,
	allSetences: ValidatedSentence[]
): Date => {
	let lastSentence = sentence;
	while (G.isNotNullable(lastSentence.cancelsSentece)) {
		lastSentence = allSetences.find((s) => s.id === lastSentence.cancelsSentece)!;
	}

	return new Date(lastSentence.dateAnnounced!);
};

const getConnectedSenteces = (
	sentenceId: SentenceId,
	sentences: ValidatedSentence[]
): ValidatedSentence[] => {
	const resultSentences: ValidatedSentence[] = [];
	let nextSentence = sentences.find((s) => s.id === sentenceId);

	while (G.isNotNullable(nextSentence)) {
		resultSentences.push(nextSentence);
		nextSentence = sentences.find((s) => s.cancelsSentece === nextSentence?.id);
	}

	return resultSentences;
};

export const isSouhrn = (value: Level): value is SouhrnLevel => value.__type === 'SOUHRN';

const formatResultLevelMessage = (level: Level): string => {
	const { crimes } = level;

	const formattedCrimes = crimes.map((crime) => crime.label ?? 'UNDEFINED').join(', ');

	if (isSouhrn(level)) {
		const { canceledSentences } = level;

		const areSentencesPlural = A.length(canceledSentences ?? []) > 1;
		const formattedSentences = canceledSentences?.map((s) => s.label).join(', ') ?? '';
		return `Souhrný trest ${formattedCrimes} a současného zrušení výroku o trestu z rozsudk${
			areSentencesPlural ? 'ů' : 'u'
		} ${formattedSentences}`;
	} else {
		return `${crimes.length > 1 ? 'Úhrný' : 'Samostatný'} trest ${formattedCrimes}`;
	}
};

export const getSolutionLevels = (inputCase: ValidatedForm): Level[] => {
	const { crimes, sentences } = inputCase;
	const sentencesCopy = [...sentences];
	const result: Level[] = [];

	// TODO: rozdělit činy do skupin podle paragrafu a na ty nahlížet samostatně
	// pak pro každou skupinu zvlášť:
	//  - odstraň rozsudky, které proběhly před prvním skutkem k odsouzení
	// - vezmi první rozsudek, vše co bylo před ním, jde k němu do souhrnu
	// - vezmi další rozsudek a opakuj předchozí krok
	// - pokud dojdou rozsudky, a ještě zbývají tresty, jedná se o samotný trest

	let sortedCrimes = crimes.sort((a, b) => a.date?.localeCompare(b.date ?? '') ?? 0);

	if (A.isEmpty(sortedCrimes)) return [];

	const dateOfFirstCrime = sortedCrimes[0].date;

	const sortedRelevantSentences = sentencesCopy
		.sort((a, b) => a.dateAnnounced?.localeCompare(b.dateAnnounced ?? '') ?? 0)
		.filter((sentence) => new Date(sentence.dateAnnounced!) >= new Date(dateOfFirstCrime));

	sortedRelevantSentences.forEach((sentence) => {
		// this solves fake souhrn problem
		const firstDateOfConnectedSentences = getFirstSentenceDate(sentence, sentencesCopy);

		const precedingCrimes = sortedCrimes.filter(
			(crime) => new Date(crime.date) < firstDateOfConnectedSentences
		);

		// if there are no preceding crimes, add the sentence to the last souhrn level
		if (A.isEmpty(precedingCrimes)) {
			const lastouhrnLevel = A.reverse(result).find((level) => isSouhrn(level)) as
				| SouhrnLevel
				| undefined;

			const isAlreadyPresent = !!lastouhrnLevel?.canceledSentences.find(
				(s) => s.id === sentence.id
			);

			if (!isAlreadyPresent) lastouhrnLevel?.canceledSentences.push(sentence);
		}

		if (A.isNotEmpty(precedingCrimes)) {
			result.push({
				crimes: precedingCrimes,
				canceledSentences: getConnectedSenteces(sentence.id, sentences),
				__type: 'SOUHRN'
			});

			sortedCrimes = F.toMutable(A.sliceToEnd(sortedCrimes, precedingCrimes.length));
		}
	});

	if (A.isNotEmpty(sortedCrimes)) {
		const lastLevel: SamostatnyLevel = {
			crimes: sortedCrimes,
			__type: 'SAMOSTATNY'
		};

		result.push(lastLevel);
	}

	return result;
};

export const solveCase = (inputCase: ValidatedForm): string[] => {
	const resultLevels = getSolutionLevels(inputCase);

	return pipe(
		resultLevels,
		A.map((level) => formatResultLevelMessage(level)),
		F.toMutable
	);
};
