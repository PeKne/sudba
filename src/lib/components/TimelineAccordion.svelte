<script lang="ts">
	import { AccordionItem, Heading } from 'flowbite-svelte';

	import Timeline from './Timeline/Timeline.svelte';
</script>

<AccordionItem>
	<span slot="header"><Heading tag="h5">Časová osa</Heading></span>
	<Timeline />
</AccordionItem>
