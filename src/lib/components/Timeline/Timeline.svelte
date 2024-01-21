<script lang="ts">
	import * as Plot from '@observablehq/plot';
	import * as d3 from 'd3';
	import { activeCaseStore } from '../../caseStore';

	let div: HTMLDivElement | undefined;

	type MarkCategory = 'sk' | 'skDone' | 'dtp' | 'vr' | 'pr' | 'zr' | 'pmtp' | 'pmr' | 'sd' | 'dnnp';

	// TODO: funkce co bude nacitat data ze state.

	// 	SKUTEK k Rozhodnutí = SK + červená barva
	// SKUTEK již rozhodnutý = SK
	// Doručení trestního příkazu = D TP
	// Vyhlášení odsuzujícího rozsudku = V R
	// Potvrzení či změna odsuzujícího rozsudku soudem vyšší instance = P R
	// Zrušení a vrácení odsuzujícího rozsudku soudem vyšší instance = Z R
	// Právní moc trestního příkazu = PM TP
	// Právní moc odsuzujícího rozsudku = PM R
	// Sdělení obvinění = SD
	// Doručení návrhu na potrestání = D NNP
	const markToStyle = {
		sk: { color: '#ff0000', name: 'SK' },
		skDone: { color: '#000000', name: 'SK' },
		dtp: { color: '#000000', name: 'D TP' }
	} as const satisfies Record<MarkCategory, { color: string; name: string }>;

	const data = [
		{
			date: new Date('01-03-2023'),
			composition: `Symphony No. 41 "Jupiter"`,
			composer: 'Wolfgang Amadeus Mozart',
			link: 'https://en.wikipedia.org/wiki/Symphony_No._41_(Mozart)'
		},
		{
			date: new Date('01-03-2021'),
			composition: 'Prelude to the Afternoon of a Faun',
			composer: 'Claude Debussy',
			link: 'https://en.wikipedia.org/wiki/Pr%C3%A9lude_%C3%A0_l%27apr%C3%A8s-midi_d%27un_faune'
		}
	];

	function wrapText(inputString, segmentLength) {
		const words = inputString.split(' ');
		let result = '';
		let currentLineLength = 0;
		let numberOfLines = 0;

		for (const word of words) {
			if (currentLineLength + word.length + 1 <= segmentLength) {
				// Add the word and a space to the current line
				result += (result === '' ? '' : ' ') + word;
				currentLineLength += word.length + 1;
			} else {
				// Start a new line with the word
				result += '\n' + word;
				currentLineLength = word.length;
				numberOfLines++;
			}
		}

		// Count the last line
		if (result !== '') {
			numberOfLines++;
		}

		return {
			text: result,
			numberOfLines: numberOfLines
		};
	}

	const height = 200;
	const tickHeight = 25;
	const fontSizeInt = 16;
	const lineLength = 15;
	const sideMargins = 70;

	$: {
		const xdata = $activeCaseStore.crimes.map((crime) => ({
			date: new Date(crime.date),
			composition: 'Prelude to the Afternoon of a Faun',
			composer: 'Claude Debussy'
		}));

		const preparedData = data
			.map((d) => {
				const composerShort = d.composer.split(' ').slice(-1);
				const { text, numberOfLines } = wrapText(`${d.composition} (${composerShort})`, lineLength);
				return { ...d, text, numberOfLines };
			})
			.sort((a, b) => d3.ascending(a.date, b.date));

		if (div !== undefined) {
			div.firstChild?.remove(); // remove old chart, if any
			div.append(
				Plot.plot({
					width: 1400,
					height,
					marginLeft: sideMargins,
					marginRight: sideMargins,
					x: { axis: null },
					y: { axis: null, domain: [-height / 2, height / 2] },
					marks: [
						Plot.ruleY([0]),
						Plot.ruleX(preparedData, {
							x: 'date',
							y: tickHeight
						}),
						Plot.dot(preparedData, { x: 'date', fill: '#f22341', stroke: '#000' }),
						Plot.text(preparedData, {
							x: 'date',
							y: -fontSizeInt / 2 - 4,
							text: (d) =>
								d.date.toLocaleString('cs-CS', { year: 'numeric', month: 'short', day: 'numeric' }),
							fill: '#f22341'
						}),
						Plot.text(preparedData, {
							x: 'date',
							y: (d) => tickHeight + d.numberOfLines * fontSizeInt * 0.5,

							text: 'text'
						})
					]
				})
			);
		}
	}
</script>

<div bind:this={div} role="img" />
