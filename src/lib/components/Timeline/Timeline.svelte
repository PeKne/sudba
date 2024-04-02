<script lang="ts">
	import { validatedFormStore } from '../../caseStore';
	import { plotTimeline } from '../../timeline';

	let div: HTMLDivElement | undefined;

	$: {
		plotTimeline(div);

		// FIXME: Hack to update the function on every state change
		// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
		let _ = $validatedFormStore;
	}
</script>

<div bind:this={div} role="img" />
