import {
	groupAttacksToCrimes,
	groupAttacksByIsMainOffenderAndParagraph,
	splitAttacksContinuationByDateDisclosed,
	splitAttacksContinuationByTimeGap
} from '../formatters';
import type { Crime } from '../types';

describe('groupAttacksByIsMainOffenderAndParagraph', () => {
	it('should group attacks by isMainOffender and paragraph', () => {
		const attacks = [
			{ isMainOffender: true, paragraph: 'A' },
			{ isMainOffender: true, paragraph: 'B' },
			{ isMainOffender: true, paragraph: 'B' },
			{ isMainOffender: true, paragraph: 'C' },
			{ isMainOffender: false, paragraph: 'A' },
			{ isMainOffender: false, paragraph: 'A' },
			{ isMainOffender: false, paragraph: 'B' },
			{ isMainOffender: false, paragraph: 'C' }
		] as Crime[];

		const result = groupAttacksByIsMainOffenderAndParagraph(attacks);
		console.log('🚀 ~ it ~ result:', result);

		expect(result).toEqual([
			[{ isMainOffender: true, paragraph: 'A' }],
			[
				{ isMainOffender: true, paragraph: 'B' },
				{ isMainOffender: true, paragraph: 'B' }
			],
			[{ isMainOffender: true, paragraph: 'C' }],
			[
				{ isMainOffender: false, paragraph: 'A' },
				{ isMainOffender: false, paragraph: 'A' }
			],
			[{ isMainOffender: false, paragraph: 'B' }],
			[{ isMainOffender: false, paragraph: 'C' }]
		]);
	});
});

describe('splitAttacksContinuationByTimeGap', () => {
	it('should split attacks by time gap', () => {
		const attacks = [
			{ date: '2022-01-01' },
			{ date: '2022-01-05' },
			{ date: '2022-01-10' },
			{ date: '2022-05-01' },
			{ date: '2022-05-05' },
			{ date: '2022-05-10' },
			{ date: '2022-09-01' },
			{ date: '2022-09-05' }
		] as Crime[];

		const result = splitAttacksContinuationByTimeGap(attacks);

		expect(result).toEqual([
			[{ date: '2022-01-01' }, { date: '2022-01-05' }, { date: '2022-01-10' }],
			[{ date: '2022-05-01' }, { date: '2022-05-05' }, { date: '2022-05-10' }],
			[{ date: '2022-09-01' }, { date: '2022-09-05' }]
		]);
	});

	it('should return the same array if there is only one attack', () => {
		const attacks = [{ date: '2022-01-01' }] as Crime[];

		const result = splitAttacksContinuationByTimeGap(attacks);

		expect(result).toEqual([[{ date: '2022-01-01' }]]);
	});
});

describe('splitAttacksContinuationByDateDisclosed', () => {
	it('should split attacks by date disclosed', () => {
		const attacks = [
			{ date: '2022-01-01', dateDisclosed: '2022-02-02' },
			{ date: '2022-01-05', dateDisclosed: '2022-01-07' },
			{ date: '2022-01-10', dateDisclosed: '2022-02-01' },
			{ date: '2022-01-12', dateDisclosed: '2022-02-02' },
			{ date: '2022-01-15', dateDisclosed: '2022-01-16' },
			{ date: '2022-01-19', dateDisclosed: '2022-02-02' }
		] as Crime[];

		const result = splitAttacksContinuationByDateDisclosed(attacks);

		expect(result).toEqual([
			[
				{ date: '2022-01-01', dateDisclosed: '2022-02-02' },
				{ date: '2022-01-05', dateDisclosed: '2022-01-07' }
			],
			[
				{ date: '2022-01-10', dateDisclosed: '2022-02-01' },
				{ date: '2022-01-12', dateDisclosed: '2022-02-02' },
				{ date: '2022-01-15', dateDisclosed: '2022-01-16' }
			],
			[{ date: '2022-01-19', dateDisclosed: '2022-02-02' }]
		]);
	});

	it('should return the same array if there is only one attack', () => {
		const attacks = [{ date: '2022-01-01', dateDisclosed: '2022-01-02' }] as Crime[];

		const result = splitAttacksContinuationByDateDisclosed(attacks);

		expect(result).toEqual([[{ date: '2022-01-01', dateDisclosed: '2022-01-02' }]]);
	});
});

describe('groupAttacksToCrimes', () => {
	it('should return the correct attack groups', () => {
		const attacks = [
			{ isMainOffender: true, paragraph: 'A', date: '2022-01-01', dateDisclosed: '2022-02-02' },
			{ isMainOffender: true, paragraph: 'B', date: '2022-01-05', dateDisclosed: '2022-02-01' },
			{ isMainOffender: true, paragraph: 'B', date: '2022-01-10', dateDisclosed: '2022-02-01' },
			{ isMainOffender: true, paragraph: 'C', date: '2022-01-12', dateDisclosed: '2022-02-02' },
			{ isMainOffender: true, paragraph: 'C', date: '2022-01-15', dateDisclosed: '2022-01-13' },
			{ isMainOffender: true, paragraph: 'C', date: '2022-01-16', dateDisclosed: '2022-02-02' },
			{ isMainOffender: false, paragraph: 'B', date: '2022-01-05', dateDisclosed: '2022-02-01' },
			{ isMainOffender: false, paragraph: 'B', date: '2022-01-10', dateDisclosed: '2022-02-01' },
			{ isMainOffender: false, paragraph: 'C', date: '2022-01-13', dateDisclosed: '2022-02-02' }
		] as Crime[];

		const result = groupAttacksToCrimes(attacks);
		console.log('🚀 ~ it ~ result:', result);

		expect(result).toEqual([
			[
				{
					isMainOffender: true,
					paragraph: 'A',
					date: '2022-01-01',
					dateDisclosed: '2022-02-02'
				}
			],
			[
				{
					isMainOffender: true,
					paragraph: 'B',
					date: '2022-01-05',
					dateDisclosed: '2022-02-01'
				},
				{
					isMainOffender: true,
					paragraph: 'B',
					date: '2022-01-10',
					dateDisclosed: '2022-02-01'
				}
			],
			[
				{
					isMainOffender: true,
					paragraph: 'C',
					date: '2022-01-12',
					dateDisclosed: '2022-02-02'
				}
			],
			[
				{ isMainOffender: true, paragraph: 'C', date: '2022-01-15', dateDisclosed: '2022-01-13' },
				{ isMainOffender: true, paragraph: 'C', date: '2022-01-16', dateDisclosed: '2022-02-02' }
			],
			[
				{
					isMainOffender: false,
					paragraph: 'B',
					date: '2022-01-05',
					dateDisclosed: '2022-02-01'
				},
				{
					isMainOffender: false,
					paragraph: 'B',
					date: '2022-01-10',
					dateDisclosed: '2022-02-01'
				}
			],
			[{ isMainOffender: false, paragraph: 'C', date: '2022-01-13', dateDisclosed: '2022-02-02' }]
		]);
	});
});
