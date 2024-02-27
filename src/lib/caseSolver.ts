import { A, D, F, G, pipe } from '@mobily/ts-belt';
import type { ResultCaseStore, LabeledCrime, ResultSentence, SentenceId } from './types';

type ResultType = 'UHRN' | 'SOUHRN' | 'SAMOSTATNY';

type CaseResultLevel = {
	crimes: LabeledCrime[];
	canceledSentences?: ResultSentence[];
};

type CaseResult = {
	UHRN: { crimes: LabeledCrime[] };
	SOUHRN: { crimes: LabeledCrime[]; canceledSentences: ResultSentence[] };
	SAMOSTATNY: { crimes: LabeledCrime[] };
};

// TODO: move this elsewhere
const getConnectedSenteces = (
	sentenceId: SentenceId,
	sentences: ResultSentence[]
): ResultSentence[] => {
	const result: ResultSentence[] = [];
	let nextSentence = sentences.find((s) => s.id === sentenceId);
	while (G.isNotNullable(nextSentence)) {
		result.push(nextSentence);
		console.log('🚀 ~ result:', result);

		nextSentence = sentences.find((s) => s.cancelsSentece === nextSentence?.id);
	}

	return result;
};

const formatResultLevelMessage = (levelType: ResultType, caseLevel?: CaseResultLevel): string => {
	if (G.isNullable(caseLevel)) {
		return 'Nepodarilo se zjistit typ zlocinu';
	}

	const { crimes, canceledSentences } = caseLevel;

	const sentenceCrimes =
		canceledSentences?.reduce(
			(accumulator: LabeledCrime[], s) => accumulator.concat(s.crimesData),
			[]
		) ?? [];

	const areSentencesPlural = A.length(canceledSentences ?? []) > 1;

	const stringifiedSentences = canceledSentences?.map((s) => s.label).join(', ') ?? '';
	console.log('🚀 ~ formatResultLevelMessage ~ sentenceCrimes:', sentenceCrimes);
	const joinedCrimes = A.isNotEmpty(sentenceCrimes) ? A.concat(sentenceCrimes, crimes) : crimes;

	const formattedCrimes = joinedCrimes.map((crime) => crime.label ?? 'UNDEFINED').join(', ');
	// const formattedCrimes = caseLevel.crimes.map((_, index) => `SK${index + 1}`).join(', ');

	switch (levelType) {
		case 'UHRN':
			return `Úhrný trest ${formattedCrimes}`;

		case 'SOUHRN':
			// const formattedCanceledSentence = caseLevel.canceledSentence!.
			return `Souhrný trest ${formattedCrimes} při zrušení rozsudk${
				areSentencesPlural ? 'ů' : 'u'
			} ${stringifiedSentences}`;

		case 'SAMOSTATNY':
			// const formattedCanceledSentence = caseLevel.canceledSentence!.
			return `Samostatný trest ${formattedCrimes}`;

		default:
			return 'Nepodarilo se zjistit typ zlocinu';
	}
};

export const getResultLevels = (inputCase: ResultCaseStore): string[] => {
	const resultLevels = calculateCaseResult(inputCase);

	return pipe(
		resultLevels!,
		D.filter((value) => A.isNotEmpty(value.crimes)),
		D.mapWithKey((levelType, caseLevel) => formatResultLevelMessage(levelType, caseLevel)),
		D.values,
		F.toMutable
	);
};

export const calculateCaseResult = (inputCase: ResultCaseStore): CaseResult | null => {
	const { crimes, sentences } = inputCase;
	console.log(
		'🚀 ~ calculateCaseResult ~ sentences:',
		sentences.map((s) => s.cancelsSentece)
	);
	const sentencesCopy = [...sentences];

	const result: CaseResult = {
		UHRN: { crimes: [] },
		SOUHRN: { crimes: [], canceledSentences: [] },
		SAMOSTATNY: { crimes: [] }
	};

	const sortedSentences = sentencesCopy.sort(
		(a, b) => a.dateAnnounced?.localeCompare(b.dateAnnounced ?? '') ?? 0
	);
	const firstSentence = sortedSentences[0];

	const validCrimes = crimes.filter((crime) => crime.date !== '' && crime.date !== 'Date');

	validCrimes.forEach((crime) => {
		// UHRNY
		if (firstSentence.dateAnnounced === '' || firstSentence.dateAnnounced === 'Date') {
			result.UHRN.crimes.push(crime);
			return;
		}

		// SOUHRNY
		if (firstSentence.dateAnnounced > crime.date) {
			result.SOUHRN.crimes.push(crime);
			result.SOUHRN.canceledSentences = getConnectedSenteces(firstSentence.id, sentences);
		}

		if (firstSentence.dateAnnounced <= crime.date) {
			result.SAMOSTATNY.crimes.push(crime);
		}
	});

	// const findClosest
	return result;
};
