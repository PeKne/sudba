<script lang="ts">
	import { plotTimeline } from '../../timeline';

	let div: HTMLDivElement | undefined;

	$: plotTimeline(div);
</script>

<div bind:this={div} role="img" />
