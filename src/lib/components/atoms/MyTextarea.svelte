<script lang="ts">
	import { Textarea } from 'flowbite-svelte';
	export let value: string;
</script>

<!-- Matches the background color with the flowbite Input element. -->
<Textarea
	class="bg-gray-50 border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500 resize-y"
	bind:value
>
	<slot />
</Textarea>
