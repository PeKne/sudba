export type CrimeId = string & { __brand: 'CrimeId' };
export type SentenceId = string & { __brand: 'SentenceId' };

export type Offender = {
	name: string;
};

export type Crime = {
	id: CrimeId;
	date?: string;
	valueStolen?: number;
	valueDestroyed?: number;
	note?: string;
};

export type Sentence = {
	id: SentenceId;
	fileId?: string;
	filePage?: number;
	court?: string; // TODO: change to union of strings
	dateAnnounced?: string;
	isLegallyForced?: boolean;
	dateLegallyForced?: string;
	crimes?: CrimeId[];
	cancelsSentece?: SentenceId;
};

export type Case = {
	fileId: string;
	offender: Offender;
	crimes: Crime[];
	sentencedCrimes: Crime[];
	sentences: Sentence[];
};

export type LabeledCrime = Required<Crime> & { label: string; date: string };

export type ResultSentence = Sentence & {
	crimesData: LabeledCrime[];
	cancelsSentenceData?: ResultSentence;
	dateAnnouncedData: string;
	label: string;
};

export type ResultCaseStore = {
	crimes: LabeledCrime[];
	sentencedCrimes: LabeledCrime[];
	sentences: ResultSentence[];
	fileId: string;
	offender: Offender;
};
