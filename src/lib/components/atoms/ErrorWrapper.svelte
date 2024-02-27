<script lang="ts">
	import { Helper } from 'flowbite-svelte';

	export let error: undefined | string = undefined;
</script>

<div class="pt-5 flex flex-shrink flex-col">
	<slot />
	<Helper class="mt-1" color="red" helperClass="text-wrap flex flex-shrink"
		>{error ?? ''}&#8203;</Helper
	>
</div>
