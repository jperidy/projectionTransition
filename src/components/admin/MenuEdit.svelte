<script>
    import { pageRequest } from "../../store";
    import AddElement from "../AddElement.svelte";
    import DisplayEditMenu from "./DisplayEditMenu.svelte";

    export let page;
    export let selectedComponent;
    export let updateContent;

    $:hasBeenModified = !(JSON.stringify(page) === JSON.stringify($pageRequest.content));

    const modalId = 'menuEditModal' + crypto.randomUUID();

    const addContent = (component, position) => {
        page.content.splice(position, 0, component);
        page.content = page.content;  
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
            <button 
                id='button-save'
                class="btn" 
                type="button" 
                on:click={updateContent}
            >
                Save changes
            </button>
        {:else}
            <button 
                id='button-up-to-date'
                class="btn" 
                type="button" 
                on:click={updateContent}
            >
                Up to date
            </button>
        {/if}
    {/if}
</div>
<div class="mt-3">
    {#if page.content && page.content.length}
        <div class="p-3">You are editing: <strong>{page.name}</strong></div>
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
                data-bs-toggle="modal" 
                data-bs-target={`#${modalId}`}
            >
                First component
            </button>
        </div>
    {/if}
</div>

<AddElement
    action={addContent}
    position={0}      
    copyValues={null}
    copyStyles={null}
    copyType={null}
    modalId={modalId}
/>

<style>
    #button-save {
        background-color: rgb(255, 166, 1);
        color: white;
    }
    #button-up-to-date {
        background-color: rgb(0, 192, 26);
        color: white;
    }
</style>