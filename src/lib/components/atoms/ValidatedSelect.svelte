<script lang="ts">
	import ErrorWrapper from './ErrorWrapper.svelte';

	import { Select } from 'flowbite-svelte';

	export let value: (string | number)[] | undefined = undefined;
	export let error: undefined | string = undefined;
</script>

<ErrorWrapper {error}>
	<!-- TODO: disabled color -->
	<Select {...$$props} bind:value color="green" dropdownClass="bg-white" on:change />
</ErrorWrapper>
