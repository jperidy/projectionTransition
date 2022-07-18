<script>
    import DisplayEditMenu from "./DisplayEditMenu.svelte";

    export let component;
    export let index = 0;
    export let values;
    export let modalId;
    export let selectedComponentPosition;
    export let positionToCreate;

    let widthOpen = false;
</script>

<div class="column-container border-top border-start border-2 rounded mt-3 pt-3 ps-1" on:mouseenter={() => selectedComponentPosition = index}>
    <div class="colum-index bg-dark text-light d-flex justify-content-center align-items-center">{index + 1}</div>
    <button 
        class="btn btn-transparent drop-down-button text-start my-0"
        on:click={() => widthOpen = !widthOpen}
    >
        {#if widthOpen}
            <i class="bi bi-chevron-up"></i>
        {:else}
            <i class="bi bi-chevron-down"></i>
        {/if}
        Width of the element {index + 1}:
    </button>
    {#if widthOpen}
        <div class="d-flex">
            <div class="m-2 text-center">
                <label for="xs-size" class="w-75 me-3">Mobile</label>
                <input type="number" class="form-control" id="xs-size" min={1} max={12} bind:value={component.sizeMobile}/>
            </div>
            <div class="m-2 text-center">
                <label for="xs-size" class="w-75 me-3">Tablet</label>
                <input type="number" class="form-control" id="xs-size" min={1} max={12} bind:value={component.sizeTablette}/>
            </div>
            <div class="m-2 text-center">
                <label for="xs-size" class="w-75 me-3">Desktop</label>
                <input type="number" class="form-control" id="xs-size" min={1} max={12} bind:value={component.size}/>
            </div>
        </div>
    {/if}
    {#if component.values.length > 0}
        <DisplayEditMenu
            type={component.values[0].type}
            bind:values={component.values[0].values}
            bind:styles={component.values[0].styles}
            bind:pageContent={values}
            position={index}
            displayInFrame={true}
        />
    {:else}
        <button 
            class='btn btn-secondary w-100 my-3' 
            on:click={() => {
                positionToCreate = index;
            }}
            data-bs-toggle="modal" 
            data-bs-target={`#${modalId}`}
        >Select a component</button> 
    {/if}
</div>

<style>
    .column-container{
        position: relative;
        margin-top: 2rem;
    }
    .colum-index {
        position: absolute;
        top:-0.8rem;
        left:-0.8rem;
        width: 1.6rem;
        height: 1.6rem;
    }
    .drop-down-button {
        color: rgb(88, 88, 88);
    }
    .drop-down-button:hover {
        font-weight: bold;
    }
</style>