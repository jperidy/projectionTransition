<script>

    export let number = 1;
    export let color = 'primary'

</script>

{#each [...Array(number).keys()] as item}
    <div class={`spinner-grow my-2 text-${color}`} role='status' keys={item}>
        <span class="visually-hidden">Loading...</span>
    </div>
{/each}
