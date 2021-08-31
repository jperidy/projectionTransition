<script>
import { Spinner } from "sveltestrap";

    export let number = 1;
    export let color = 'primary'

</script>

{#each [...Array(number).keys()] as item}
    <Spinner {color} type='grow' keys={item} class='my-2'/>
{/each}
