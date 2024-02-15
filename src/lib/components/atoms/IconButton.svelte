<script lang="ts">
	import type { ComponentProps } from 'svelte';

	import type { ComponentType } from 'svelte';
	import { Button } from 'flowbite-svelte';
	import { IconOutline } from 'flowbite-svelte-icons';

	export let icon: ComponentType;
	export let backgroundColor: ComponentProps<Button>['color'] = 'primary';
	// export let iconColor: ComponentProps<IconOutline>['color'];
</script>

<Button class="!p-2" on:click color={backgroundColor}>
	<IconOutline {icon} />
</Button>
