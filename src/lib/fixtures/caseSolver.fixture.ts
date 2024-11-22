import type { CrimeId, Offender, RawForm, SentenceId } from '../types';

const offender: Offender = {
	name: 'Jan Kradl'
};

export const testCase1: RawForm = {
	fileId: '1. Představení úhrného trestu',
	offender,
	crimes: [
		{
			id: 'A' as CrimeId,
			note: 'A',
			isAttack: 'no',
			isMainOffender: false,
			date: '2015-01-01',
			paragraph: '1'
		},
		{
			id: 'B' as CrimeId,
			note: 'B',
			isAttack: 'no',
			isMainOffender: false,
			date: '2015-02-01',
			paragraph: '1'
		}
	],
	sentencedCrimes: [],
	sentences: []
};

export const testCase2: RawForm = {
	fileId: '2. Představení souhrnného trestu',
	offender,
	crimes: [
		{
			id: 'B' as CrimeId,
			note: 'B',
			isAttack: 'no',
			isMainOffender: false,
			date: '2015-02-01',
			paragraph: '1'
		}
	],
	sentencedCrimes: [
		{
			id: 'A' as CrimeId,
			note: 'A',
			isAttack: 'no',
			isMainOffender: false,
			date: '2015-01-01',
			paragraph: '1'
		}
	],
	sentences: [
		{
			id: 'R-A' as SentenceId,
			isLegallyForced: false,
			crimes: ['A'] as CrimeId[],
			dateAnnounced: '2015-05-01'
		}
	]
};

export const testCase3: RawForm = {
	fileId: '3. Představení patrového rozsudku',
	offender,
	crimes: [
		{
			id: 'B' as CrimeId,
			note: 'B',
			isAttack: 'no',
			isMainOffender: false,
			date: '2015-03-01',
			paragraph: '1'
		},
		{
			id: 'C' as CrimeId,
			note: 'C',
			isAttack: 'no',
			isMainOffender: false,
			date: '2016-08-01',
			paragraph: '1'
		}
	],
	sentencedCrimes: [
		{
			id: 'A' as CrimeId,
			note: 'A',
			isAttack: 'no',
			isMainOffender: false,
			date: '2015-01-01',
			paragraph: '1'
		}
	],
	sentences: [
		{
			id: 'R-A' as SentenceId,
			isLegallyForced: false,
			crimes: ['A'] as CrimeId[],
			dateAnnounced: '2015-06-01'
		}
	]
};

export const testCase4: RawForm = {
	fileId: '4. Představení tzv. falešného souhrnu',
	offender,
	crimes: [
		{
			id: 'C' as CrimeId,
			note: 'C',
			isAttack: 'no',
			isMainOffender: false,
			date: '2016-09-01',
			paragraph: '1'
		}
	],
	sentencedCrimes: [
		{
			id: 'A' as CrimeId,
			note: 'A',
			isAttack: 'no',
			isMainOffender: false,
			date: '2016-05-01',
			paragraph: '1'
		},
		{
			id: 'B' as CrimeId,
			note: 'B',
			isAttack: 'no',
			isMainOffender: false,
			date: '2016-05-05',
			paragraph: '1'
		}
	],
	sentences: [
		{
			id: 'R-A' as SentenceId,
			isLegallyForced: false,
			crimes: ['A'] as CrimeId[],
			dateAnnounced: '2016-06-20'
		},
		{
			id: 'R-AB' as SentenceId,
			isLegallyForced: false,
			crimes: ['B'] as CrimeId[],
			cancelsSentece: 'R-A' as SentenceId,
			dateAnnounced: '2016-10-17'
		}
	]
};

export const testCase5: RawForm = {
	fileId: '5. Jak vypadá souhrnný trest',
	offender,
	crimes: [
		{
			id: 'C' as CrimeId,
			note: 'C',
			isAttack: 'no',
			isMainOffender: false,
			date: '2017-04-14',
			paragraph: '1'
		}
	],
	sentencedCrimes: [
		{
			id: 'A' as CrimeId,
			note: 'A',
			isAttack: 'no',
			isMainOffender: false,
			date: '2016-12-12',
			paragraph: '1'
		},
		{
			id: 'B' as CrimeId,
			note: 'B',
			isAttack: 'no',
			isMainOffender: false,
			date: '2016-12-15',
			paragraph: '1'
		}
	],
	sentences: [
		{
			id: 'R-A' as SentenceId,
			isLegallyForced: false,
			crimes: ['A'] as CrimeId[],
			dateAnnounced: '2017-07-15'
		},
		{
			id: 'R-AB' as SentenceId,
			isLegallyForced: false,
			crimes: ['B'] as CrimeId[],
			cancelsSentece: 'R-A' as SentenceId,
			dateAnnounced: '2017-09-03'
		}
	]
};

export const testCase6: RawForm = {
	fileId: '6. Upuštění od uložení souhrnného trestu',
	offender,
	crimes: [
		{
			id: 'C' as CrimeId,
			note: 'C',
			isAttack: 'no',
			isMainOffender: false,
			date: '2016-09-06',
			paragraph: '1'
		}
	],
	sentencedCrimes: [
		{
			id: 'A' as CrimeId,
			note: 'A',
			isAttack: 'no',
			isMainOffender: false,
			date: '2015-11-12',
			paragraph: '1'
		},
		{
			id: 'B' as CrimeId,
			note: 'B',
			isAttack: 'no',
			isMainOffender: false,
			date: '2016-01-04',
			paragraph: '1'
		}
	],
	sentences: [
		{
			id: 'R-A' as SentenceId,
			isLegallyForced: false,
			crimes: ['A'] as CrimeId[],
			dateAnnounced: '2017-01-07'
		},
		{
			id: 'R-AB' as SentenceId,
			isLegallyForced: false,
			crimes: ['B'] as CrimeId[],
			cancelsSentece: 'R-A' as SentenceId,
			dateAnnounced: '2017-04-05'
		}
	]
};

export const testCase7: RawForm = {
	fileId: '7.',
	offender,
	crimes: [
		{
			id: 'B' as CrimeId,
			note: 'B',
			isAttack: 'no',
			isMainOffender: false,
			date: '2017-06-09',
			paragraph: '1'
		},
		{
			id: 'C' as CrimeId,
			note: 'C',
			isAttack: 'no',
			isMainOffender: false,
			date: '2017-08-03',
			paragraph: '1'
		}
	],
	sentencedCrimes: [
		{
			id: 'A' as CrimeId,
			note: 'A',
			isAttack: 'no',
			isMainOffender: false,
			date: '2017-05-25',
			paragraph: '1'
		}
	],
	sentences: [
		{
			id: 'R-A' as SentenceId,
			isLegallyForced: false,
			crimes: ['A'] as CrimeId[],
			dateAnnounced: '2017-07-02'
		}
	]
};

export const testCase8: RawForm = {
	fileId: '8.',
	offender,
	crimes: [
		{
			id: 'C' as CrimeId,
			note: 'C',
			isAttack: 'no',
			isMainOffender: false,
			date: '2018-08-08',
			paragraph: '1'
		}
	],
	sentencedCrimes: [
		{
			id: 'A' as CrimeId,
			note: 'A',
			isAttack: 'no',
			isMainOffender: false,
			date: '2018-05-05',
			paragraph: '1'
		},
		{
			id: 'B' as CrimeId,
			note: 'B',
			isAttack: 'no',
			isMainOffender: false,
			date: '2018-06-06',
			paragraph: '1'
		}
	],
	sentences: [
		{
			id: 'R-A' as SentenceId,
			isLegallyForced: false,
			crimes: ['A'] as CrimeId[],
			dateAnnounced: '2019-09-09'
		},
		{
			id: 'R-B' as SentenceId,
			isLegallyForced: false,
			crimes: ['B'] as CrimeId[],
			dateAnnounced: '2019-09-19'
		}
	]
};

export const testCase9: RawForm = {
	fileId: '9.',
	offender,
	crimes: [
		{
			id: 'C' as CrimeId,
			note: 'C',
			isAttack: 'no',
			isMainOffender: false,
			date: '2017-08-09',
			paragraph: '1'
		}
	],
	sentencedCrimes: [
		{
			id: 'A' as CrimeId,
			note: 'A',
			isAttack: 'no',
			isMainOffender: false,
			date: '2015-12-01',
			paragraph: '1'
		},
		{
			id: 'B' as CrimeId,
			note: 'B',
			isAttack: 'no',
			isMainOffender: false,
			date: '2015-12-03',
			paragraph: '1'
		}
	],
	sentences: [
		{
			id: 'R-A' as SentenceId,
			isLegallyForced: false,
			crimes: ['A'] as CrimeId[],
			dateAnnounced: '2016-06-07'
		},
		{
			id: 'R-B' as SentenceId,
			isLegallyForced: false,
			cancelsSentece: 'R-A' as SentenceId,
			crimes: ['B'] as CrimeId[],
			dateAnnounced: '2017-09-10'
		}
	]
};

export const testCase10: RawForm = {
	fileId: '10. utoky 1',
	offender,
	crimes: [
		{
			id: 'A2' as CrimeId,
			note: 'A2',
			isAttack: 'yes',
			isMainOffender: false,
			date: '2020-10-03',
			dateDisclosed: '2020-10-04',
			paragraph: '1'
		},
		{
			id: 'B' as CrimeId,
			note: 'B',
			isAttack: 'no',
			isMainOffender: false,
			date: '2020-10-30',
			dateDisclosed: '2020-11-30',
			paragraph: '2'
		}
	],
	sentencedCrimes: [
		{
			id: 'A1' as CrimeId,
			note: 'A1',
			isAttack: 'yes',
			isMainOffender: false,
			date: '2020-10-02',
			dateDisclosed: '2020-10-03',
			paragraph: '1'
		}
	],
	sentences: [
		{
			id: 'R-A1B' as SentenceId,
			isLegallyForced: false,
			crimes: ['A1', 'B'] as CrimeId[],
			dateAnnounced: '2020-12-05'
		}
	]
};

export const testCase11: RawForm = {
	fileId: '11. utoky 2',
	offender,
	crimes: [
		{
			id: 'A2' as CrimeId,
			note: 'A2',
			isAttack: 'yes',
			isMainOffender: false,
			date: '2018-03-15',
			dateDisclosed: '2018-03-18',
			paragraph: '1'
		},
		{
			id: 'B' as CrimeId,
			note: 'B',
			isAttack: 'no',
			isMainOffender: false,
			date: '2018-04-30',
			dateDisclosed: '2018-05-01',
			paragraph: '2'
		}
	],
	sentencedCrimes: [
		{
			id: 'A1' as CrimeId,
			note: 'A1',
			isAttack: 'yes',
			isMainOffender: false,
			date: '2018-03-10',
			dateDisclosed: '2018-03-17',
			paragraph: '1'
		}
	],
	sentences: [
		{
			id: 'R-A1' as SentenceId,
			isLegallyForced: false,
			crimes: ['A1'] as CrimeId[],
			dateAnnounced: '2018-06-10'
		}
	]
};

export const testCase12: RawForm = {
	fileId: '12. utoky 3',
	offender,
	crimes: [
		{
			id: 'A2' as CrimeId,
			note: 'A2',
			isAttack: 'yes',
			isMainOffender: false,
			date: '2020-04-18',
			dateDisclosed: '2020-04-19',
			paragraph: '1'
		}
	],
	sentencedCrimes: [
		{
			id: 'A1' as CrimeId,
			note: 'A1',
			isAttack: 'yes',
			isMainOffender: false,
			date: '2020-03-18',
			dateDisclosed: '2020-04-20',
			paragraph: '1'
		},
		{
			id: 'B' as CrimeId,
			note: 'B',
			isAttack: 'no',
			isMainOffender: false,
			date: '2020-06-06',
			dateDisclosed: '2020-06-07',
			paragraph: '2'
		}
	],
	sentences: [
		{
			id: 'R-A1' as SentenceId,
			isLegallyForced: false,
			crimes: ['A1'] as CrimeId[],
			dateAnnounced: '2020-09-25'
		},
		{
			id: 'R-A1B' as SentenceId,
			isLegallyForced: false,
			crimes: ['B'] as CrimeId[],
			cancelsSentece: 'R-A1' as SentenceId,
			dateAnnounced: '2020-12-05'
		}
	]
};

//TODO: attacks
export const testCase13: RawForm = {
	fileId: '13. utoky 4',
	offender,
	crimes: [
		{
			id: 'A2' as CrimeId,
			note: 'A2',
			isAttack: 'yes',
			isMainOffender: false,
			date: '2021-05-10',
			dateDisclosed: '2021-10-04',
			paragraph: '1'
		},
		{
			id: 'A4' as CrimeId,
			note: 'A4',
			isAttack: 'yes',
			isMainOffender: false,
			date: '2021-05-15',
			dateDisclosed: '2021-10-04',
			paragraph: '1'
		},
		{
			id: 'A5' as CrimeId,
			note: 'A5',
			isAttack: 'yes',
			isMainOffender: false,
			date: '2021-05-16',
			dateDisclosed: '2021-10-04',
			paragraph: '1'
		}
	],
	sentencedCrimes: [
		{
			id: 'A1' as CrimeId,
			note: 'A1',
			isAttack: 'yes',
			isMainOffender: false,
			date: '2021-05-09',
			dateDisclosed: '2021-8-3',
			paragraph: '1'
		},
		{
			id: 'A3' as CrimeId,
			note: 'A3',
			isAttack: 'yes',
			isMainOffender: false,
			date: '2021-05-11',
			dateDisclosed: '2021-8-3',
			paragraph: '1'
		}
	],
	sentences: [
		{
			id: 'R-A1A3' as SentenceId,
			isLegallyForced: false,
			crimes: ['A1', 'A3'] as CrimeId[],
			dateAnnounced: '2021-11-04'
		}
	]
};

export const testCase14: RawForm = {
	fileId: '14.',
	offender,
	crimes: [
		{
			id: 'B' as CrimeId,
			note: 'B',
			isAttack: 'no',
			isMainOffender: false,
			date: '2019-06-14',
			paragraph: '1'
		},
		{
			id: 'C' as CrimeId,
			note: 'C',
			isAttack: 'no',
			isMainOffender: false,
			date: '2019-09-30',
			paragraph: '1'
		}
	],
	sentencedCrimes: [
		{
			id: 'A' as CrimeId,
			note: 'A',
			isAttack: 'no',
			isMainOffender: false,
			date: '2019-02-05',
			paragraph: '1'
		},
		{
			id: 'D' as CrimeId,
			note: 'D',
			isAttack: 'no',
			isMainOffender: false,
			date: '2019-10-10',
			paragraph: '1'
		}
	],
	sentences: [
		{
			id: 'R-A' as SentenceId,
			isLegallyForced: false,
			crimes: ['A'] as CrimeId[],
			dateAnnounced: '2019-08-07'
		},
		{
			id: 'R-D' as SentenceId,
			isLegallyForced: false,
			crimes: ['D'] as CrimeId[],
			dateAnnounced: '2019-10-12'
		}
	]
};

export const testCase15: RawForm = {
	fileId: '15.',
	offender,
	crimes: [
		{
			id: 'B' as CrimeId,
			note: 'B',
			isAttack: 'no',
			isMainOffender: false,
			date: '2022-04-07',
			paragraph: '1'
		},
		{
			id: 'D' as CrimeId,
			note: 'D',
			isAttack: 'no',
			isMainOffender: false,
			date: '2022-11-09',
			paragraph: '1'
		}
	],
	sentencedCrimes: [
		{
			id: 'A' as CrimeId,
			note: 'A',
			isAttack: 'no',
			isMainOffender: false,
			date: '2021-05-05',
			paragraph: '1'
		},
		{
			id: 'C' as CrimeId,
			note: 'C',
			isAttack: 'no',
			isMainOffender: false,
			date: '2022-06-18',
			paragraph: '1'
		}
	],
	sentences: [
		{
			id: 'R-A' as SentenceId,
			isLegallyForced: false,
			crimes: ['A'] as CrimeId[],
			dateAnnounced: '2022-09-03'
		},
		{
			id: 'R-AC' as SentenceId,
			isLegallyForced: false,
			crimes: ['C'] as CrimeId[],
			cancelsSentece: 'R-A' as SentenceId,
			dateAnnounced: '2023-03-05'
		}
	]
};

export const testCase16: RawForm = {
	fileId: '16.',
	offender,
	crimes: [
		{
			id: 'D' as CrimeId,
			note: 'D',
			isAttack: 'no',
			isMainOffender: false,
			date: '2021-11-11',
			paragraph: '1'
		},
		{
			id: 'E' as CrimeId,
			note: 'E',
			isAttack: 'no',
			isMainOffender: false,
			date: '2022-03-05',
			paragraph: '1'
		}
	],
	sentencedCrimes: [
		{
			id: 'A' as CrimeId,
			note: 'A',
			isAttack: 'no',
			isMainOffender: false,
			date: '2021-04-01',
			paragraph: '1'
		},
		{
			id: 'B' as CrimeId,
			note: 'B',
			isAttack: 'no',
			isMainOffender: false,
			date: '2021-07-01',
			paragraph: '1'
		},
		{
			id: 'C' as CrimeId,
			note: 'C',
			isAttack: 'no',
			isMainOffender: false,
			date: '2021-09-30',
			paragraph: '1'
		}
	],
	sentences: [
		{
			id: 'R-A' as SentenceId,
			isLegallyForced: false,
			crimes: ['A'] as CrimeId[],
			dateAnnounced: '2021-10-15'
		},
		{
			id: 'R-ABC' as SentenceId,
			isLegallyForced: false,
			crimes: ['B', 'C'] as CrimeId[],
			cancelsSentece: 'R-A' as SentenceId,
			dateAnnounced: '2021-12-12'
		}
	]
};

export const testCasesObject = {
	testCase1,
	testCase2,
	testCase3,
	testCase4,
	testCase5,
	testCase6,
	testCase7,
	testCase8,
	testCase9,
	testCase10,
	testCase11,
	testCase12,
	testCase13,
	testCase14,
	testCase15,
	testCase16
};
