type Offender = {
	name: string;
};

type Crime = {
	date: string;
	valueStolen: number;
	valueDestroyed: number;
	note: string;
};

type Sentence = {
	fileId: string;
	filePage?: number;
	court: string; // TODO: change to union of strings
	dateAnnounced: string;
	isLegallyForced: boolean;
	dateLegallyForced?: string;
};

export type Case = {
	fileId: string;
	offender: Offender;
	crimes: Crime[];
	sentences: Sentence[];
};
