<script>
	import {
		Accordion,
		AccordionItem,
		Heading,
		Input,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		MultiSelect,
		Checkbox,
	} from 'flowbite-svelte';

	import MyTextarea from '$lib/components/atoms/MyTextarea.svelte';
	import Timeline from '$lib/components/Timeline/Timeline.svelte';
	import OffendersAccordion from '../lib/components/OffendersAccordion.svelte';
	import CrimesAccordion from '../lib/components/CrimesAccordion.svelte';
	import TimelineAccordion from '../lib/components/TimelineAccordion.svelte';
	import GeneralAccordion from '../lib/components/GeneralAccordion.svelte';
	import SentencesAccordion from '../lib/components/SentencesAccordion.svelte';

let selected = [];
let countries = [
  { value: '1', name: '§21' },
  { value: '2', name: '§235' },
  { value: '3', name: '§114' },
  { value: '4', name: '§11' },
  { value: '5', name: '§66' }
];
</script>

<Accordion multiple>

	<GeneralAccordion/>
	<OffendersAccordion/>
	<CrimesAccordion/>
	<SentencesAccordion/>
	<TimelineAccordion/>
	

	
</Accordion>
