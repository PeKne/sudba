<script lang="ts">
	import {
		AccordionItem,
		Heading,
		Input,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		MultiSelect,
		Checkbox,
	} from 'flowbite-svelte';

	import MyTextarea from '$lib/components/atoms/MyTextarea.svelte';

let selected = [];
let countries = [
  { value: '1', name: '§21' },
  { value: '2', name: '§235' },
  { value: '3', name: '§114' },
  { value: '4', name: '§11' },
  { value: '5', name: '§66' }
];
</script>


<AccordionItem open>
    <span slot="header"><Heading tag="h5">SKUTKY</Heading></span>
    <Table>
        <TableHead>
            <TableHeadCell>Datum</TableHeadCell>
            <TableHeadCell>Škoda odcizením</TableHeadCell>
            <TableHeadCell>Škoda poškozením</TableHeadCell>
            <TableHeadCell>Poznámka</TableHeadCell>
        </TableHead>
        <TableBody>
            <TableBodyRow>
                <TableBodyCell><Input type="date" id="first_name" required /></TableBodyCell>
                <TableBodyCell><Input type="number" /></TableBodyCell>
                <TableBodyCell><Input type="number" /></TableBodyCell>
                <TableBodyCell><MyTextarea /></TableBodyCell>
            </TableBodyRow>
        
        </TableBody>
    </Table>
</AccordionItem>