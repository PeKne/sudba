<script lang="ts">
	import {
		AccordionItem,
		Heading,
		Input,
		Label,
	} from 'flowbite-svelte';

</script>

<AccordionItem open>
		<span slot="header"><Heading tag="h5">Obecné informace</Heading></span>

		<form>
			<div>
                <div class="grid gap-6 md:grid-cols-2">
				<div class="space-y-2">
					<Label for="TODOID">Spisová značka</Label>
						<Input id="TODOID" required />
				</div>
            </div>
			</div>

		</form>
</AccordionItem>