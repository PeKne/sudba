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
const getStartDateOfSentenceChain = (
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
		const { canceledSentences = [] } = level;

		const areSentencesPlural = A.length(canceledSentences) > 1;

		const sentencedAttackGroups = pipe(
			canceledSentences,
			A.map((sentence) => sentence.crimesData),
			A.flat,
			A.filter((c) => c.isAttack === 'yes')
		);

		const isUhrn =
			canceledSentences.length === 1 &&
			canceledSentences[0].crimesData.filter((c) => c.isAttack === 'yes');

		const formattedSentences = canceledSentences?.map((s) => s.label).join(', ') ?? '';
		return `${
			isUhrn ? 'Úhrný' : 'Souhrnný'
		} trest ${formattedCrimes} a současného zrušení výroku o trestu z rozsudk${
			areSentencesPlural ? 'ů' : 'u'
		} ${formattedSentences}`;
	} else {
		return `${crimes.length > 1 ? 'Úhrný' : 'Samostatný'} trest ${formattedCrimes}`;
	}
};

export const getSolutionLevels = (inputCase: ValidatedForm): Level[] => {
	const { crimes, sentences, firstCrimeDate, attacks, attackGroups } = inputCase;
	console.log('TCL: attackGroups', attackGroups);
	const sentencesCopy = [...sentences];
	const result: Level[] = [];

	if (A.isEmpty(crimes) && A.isEmpty(attacks)) return [];

	// TODO: rozdělit činy do skupin podle paragrafu a na ty nahlížet samostatně
	// pak pro každou skupinu zvlášť:
	//  - odstraň rozsudky, které proběhly před prvním skutkem k odsouzení
	// - vezmi první rozsudek, vše co bylo před ním, jde k němu do souhrnu
	// - vezmi další rozsudek a opakuj předchozí krok
	// - pokud dojdou rozsudky, a ještě zbývají tresty, jedná se o samotný trest

	let unsolvedCrimes = [...crimes];

	const dateOfFirstCrime = firstCrimeDate;

	const sortedRelevantSentences = sentencesCopy
		.sort((a, b) => a.dateAnnounced?.localeCompare(b.dateAnnounced ?? '') ?? 0)
		.filter((sentence) => new Date(sentence.dateAnnounced!) >= new Date(dateOfFirstCrime));

	sortedRelevantSentences.forEach((sentence) => {
		console.log('TCL: sentence', sentence);
		// this solves fake souhrn problem
		const chainStartDate = getStartDateOfSentenceChain(sentence, sentencesCopy);

		const precedingCrimes = unsolvedCrimes.filter((crime) => new Date(crime.date) < chainStartDate);

		const [relatedAttackGroups, unrelatedAttackGroups] = A.partition(
			attackGroups,
			(group) =>
				A.intersection(
					group.attacks.map((a) => a.id),
					sentence.crimes ?? []
				).length > 0
		);

		const relatedAttacks = relatedAttackGroups.flatMap((group) => group.attacks);

		// TODO: still use this for those that are not in the relatedAttackGroup
		// maybe just push all unrelated attack groups?
		const unrelatedAttacks = unrelatedAttackGroups
			.flatMap((group) => group.attacks)
			.filter((crime) => new Date(crime.date) < chainStartDate);

		// if there are no preceding crimes, add the sentence to the last souhrn level
		if (A.isEmpty(precedingCrimes) && A.isEmpty(relatedAttacks)) {
			const lastSouhrnLevel = A.reverse(result).find((level) => isSouhrn(level)) as
				| SouhrnLevel
				| undefined;

			const isSentenceChainAlreadySolved = !!lastSouhrnLevel?.canceledSentences.find(
				(s) => s.id === sentence.id
			);

			if (!isSentenceChainAlreadySolved) lastSouhrnLevel?.canceledSentences.push(sentence);

			return;
		}

		result.push({
			crimes: [...precedingCrimes, ...relatedAttacks]
				.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
				.filter((c) => c.wasSentenced !== true),
			canceledSentences: getConnectedSenteces(sentence.id, sentences),
			__type: 'SOUHRN'
		});

		unsolvedCrimes = F.toMutable(A.sliceToEnd(unsolvedCrimes, precedingCrimes.length));
	});

	if (A.isNotEmpty(unsolvedCrimes)) {
		const lastLevel: SamostatnyLevel = {
			crimes: unsolvedCrimes,
			__type: 'SAMOSTATNY'
		};

		result.push(lastLevel);
	}

	console.log('TCL: result', result);
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
