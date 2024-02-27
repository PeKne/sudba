<script lang="ts">
	import ErrorWrapper from './ErrorWrapper.svelte';

	import { MultiSelect } from 'flowbite-svelte';

	export let value: (string | number)[] | undefined = undefined;
	export let error: undefined | string = undefined;
</script>

<ErrorWrapper {error}>
	<div
		class:border-red-700={error}
		style={error ? 'border-radius: 9px; border-width: 1px;' : undefined}
	>
		<MultiSelect {...$$props} bind:value dropdownClass="bg-white z-50 p-0" />
	</div>
</ErrorWrapper>
