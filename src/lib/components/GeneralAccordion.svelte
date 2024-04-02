<script lang="ts">
	import { AccordionItem, Heading, Input, Label } from 'flowbite-svelte';

	import { formStore } from '../caseStore';
</script>

<AccordionItem open>
	<span slot="header"><Heading tag="h4">Obecné informace:</Heading></span>

	<form>
		<div>
			<div class="grid gap-6 md:grid-cols-2">
				<div class="space-y-2">
					<Label for="a">Spisová značka</Label>
					<Input id="a" required bind:value={$formStore.fileId} placeholder="spisová značka" />
				</div>
			</div>
		</div>
	</form>
</AccordionItem>
