import { getSolutionLevels, isSouhrn } from '../caseSolver';
import {
	testCase14,
	testCase15,
	testCase16,
	testCase2,
	testCase3,
	testCase4,
	testCase5,
	testCase7,
	testCase9
} from '../fixtures/caseSolver.fixture';
import type { RawForm } from '../types';
import { cleanFormData } from '../validators';

const getTestResultLevels = (formValues: RawForm) => {
	const validatedValues = cleanFormData(formValues);
	return getSolutionLevels(validatedValues);
};

describe('getSolutionLevels', () => {
	it(testCase2.fileId, () => {
		const resultLevels = getTestResultLevels(testCase2);

		expect(resultLevels.length).toBe(1);
		expect(resultLevels[0].crimes[0].id).toBe('B');

		if (!isSouhrn(resultLevels[0])) throw new Error('level should be souhrn!');

		expect(resultLevels[0].canceledSentences[0].id).toBe('R-A');
	});

	it(testCase3.fileId, () => {
		const resultLevels = getTestResultLevels(testCase3);

		expect(resultLevels.length).toBe(2);
		const level1 = resultLevels[0];
		expect(level1.crimes[0].id).toBe('B');

		if (!isSouhrn(level1)) throw new Error('level should be souhrn!');

		expect(level1.canceledSentences[0].id).toBe('R-A');

		const level2 = resultLevels[1];

		expect(level2.__type).toBe('SAMOSTATNY');
		expect(level2.crimes[0].id).toBe('C');
	});

	it(testCase4.fileId, () => {
		const resultLevels = getTestResultLevels(testCase4);

		expect(resultLevels.length).toBe(1);
		const level1 = resultLevels[0];
		expect(level1.crimes[0].id).toBe('C');
		expect(level1.__type).toBe('SAMOSTATNY');
	});

	it(testCase5.fileId, () => {
		const resultLevels = getTestResultLevels(testCase5);

		expect(resultLevels.length).toBe(1);
		const level1 = resultLevels[0];
		expect(level1.crimes[0].id).toBe('C');

		if (!isSouhrn(level1)) throw new Error('level should be souhrn!');

		expect(level1.canceledSentences.length).toBe(2);
		expect(level1.canceledSentences[0].id).toBe('R-A');
		expect(level1.canceledSentences[1].id).toBe('R-AB');
	});

	// TODO: test case 6

	it(testCase7.fileId, () => {
		const resultLevels = getTestResultLevels(testCase7);

		expect(resultLevels.length).toBe(2);
		const level1 = resultLevels[0];
		expect(level1.crimes[0].id).toBe('B');

		if (!isSouhrn(level1)) throw new Error('level should be souhrn!');

		expect(level1.canceledSentences[0].id).toBe('R-A');

		const level2 = resultLevels[1];

		expect(level2.__type).toBe('SAMOSTATNY');
		expect(level2.crimes[0].id).toBe('C');
	});

	it(testCase9.fileId, () => {
		const resultLevels = getTestResultLevels(testCase9);

		expect(resultLevels.length).toBe(1);
		const level1 = resultLevels[0];
		expect(level1.crimes[0].id).toBe('C');
		expect(level1.__type).toBe('SAMOSTATNY');
	});

	it(testCase14.fileId, () => {
		const resultLevels = getTestResultLevels(testCase14);

		expect(resultLevels.length).toBe(2);

		const level1 = resultLevels[0];
		expect(level1.crimes[0].id).toBe('B');
		if (!isSouhrn(level1)) throw new Error('level should be souhrn!');
		expect(level1.canceledSentences[0].id).toBe('R-A');

		const level2 = resultLevels[1];
		expect(level2.crimes[0].id).toBe('C');
		if (!isSouhrn(level2)) throw new Error('level should be souhrn!');
		expect(level2.canceledSentences[0].id).toBe('R-D');
	});

	it(testCase15.fileId, () => {
		const resultLevels = getTestResultLevels(testCase15);

		expect(resultLevels.length).toBe(2);

		const level1 = resultLevels[0];
		expect(level1.crimes[0].id).toBe('B');
		if (!isSouhrn(level1)) throw new Error('level should be souhrn!');
		expect(level1.canceledSentences.length).toBe(2);
		expect(level1.canceledSentences[0].id).toBe('R-A');
		expect(level1.canceledSentences[1].id).toBe('R-AC');

		const level2 = resultLevels[1];
		expect(level2.crimes[0].id).toBe('D');
		expect(level2.__type).toBe('SAMOSTATNY');
	});

	it(testCase16.fileId, () => {
		const resultLevels = getTestResultLevels(testCase16);

		expect(resultLevels.length).toBe(1);
		const level1 = resultLevels[0];
		expect(level1.crimes.length).toBe(2);
		expect(level1.crimes[0].id).toBe('D');
		expect(level1.crimes[1].id).toBe('E');
		expect(level1.__type).toBe('SAMOSTATNY');
	});
});
