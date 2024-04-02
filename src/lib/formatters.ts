/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { pipe, D, A, G } from '@mobily/ts-belt';
import type { AttackGroup, RawCrime } from './types';

export function splitAttacksContinuationByDateDisclosed(crimes: RawCrime[]) {
	const dateSortedCrimes = crimes.sort(
		(a, b) => new Date(a.date!).getTime() - new Date(b.date!).getTime()
	);
	const splitPoints = crimes
		.map((crime) => crime.dateDisclosed)
		.sort((a, b) => new Date(a!).getTime() - new Date(b!).getTime());

	const result = [];
	splitPoints.forEach((splitPoint) => {
		const splitDateObject = new Date(splitPoint!);
		const lowerGroup = dateSortedCrimes.filter((crime) => {
			const dateObject = new Date(crime.date!);
			const isLower = dateObject <= splitDateObject;

			return isLower;
		});

		if (A.isNotEmpty(lowerGroup)) {
			result.push(lowerGroup);
			dateSortedCrimes.splice(0, lowerGroup.length);
		}
	});

	if (A.isNotEmpty(dateSortedCrimes)) {
		result.push(dateSortedCrimes);
	}

	return result;
}

export const splitAttacksContinuationByTimeGap = (attacks: RawCrime[]) => {
	const output = [];
	let tempArray = [];

	if (attacks.length <= 1) return [attacks];

	for (let i = 0; i < attacks.length - 1; i++) {
		const date1 = new Date(attacks[i].date!);
		const date2 = new Date(attacks[i + 1].date!);

		// Subtract the dates and get the difference in days
		const diffInDays = Math.round(
			Math.abs((date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24))
		);

		tempArray.push(attacks[i]);

		const isNextToLastElement = i === attacks.length - 2;

		if (diffInDays > 90) {
			output.push(tempArray);
			// Add the last date to the array if it's the last iteration
			if (isNextToLastElement) output.push([attacks[i + 1]]);
			tempArray = [];
		} else if (isNextToLastElement) {
			tempArray.push(attacks[i + 1]);
			output.push(tempArray);
		}
	}

	return output;
};

export const groupAttacksByIsMainOffenderAndParagraph = (attacks: RawCrime[]) => {
	return pipe(
		attacks,
		A.groupBy((attack) => String(attack.isMainOffender)),
		D.map((group) => A.groupBy(group!, (attack) => attack.paragraph!)),
		D.values,
		A.map((isOffenderObject) => D.values(isOffenderObject)),
		A.flat,
		A.filter(G.isNotNullable)
	) as unknown as RawCrime[][];
};
const GROUP_COLORS = ['#0000FF', '#00FF00', '#00FFFF', '#00FF99', '#00AAFF', '#FFFF00', '#FF00FF'];

const assignColorToGroup = (groupIndex: number, group: RawCrime[]) => {
	return { attacks: group, color: GROUP_COLORS[groupIndex] };
};

export const groupAttacksToCrimes = (attacks: RawCrime[]) => {
	return pipe(
		attacks,
		groupAttacksByIsMainOffenderAndParagraph,
		A.map((group) => splitAttacksContinuationByTimeGap(group)),
		A.flat,
		A.map((group) => splitAttacksContinuationByDateDisclosed(group)),
		A.flat,
		A.mapWithIndex(assignColorToGroup)
	) as AttackGroup[];
};
