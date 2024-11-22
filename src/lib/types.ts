export type CrimeId = string & { __brand: 'CrimeId' };
export type SentenceId = string & { __brand: 'SentenceId' };

export type Offender = {
	name: string;
};

export type AttackOption = 'yes' | 'no' | 'maybe';

export type RawCrime = {
	id: CrimeId;
	date?: string;
	paragraph?: string;
	isAttack?: AttackOption;
	isMainOffender: boolean;
	dateDisclosed?: string;
	valueStolen?: number;
	valueDestroyed?: number;
	note?: string;
	wasSentenced?: boolean;
};

export type RawSentence = {
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

export type RawForm = {
	fileId: string;
	offender: Offender;
	crimes: RawCrime[];
	sentencedCrimes: RawCrime[];
	sentences: RawSentence[];
};

export type ValidatedCrime = Required<RawCrime> & { label: string; date: string };

export type ValidatedSentence = RawSentence & {
	crimesData: ValidatedCrime[];
	cancelsSentenceData?: ValidatedSentence;
	dateAnnouncedData: string;
	label: string;
};

export type AttackGroup = {
	color: string;
	attacks: ValidatedCrime[];
};

export type ValidatedForm = {
	firstCrimeDate: string;
	attacks: ValidatedCrime[];
	attackGroups: AttackGroup[];
	crimes: ValidatedCrime[];
	sentencedCrimes: ValidatedCrime[];
	sentences: ValidatedSentence[];
	fileId: string;
	offender: Offender;
};
