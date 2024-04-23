<script lang="ts">
	import { F } from '@mobily/ts-belt';
	import { validatedFormStore } from '../../caseStore';
	import { plotTimeline } from '../../timeline';
	import type { ValidatedForm } from '../../types';

	let div: HTMLDivElement | undefined;

	let lastState: ValidatedForm | undefined;
	$: {
		// FIXME: Hack to update the function on every state change
		if (!F.equals(lastState, $validatedFormStore)) {
			lastState = $validatedFormStore;
			plotTimeline(div);
		}
	}
</script>

<div bind:this={div} role="img" />
