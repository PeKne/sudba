/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { G, D, A } from '@mobily/ts-belt';
import type {
	RawSentence,
	RawCrime,
	SentenceId,
	CrimeId,
	RawForm,
	ValidatedCrime,
	ValidatedForm
} from './types';
import { groupAttacksToCrimes, sortByDate } from './formatters';

type SenteceErrors = Record<keyof RawSentence, string>;
type CrimeErrors = Record<keyof RawCrime, string>;

export const validateSentences = ({
	sentences,
	sentencedCrimes
}: {
	sentences: RawSentence[];
	sentencedCrimes: RawCrime[];
}) => {
	const sentenceErrors: Record<SentenceId, SenteceErrors> = {};
	sentences.forEach((sentence) => {
		sentenceErrors[sentence.id] = {} as SenteceErrors;
		const { dateAnnounced, dateLegallyForced } = sentence;
		const crimesData = sentencedCrimes.filter(
			(crime) => sentence.crimes?.includes(crime.id) ?? false
		);

		const canceledSentece = sentences.find((s) => s.id === sentence.cancelsSentece);

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
				].crimes = `Datum vyhlášení rozsudku nesmí být dříve než datum spáchání skutku.`;
			}
		}

		if (canceledSentece && canceledSentece.dateAnnounced) {
			if (dateAnnounced && new Date(dateAnnounced) < new Date(canceledSentece.dateAnnounced)) {
				sentenceErrors[
					sentence.id
				].cancelsSentece = `Datum zrušení nesmí být dříve než datum vyhlášení rozsudku.`;
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

export const validateCrimes = (crimes: RawCrime[]) => {
	const crimeErrors: Record<CrimeId, CrimeErrors> = {};
	crimes.forEach((crime) => {
		const { id, date, isAttack, dateDisclosed, paragraph } = crime;
		const isAttackCrime = isAttack !== 'no';
		crimeErrors[id] = {} as CrimeErrors;
		if (G.isNullable(date)) {
			crimeErrors[id].date = 'Vyplňte datum.';
		}
		if (isAttackCrime && G.isNullable(dateDisclosed)) {
			crimeErrors[id].dateDisclosed = 'Vyplňte datum.';
		}
		if (G.isNullable(paragraph)) {
			crimeErrors[id].paragraph = 'Vyberte právní kvalifikaci.';
		}

		if (D.isEmpty(crimeErrors[id])) delete crimeErrors[id];
	});

	return crimeErrors;
};

export const cleanFormData = (form: RawForm) => {
	const sentencedCrimes = form.sentencedCrimes.map((crime, index) => ({
		...crime,
		label: crime.isAttack === 'no' ? `OSK${index + 1}` : `OU${index + 1}`
	}));

	const sortedCrimes = sortByDate(
		form.crimes.map((crime, index) => ({
			...crime,
			label: crime.isAttack === 'no' ? `SK${index + 1}` : `U${index + 1}`
		}))
	);

	const sentencedAttacks = sentencedCrimes
		.filter((crime) => crime.isAttack !== 'no')
		.map((attack) => ({ ...attack, wasSentenced: true }));
	const newAttacks = sortedCrimes
		.filter((crime) => crime.isAttack !== 'no')
		.map((attack) => ({ ...attack, wasSentenced: false }));

	const attacks = [...sentencedAttacks, ...newAttacks] as ValidatedCrime[];

	// TODO: sentenced attacks aswell
	const attackGroups = groupAttacksToCrimes(attacks);

	const resultData = {
		...form,
		attacks,
		attackGroups,
		firstCrimeDate: sortedCrimes[0]?.date,
		crimes: sortedCrimes.filter((crime) => crime.isAttack === 'no'),
		sentences: form.sentences.map((sentence, index) => ({
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
};
