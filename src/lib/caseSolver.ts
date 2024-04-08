/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { A, D, F, G, pipe } from '@mobily/ts-belt';
import type { ValidatedForm, ValidatedCrime, ValidatedSentence, SentenceId } from './types';

type LevelCommon = {
	crimes: ValidatedCrime[];
};

// ještě nepoučený pachatel znovu páchá
type SouhrnLevel = LevelCommon & {
	canceledSentences: ValidatedSentence[];
	readonly __type: 'SOUHRN';
};

// nový trest, protože pachatel už měl být poučen předchozím rozsudkem
type SamostatnyLevel = LevelCommon & {
	readonly __type: 'SAMOSTATNY';
};

type Level = SouhrnLevel | SamostatnyLevel;

const getConnectedSenteces = (
	sentenceId: SentenceId,
	sentences: ValidatedSentence[]
): ValidatedSentence[] => {
	const resultSentences: ValidatedSentence[] = [];
	let nextSentence = sentences.find((s) => s.id === sentenceId);

	while (G.isNotNullable(nextSentence)) {
		resultSentences.push(nextSentence);
		nextSentence = nextSentence.cancelsSentenceData;
	}

	return resultSentences;
};

const isSouhrn = (value: Level): value is SouhrnLevel => value.__type === 'SOUHRN';

const formatResultLevelMessage = (level: Level): string => {
	const { crimes } = level;

	const formattedCrimes = crimes.map((crime) => crime.label ?? 'UNDEFINED').join(', ');

	if (isSouhrn(level)) {
		const { canceledSentences } = level;

		const areSentencesPlural = A.length(canceledSentences ?? []) > 1;
		const formattedSentences = canceledSentences?.map((s) => s.label).join(', ') ?? '';
		return `Souhrný trest ${formattedCrimes} a současného zrušení výroku o trestu z rozsudk${
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

	const dateOfFirstCrime = sortedCrimes[0].date;

	const sortedRelevantSentences = sentencesCopy
		.sort((a, b) => a.dateAnnounced?.localeCompare(b.dateAnnounced ?? '') ?? 0)
		.filter((sentence) => new Date(sentence.dateAnnounced!) >= new Date(dateOfFirstCrime));

	sortedRelevantSentences.forEach((sentence) => {
		const precedingCrimes = sortedCrimes.filter(
			(crime) => new Date(crime.date) < new Date(sentence.dateAnnounced!)
		);

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
