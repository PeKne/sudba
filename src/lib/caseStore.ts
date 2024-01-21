import { writable } from 'svelte/store';
import type { Case } from './types';

export const EMPTY_SENTENCE_TEMPLATE = {
	fileId: '',
	filePage: 0,
	court: '',
	dateAnnounced: 'Date',
	isLegallyForced: false,
	dateLegallyForced: ''
};

export const EMPTY_CRIME_TEMPLATE = {
	date: '',
	valueStolen: 0,
	valueDestroyed: 0,
	note: ''
};

const defaultCaseValue: Case = {
	fileId: 'Aha',
	offender: {
		name: ''
	},
	crimes: [EMPTY_CRIME_TEMPLATE],
	sentences: [EMPTY_SENTENCE_TEMPLATE]
};

export const activeCaseStore = writable<Case>(defaultCaseValue);
