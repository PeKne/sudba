import { A, D, G, pipe } from '@mobily/ts-belt';
import type { ResultCaseStore, LabeledCrime, ResultSentence } from './types';

type ResultType = 'UHRN' | 'SOUHRN' | 'SAMOSTATNY';

type CaseResultLevel = {
	crimes: ResultCaseStore['crimes'];
	canceledSentence?: ResultCaseStore['sentences'][0];
};

type CaseResult = {
	UHRN: { crimes: LabeledCrime[] };
	SOUHRN: { crimes: LabeledCrime[]; canceledSentence?: ResultSentence };
	SAMOSTATNY: { crimes: LabeledCrime[] };
};

const formatResultLevelMessage = (levelType: ResultType, caseLevel?: CaseResultLevel): string => {
	if (G.isNullable(caseLevel)) {
		return 'Nepodarilo se zjistit typ zlocinu';
	}

	const { crimes, canceledSentence } = caseLevel;

	const sentenceCrimes = canceledSentence?.crimesData ?? [];
	const joinedCrimes = A.isNotEmpty(sentenceCrimes) ? A.concat(sentenceCrimes, crimes) : crimes;

	const formattedCrimes = joinedCrimes.map((crime) => crime.label ?? 'UNDEFINED').join(', ');
	// const formattedCrimes = caseLevel.crimes.map((_, index) => `SK${index + 1}`).join(', ');

	switch (levelType) {
		case 'UHRN':
			return `Úhrný trest ${formattedCrimes}`;

		case 'SOUHRN':
			// const formattedCanceledSentence = caseLevel.canceledSentence!.
			return `Souhrný trest ${formattedCrimes} při zrušení rozsudku ${canceledSentence?.label}`;

		case 'SAMOSTATNY':
			// const formattedCanceledSentence = caseLevel.canceledSentence!.
			return `Samostatný trest ${formattedCrimes}`;

		default:
			return 'Nepodarilo se zjistit typ zlocinu';
	}
};

export const formatCaseResultMessage = (resultLevels: CaseResult): string => {
	// TODO: for each category create a message with its crimes
	// TODO: later print canceled sentence

	return pipe(
		resultLevels,
		D.filter((value) => A.isNotEmpty(value.crimes)),
		D.mapWithKey((levelType, caseLevel) => formatResultLevelMessage(levelType, caseLevel)),
		D.values,
		A.join('\n')
	);
};

export const calculateCaseResult = (inputCase: ResultCaseStore): CaseResult | null => {
	const { crimes, sentences } = inputCase;
	const sentencesCopy = [...sentences];

	const result: CaseResult = {
		UHRN: { crimes: [] },
		SOUHRN: { crimes: [] },
		SAMOSTATNY: { crimes: [] }
	};

	const sortedSentences = sentencesCopy.sort((a, b) =>
		a.dateAnnounced.localeCompare(b.dateAnnounced)
	);
	const firstSentence = sortedSentences[0];

	const validCrimes = crimes.filter((crime) => crime.date !== '' && crime.date !== 'Date');

	validCrimes.forEach((crime) => {
		console.log(firstSentence.dateAnnounced);
		// UHRNY
		if (firstSentence.dateAnnounced === '' || firstSentence.dateAnnounced === 'Date') {
			result.UHRN.crimes.push(crime);
			return;
		}

		// SOUHRNY
		if (firstSentence.dateAnnounced > crime.date) {
			result.SOUHRN.crimes.push(crime);
			result.SOUHRN.canceledSentence = firstSentence;
		}

		if (firstSentence.dateAnnounced <= crime.date) {
			result.SAMOSTATNY.crimes.push(crime);
		}
	});

	console.log('🚀 ~ calculateCaseResult ~ result:', result);
	// const findClosest
	return result;
};
