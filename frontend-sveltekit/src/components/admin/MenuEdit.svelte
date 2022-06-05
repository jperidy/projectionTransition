<script>
    import { pageRequest } from "../../store";
    import AddElement from "../AddElement.svelte";
    import DisplayEditMenu from "./DisplayEditMenu.svelte";

    export let page;
    export let selectedComponent;
    export let updateContent;

    $:hasBeenModified = !(JSON.stringify(page) === JSON.stringify($pageRequest.content));
    

    let addWindow = false;
    const addContent = (component, position) => {
        page.content.splice(position, 0, component);
        page.content = page.content;  
    };

    const createFirstComponentHandler = () => {
        addWindow = true;
    };

</script>

<div class='mt-2 mx-2 d-flex justify-content-between align-items-center flex-wrap'>
    <h3 class="p-0 m-0">Edition</h3>
    {#if $pageRequest.loading}
        <button class="btn btn-primary text-dark" type="button" disabled>
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            Loading...
        </button>
    {:else}
        {#if hasBeenModified}
            <button class="btn btn-warning text-light" type="button" on:click={updateContent}>
                Save changes
            </button>
        {:else}
            <button class="btn btn-primary text-dark" type="button" on:click={updateContent}>
                Up to date
            </button>
        {/if}
    {/if}
</div>
<div class="mt-3">
    {#if page.content && page.content.length}
        <input class="form-control" bind:value={page.name} />
        {#each page.content as component, position}
            <div on:mouseleave={() => selectedComponent = {id:"", position:null}} on:mouseenter={() => selectedComponent = {id: component._id, position:null}}>
                <DisplayEditMenu
                    type={component.type}
                    bind:values={component.values}
                    bind:styles={component.styles}
                    bind:pageContent={page.content}
                    bind:selectedComponentPosition={selectedComponent.position}
                    position={position}
                    displayInFrame={false}
                />
            </div>
        {/each}
    {:else}
        <div class="create-first-component d-flex justify-content-center">
            <button 
                class="btn btn-outline-dark w-50"
                on:click={createFirstComponentHandler}
            >
                First component
            </button>
        </div>
    {/if}
</div>

<AddElement
    addContent={addContent}
    position={0}      
    bind:open={addWindow}
    addToLayout={''}
    copyValues={null}
    copyStyles={null}
    copyType={null}
/>
