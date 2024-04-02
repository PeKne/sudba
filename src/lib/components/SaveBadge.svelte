<script lang="ts">
	import { Badge, Indicator } from 'flowbite-svelte';
	import { isFormUnsavedStore } from '../caseStore';
</script>

<div>
	<Badge color={$isFormUnsavedStore ? 'red' : 'green'} rounded class="px-2.5 py-0.5">
		<Indicator
			color={$isFormUnsavedStore ? 'red' : 'green'}
			size="xs"
			class="me-1"
		/>{$isFormUnsavedStore ? 'Neuloženo' : 'Uloženo'}
	</Badge>
</div>
