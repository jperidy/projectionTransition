<script>
import EditLayoutComponent from "./EditLayoutComponent.svelte";
import EditTextComponent from "./EditTextComponent.svelte";

    export let type;
    export let values;
    export let styles;

    let visible = false;

    //console.log('values', values)
</script>

<div class="d-grid m-1">
    <button class="btn btn-transparent text-start text-dark border-bottom" on:click={() => visible = !visible}>> {type}</button>
    {#if visible}
        {#if type === 'layoutComponent'}
            <EditLayoutComponent
                bind:values={values}
                bind:styles={styles}
            />
        {/if}
        {#if type === 'textComponent'}
            <EditTextComponent
                bind:values={values}
                bind:styles={styles}
            />
        {/if}
    {/if}
</div>