import * as Plot from '@observablehq/plot';
import { validatedFormStore } from './caseStore';
import { get } from 'svelte/store';
import * as d3 from 'd3';

const TIMELINE_WIDTH = 1400;
const TIMELINE_HEIGHT = 200;
const DATE_MARGIN_BOTTOM = 28;
const fontSizeInt = 16;

// 	SKUTEK Rozhodnutí = SK + červená barva
// SKUTEK již rozhodnutý = SK
// Doručení trestního příkazu = D TP
// Vyhlášení odsuzujícího rozsudku = V R
// Potvrzení či změna odsuzujícího rozsudku soudem vyšší instance = P R
// Zrušení a vrácení odsuzujícího rozsudku soudem vyšší instance = Z R
// Právní moc trestního příkazu = PM TP
// Právní moc odsuzujícího rozsudku = PM R
// Sdělení obvinění = SD
// Doručení návrhu na potrestání = D NNP

const datePlotOptions: Plot.TextOptions = {
	x: 'date',
	y: DATE_MARGIN_BOTTOM + fontSizeInt * 0.5,
	text: (d) => d.date.toLocaleString('cs-CS', { year: 'numeric', month: 'short', day: 'numeric' }),
	rotate: -90
};

const markOptions: Plot.TextOptions = {
	x: 'date',
	y: -fontSizeInt / 2 - 4,
	text: 'label'
};

const dotOptions: Plot.DotOptions = {
	r: 3,
	x: 'date',
	fill: '#000'
};

const plotAttackGroups = () => {
	const timelineArray: Plot.Markish[] = [];
	const attackGroups = get(validatedFormStore).attackGroups;

	attackGroups.forEach((group) => {
		const attacksData = group.attacks.map((attack) => ({
			...attack,
			date: new Date(attack.date)
		}));

		timelineArray.push(Plot.dot(attacksData, dotOptions));
		timelineArray.push(
			Plot.text(attacksData, {
				...markOptions,
				fill: group.color
			})
		);
		timelineArray.push(Plot.text(attacksData, datePlotOptions));
	});

	return timelineArray;
};

const plotCrimes = () => {
	const crimesData = get(validatedFormStore).crimes.map((crime) => ({
		...crime,
		date: new Date(crime.date)
	}));

	const sentencedCrimesData = get(validatedFormStore).sentencedCrimes.map((crime) => ({
		...crime,
		date: new Date(crime.date)
	}));

	return [
		Plot.dot(crimesData, dotOptions),
		Plot.text(crimesData, {
			...markOptions,
			fill: '#f22341'
		}),
		Plot.text(crimesData, datePlotOptions),

		Plot.dot(sentencedCrimesData, dotOptions),
		Plot.text(sentencedCrimesData, markOptions),
		Plot.text(sentencedCrimesData, datePlotOptions)
	];
};

const plotSentences = () => {
	const storedSentences = get(validatedFormStore).sentences;

	const sentencesAnnouncedData = storedSentences.map((sentence, index) => ({
		...sentence,
		date: new Date(sentence.dateAnnounced),
		label: `V R${index + 1}`
	}));

	const sentencesLegallyForcedData = storedSentences
		.filter((sentence) => sentence.dateLegallyForced !== undefined)
		.map((sentence, index) => ({
			...sentence,
			date: new Date(sentence.dateLegallyForced as string),
			label: `PM R${index + 1}`
		}));

	return [
		Plot.dot(sentencesAnnouncedData, dotOptions),
		Plot.text(sentencesAnnouncedData, markOptions),
		Plot.text(sentencesAnnouncedData, datePlotOptions),

		Plot.dot(sentencesLegallyForcedData, dotOptions),
		Plot.text(sentencesLegallyForcedData, markOptions),
		Plot.text(sentencesLegallyForcedData, datePlotOptions)
	];
};

export const plotTimeline = (timelineDiv?: HTMLDivElement) => {
	if (timelineDiv !== undefined) {
		timelineDiv.firstChild?.remove(); // remove old chart, if any
		const timelineD3Div = d3
			.select(timelineDiv)
			.style('margin-left', '70px')
			.style('margin-right', '70px');

		const zoomDiv = timelineD3Div.append('div');
		const plotDiv = zoomDiv.append('div');

		const insertPlot = ({ k, x }: { k: number; x: number }) => {
			const plot = Plot.plot({
				width: TIMELINE_WIDTH,
				height: TIMELINE_HEIGHT,

				x: {
					axis: null,
					transform: (d) => d3.utcYear.offset(d, 2000 - d.getUTCFullYear()),
					range: [150 + x, TIMELINE_WIDTH * k + x - 150]
				},
				y: { axis: null, domain: [-TIMELINE_HEIGHT / 2, TIMELINE_HEIGHT / 2] },
				marks: [Plot.ruleY([0]), ...plotCrimes(), ...plotSentences(), ...plotAttackGroups()]
			});
			plotDiv.html('').append(() => plot);
		};

		insertPlot({ k: 1, x: 0 });

		const zoom = d3
			.zoom()
			.scaleExtent([0.5, 5])
			.on('zoom', ({ transform }) => insertPlot(transform));

		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		zoomDiv.call(zoom);
	}
};
