<script lang="ts">
	import * as Plot from '@observablehq/plot';
	import { activeCaseStore } from '../../caseStore';

	let div: HTMLDivElement | undefined;

	const TIMELINE_WIDTH = 1400;
	const TIMELINE_HEIGHT = 200;
	const TIMELINE_MARGINS = 70;
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
		text: (d) =>
			d.date.toLocaleString('cs-CS', { year: 'numeric', month: 'short', day: 'numeric' }),
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

	$: {
		const plotCrimes = () => {
			const crimesData = $activeCaseStore.crimes.map((crime, index) => ({
				...crime,
				date: new Date(crime.date),
				label: `SK${index + 1}`
			}));

			const sentencedCrimesData = $activeCaseStore.sentencedCrimes.map((crime, index) => ({
				...crime,
				date: new Date(crime.date),
				label: `OSK${index + 1}`
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
			const sentencesAnnouncedData = $activeCaseStore.sentences.map((sentence, index) => ({
				...sentence,
				date: new Date(sentence.dateAnnounced),
				label: `V R${index + 1}`
			}));

			const sentencesLegallyForcedData = $activeCaseStore.sentences
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

		if (div !== undefined) {
			div.firstChild?.remove(); // remove old chart, if any
			div.append(
				Plot.plot({
					width: TIMELINE_WIDTH,
					height: TIMELINE_HEIGHT,
					marginLeft: TIMELINE_MARGINS,
					marginRight: TIMELINE_MARGINS,
					x: { axis: null },
					y: { axis: null, domain: [-TIMELINE_HEIGHT / 2, TIMELINE_HEIGHT / 2] },
					marks: [Plot.ruleY([0]), ...plotCrimes(), ...plotSentences()]
				})
			);
		}
	}
</script>

<div bind:this={div} role="img" />
