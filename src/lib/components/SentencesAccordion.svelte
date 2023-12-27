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
  { value: '1', name: 'Praha' },
  { value: '2', name: 'Brno' },
  { value: '3', name: 'Ostrava' },
];
</script>


<AccordionItem open>
    <span slot="header"><Heading tag="h5">Rozsudky</Heading></span>
    <Table>
        <TableHead>
            <TableHeadCell>Soud který vydal rozhodnutí</TableHeadCell>
            <TableHeadCell>Spisová značka</TableHeadCell>
            <TableHeadCell>číslo listu</TableHeadCell>
            <TableHeadCell>Datum vyhlášení</TableHeadCell>
            <TableHeadCell>Nabyl právní moci?</TableHeadCell>
            <TableHeadCell>Datum nabytí právní moci</TableHeadCell>
        </TableHead>
        <TableBody>
            <TableBodyRow>
                <TableBodyCell><MultiSelect items={countries}/></TableBodyCell>
                <TableBodyCell><Input id="first_name" required /></TableBodyCell>
                <TableBodyCell><Input type="number" /></TableBodyCell>
                <TableBodyCell><Input type="date" /></TableBodyCell>
                <TableBodyCell><Checkbox/></TableBodyCell>
                <TableBodyCell><Input type="date" /></TableBodyCell>
            </TableBodyRow>
        </TableBody>
    </Table>
</AccordionItem>