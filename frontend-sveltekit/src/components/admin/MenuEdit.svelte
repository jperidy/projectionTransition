<script>
    import DisplayEditMenu from "./DisplayEditMenu.svelte";

    export let page;
    export let componentIdSelected;
    export let updateContent;

</script>

<div class='d-flex justify-content-between align-content-center flex-wrap'>
    <h3 class="p-0 m-0">Edition</h3>
    <button class="btn btn-primary" on:click={updateContent}>Save changes</button>
</div>
<div class="mt-3">
    {#if page.content && page.content.length}
        {#each page.content as component, position}
            <div on:mouseleave={() => componentIdSelected = ""} on:mouseenter={() => componentIdSelected = component._id}>
                <DisplayEditMenu
                    type={component.type}
                    bind:values={component.values}
                    bind:styles={component.styles}
                    bind:pageContent={page.content}
                    position={position}
                />
            </div>
        {/each}
    {/if}
</div>
