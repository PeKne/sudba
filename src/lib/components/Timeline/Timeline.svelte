<script>
	import * as Plot from '@observablehq/plot';
	import * as d3 from 'd3';

	let div;

	const data = [
		{
			year: 1788,
			composition: `Symphony No. 41 "Jupiter"`,
			composer: 'Wolfgang Amadeus Mozart',
			link: 'https://en.wikipedia.org/wiki/Symphony_No._41_(Mozart)'
		},
		{
			year: 1894,
			composition: 'Prelude to the Afternoon of a Faun',
			composer: 'Claude Debussy',
			link: 'https://en.wikipedia.org/wiki/Pr%C3%A9lude_%C3%A0_l%27apr%C3%A8s-midi_d%27un_faune'
		},
		{
			year: 1805,
			composition: `Symphony No. 3 "Eroica"`,
			composer: 'Ludwig van Beethoven',
			link: 'https://en.wikipedia.org/wiki/Symphony_No._3_(Beethoven)'
		},
		{
			year: 1913,
			composition: 'Rite of Spring',
			composer: 'Igor Stravinsky',
			link: 'https://en.wikipedia.org/wiki/The_Rite_of_Spring'
		},
		{
			year: 1741,
			composition: 'Goldberg Variations',
			composer: 'Johann Sebastian Bach',
			link: 'https://en.wikipedia.org/wiki/Goldberg_Variations'
		},
		{
			year: 1881,
			composition: 'Piano Concerto No. 2',
			composer: 'Johannes Brahms',
			link: 'https://en.wikipedia.org/wiki/Piano_Concerto_No._2_(Brahms)'
		},
		{
			year: 1826,
			composition: `A Midsummer Night's Dream "Overture"`,
			composer: 'Felix Mendelssohn',
			link: 'https://en.wikipedia.org/wiki/A_Midsummer_Night%27s_Dream_(Mendelssohn)'
		}
	];

  const height = 200;
  const tickHeight = 25;
  const fontSizeInt = 16;
  const lineLength = 15;
  const sideMargins = 70;

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

	const preparedData = data
		.map(function (d) {
			const composerShort = d.composer.split(' ').slice(-1);
			const { text, numberOfLines } = wrapText(`${d.composition} (${composerShort})`, lineLength);
			return { ...d, text, numberOfLines };
		})
		.sort((a, b) => d3.ascending(a.year, b.year));

	$: {
		div?.firstChild?.remove(); // remove old chart, if any
		div?.append(Plot.plot({
		width: 800,
		height,
		marginLeft: sideMargins,
		marginRight: sideMargins,
		x: { axis: null },
		y: { axis: null, domain: [-height / 2, height / 2] },
		marks: [
			Plot.ruleY([0]),
			Plot.ruleX(preparedData, {
				x: 'year',
				y: (d, i) => (i % 2 === 0 ? tickHeight : -tickHeight)
			}),
			Plot.dot(preparedData, { x: 'year', fill: '#f22341', stroke: '#000' }),
			Plot.text(preparedData, {
				x: 'year',
				y: (d, i) => (i % 2 === 0 ? -fontSizeInt / 2 - 4 : fontSizeInt / 2 + 4),
				text: (d) => d.year.toString()
			}),
			Plot.text(preparedData, {
				x: 'year',
				y: (d, i) =>
					i % 2 === 0
						? tickHeight + d.numberOfLines * fontSizeInt * 0.5
						: -tickHeight - d.numberOfLines * fontSizeInt * 0.5,
				text: 'text'
			})
		]
	})); 
	}
</script>

<div bind:this={div} role="img" />
