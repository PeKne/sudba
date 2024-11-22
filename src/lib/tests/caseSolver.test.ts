import { getSolutionLevels, isSouhrn } from '../caseSolver';
import { testCaseFixtures } from '../fixtures/caseSolver.fixture';
import type { RawForm } from '../types';
import { cleanFormData } from '../validators';

const getTestResultLevels = (formValues: RawForm) => {
	const validatedValues = cleanFormData(formValues);
	return getSolutionLevels(validatedValues);
};

describe('getSolutionLevels', () => {
	it(testCaseFixtures.testCase1.fileId, () => {
		const resultLevels = getTestResultLevels(testCaseFixtures.testCase1);

		expect(resultLevels.length).toBe(1);
		expect(resultLevels[0].__type).toBe('SAMOSTATNY');
		expect(resultLevels[0].crimes.length).toBe(2);
		expect(resultLevels[0].crimes[0].id).toBe('A');
		expect(resultLevels[0].crimes[1].id).toBe('B');
	});

	it(testCaseFixtures.testCase2.fileId, () => {
		const resultLevels = getTestResultLevels(testCaseFixtures.testCase2);

		expect(resultLevels.length).toBe(1);
		expect(resultLevels[0].crimes[0].id).toBe('B');

		if (!isSouhrn(resultLevels[0])) throw new Error('level should be souhrn!');

		expect(resultLevels[0].canceledSentences[0].id).toBe('R-A');
	});

	it(testCaseFixtures.testCase3.fileId, () => {
		const resultLevels = getTestResultLevels(testCaseFixtures.testCase3);

		expect(resultLevels.length).toBe(2);
		const level1 = resultLevels[0];
		expect(level1.crimes[0].id).toBe('B');

		if (!isSouhrn(level1)) throw new Error('level should be souhrn!');

		expect(level1.canceledSentences[0].id).toBe('R-A');

		const level2 = resultLevels[1];

		expect(level2.__type).toBe('SAMOSTATNY');
		expect(level2.crimes[0].id).toBe('C');
	});

	it(testCaseFixtures.testCase4.fileId, () => {
		const resultLevels = getTestResultLevels(testCaseFixtures.testCase4);

		expect(resultLevels.length).toBe(1);
		const level1 = resultLevels[0];
		expect(level1.crimes[0].id).toBe('C');
		expect(level1.__type).toBe('SAMOSTATNY');
	});

	it(testCaseFixtures.testCase5.fileId, () => {
		const resultLevels = getTestResultLevels(testCaseFixtures.testCase5);

		expect(resultLevels.length).toBe(1);
		const level1 = resultLevels[0];
		expect(level1.crimes[0].id).toBe('C');

		if (!isSouhrn(level1)) throw new Error('level should be souhrn!');

		expect(level1.canceledSentences.length).toBe(2);
		expect(level1.canceledSentences[0].id).toBe('R-A');
		expect(level1.canceledSentences[1].id).toBe('R-AB');
	});

	it(testCaseFixtures.testCase6.fileId, () => {
		const resultLevels = getTestResultLevels(testCaseFixtures.testCase6);

		expect(resultLevels.length).toBe(1);
		const level1 = resultLevels[0];
		expect(level1.crimes[0].id).toBe('C');

		if (!isSouhrn(level1)) throw new Error('level should be souhrn!');

		expect(level1.canceledSentences.length).toBe(2);
		expect(level1.canceledSentences[0].id).toBe('R-A');
		expect(level1.canceledSentences[1].id).toBe('R-AB');
	});

	it(testCaseFixtures.testCase7.fileId, () => {
		const resultLevels = getTestResultLevels(testCaseFixtures.testCase7);

		expect(resultLevels.length).toBe(2);
		const level1 = resultLevels[0];
		expect(level1.crimes[0].id).toBe('B');

		if (!isSouhrn(level1)) throw new Error('level should be souhrn!');

		expect(level1.canceledSentences[0].id).toBe('R-A');

		const level2 = resultLevels[1];

		expect(level2.__type).toBe('SAMOSTATNY');
		expect(level2.crimes[0].id).toBe('C');
	});

	it(testCaseFixtures.testCase8.fileId, () => {
		const resultLevels = getTestResultLevels(testCaseFixtures.testCase8);

		expect(resultLevels.length).toBe(1);
		const level1 = resultLevels[0];
		expect(level1.crimes[0].id).toBe('C');

		if (!isSouhrn(level1)) throw new Error('level should be souhrn!');

		expect(level1.canceledSentences[0].id).toBe('R-A');
		expect(level1.canceledSentences[1].id).toBe('R-B');
	});

	it(testCaseFixtures.testCase9.fileId, () => {
		const resultLevels = getTestResultLevels(testCaseFixtures.testCase9);

		expect(resultLevels.length).toBe(1);
		const level1 = resultLevels[0];
		expect(level1.crimes[0].id).toBe('C');
		expect(level1.__type).toBe('SAMOSTATNY');
	});

	it(testCaseFixtures.testCase10.fileId, () => {
		const resultLevels = getTestResultLevels(testCaseFixtures.testCase10);

		expect(resultLevels).toHaveLength(1);
		const level1 = resultLevels[0];
		expect(level1.crimes).toHaveLength(2);
		expect(level1.crimes[0].id).toBe('A2');
		expect(level1.crimes[1].id).toBe('B');

		if (!isSouhrn(level1)) throw new Error('level should be souhrn!');

		expect(level1.canceledSentences).toHaveLength(1);
		expect(level1.canceledSentences[0].id).toBe('R-A1B');
	});

	it(testCaseFixtures.testCase11.fileId, () => {
		const resultLevels = getTestResultLevels(testCaseFixtures.testCase11);

		expect(resultLevels).toHaveLength(1);
		const level1 = resultLevels[0];
		expect(level1.crimes).toHaveLength(2);
		expect(level1.crimes[0].id).toBe('A2');
		expect(level1.crimes[1].id).toBe('B');
		if (!isSouhrn(level1)) throw new Error('level should be souhrn!');

		expect(level1.canceledSentences).toHaveLength(1);
		expect(level1.canceledSentences[0].id).toBe('R-A1');
	});
	it(testCaseFixtures.testCase12.fileId, () => {
		const resultLevels = getTestResultLevels(testCaseFixtures.testCase12);

		expect(resultLevels).toHaveLength(1);
		const level1 = resultLevels[0];
		expect(level1.crimes).toHaveLength(1);
		expect(level1.crimes[0].id).toBe('A2');

		if (!isSouhrn(level1)) throw new Error('level should be souhrn!');

		expect(level1.canceledSentences).toHaveLength(2);
		expect(level1.canceledSentences[0].id).toBe('R-A1');
		expect(level1.canceledSentences[1].id).toBe('R-A1B');
	});

	it(testCaseFixtures.testCase13.fileId, () => {
		const resultLevels = getTestResultLevels(testCaseFixtures.testCase13);

		expect(resultLevels).toHaveLength(1);
		const level1 = resultLevels[0];
		expect(level1.crimes).toHaveLength(3);
		expect(level1.crimes[0].id).toBe('A2');
		expect(level1.crimes[1].id).toBe('A4');
		expect(level1.crimes[2].id).toBe('A5');

		if (!isSouhrn(level1)) throw new Error('level should be souhrn!');

		expect(level1.canceledSentences).toHaveLength(1);
		expect(level1.canceledSentences[0].id).toBe('R-A1A3');
	});

	it(testCaseFixtures.testCase14.fileId, () => {
		const resultLevels = getTestResultLevels(testCaseFixtures.testCase14);

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

	it(testCaseFixtures.testCase15.fileId, () => {
		const resultLevels = getTestResultLevels(testCaseFixtures.testCase15);

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

	it(testCaseFixtures.testCase16.fileId, () => {
		const resultLevels = getTestResultLevels(testCaseFixtures.testCase16);

		expect(resultLevels.length).toBe(1);
		const level1 = resultLevels[0];
		expect(level1.crimes.length).toBe(2);
		expect(level1.crimes[0].id).toBe('D');
		expect(level1.crimes[1].id).toBe('E');
		expect(level1.__type).toBe('SAMOSTATNY');
	});
});
