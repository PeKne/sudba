<script lang="ts">
	import type { InputType } from 'flowbite-svelte/dist/types';
	import ErrorWrapper from './ErrorWrapper.svelte';

	import { Input } from 'flowbite-svelte';

	export let value: string | number | undefined = undefined;
	export let error: undefined | string = undefined;
	export let type: InputType = 'text';

	const onInput = (event: Event) => {
		const target = event.currentTarget as HTMLInputElement;
		if (type === 'number') {
			value = target.value.match(/[0-9.]+/)?.[0] ?? '';
			return;
		}
		value = target.value;
	};

	// Makes number type behave as text, while keeping the validation in onInput callback.
	$: customType = type === 'number' ? 'text' : type;
</script>

<ErrorWrapper {error}>
	<Input
		{...$$props}
		color={error ? 'red' : undefined}
		on:input={onInput}
		pattern="[0-9.]+"
		type={customType}
	/>
</ErrorWrapper>
