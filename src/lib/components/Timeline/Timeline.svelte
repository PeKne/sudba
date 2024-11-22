<script lang="ts">
	import { validatedFormStore } from '../../caseStore';
	import { plotTimeline } from '../../timeline';

	export let isDisplayed: boolean;

	let div: HTMLDivElement | undefined;
	$: {
		plotTimeline(div, $validatedFormStore);
	}
</script>

<div bind:this={div} role="img" style:display={isDisplayed ? 'block' : 'none'} />
