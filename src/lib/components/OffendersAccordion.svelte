<script lang="ts">
	import { AccordionItem, Heading, Input, Label } from 'flowbite-svelte';

	import { formStore } from '../caseStore';

	let offenderCount = 1;
	let offenderNames: string[] = [];
	let offendersAccordionHeader = '';
	let offenderNamesInputLabel: string;

	$: offendersAccordionHeader = `Informace o pachatel${offenderCount > 1 ? 'ích' : 'i'}`;
	$: offenderNamesInputLabel = offenderCount > 1 ? 'Jména pachatelů' : 'Jméno pachatele';
</script>

<AccordionItem open>
	<span slot="header"><Heading tag="h4">{offendersAccordionHeader}:</Heading></span>
	<form>
		<div>
			<div class="grid gap-6 md:grid-cols-2">
				<div class="space-y-2">
					<Label for="offender">{offenderNamesInputLabel}</Label>
					<Input
						id="offender"
						placeholder="jméno pachatele"
						required
						bind:value={$formStore.offender.name}
					/>
				</div>
			</div>
		</div>
		<!-- <div class="grid gap-6 md:grid-cols-2">
				<div class="space-y-2">
					<Label for="visitors">Počet pachatelů</Label>
					<Input type="number" id="visitors" min={'1'} bind:value={offenderCount} required />
				</div>
				<div>
					<div class="space-y-2">
						<Label for="visitors">{offenderNamesInputLabel}</Label>
						{#each offenderNames as _, i}
							<Input id="visitors" placeholder="pachatel {i + 1}" required />
						{/each}
					</div>
				</div>
			</div> -->
	</form>
</AccordionItem>
