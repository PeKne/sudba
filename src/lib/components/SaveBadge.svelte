<script lang="ts">
	import { Badge, Indicator } from 'flowbite-svelte';
	import { isUnsavedStore } from '../caseStore';
</script>

<div>
	<Badge color={$isUnsavedStore ? 'red' : 'green'} rounded class="px-2.5 py-0.5">
		<Indicator color={$isUnsavedStore ? 'red' : 'green'} size="xs" class="me-1" />{$isUnsavedStore
			? 'Neuloženo'
			: 'Uloženo'}
	</Badge>
</div>
