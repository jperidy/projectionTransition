<script>
    import { getAllPagesList } from "../../actions/pagesActions";
    import { onMount } from "svelte";
    import Loading from "../Loading.svelte";
    import Message from "../Message.svelte";

    export let selectPageHandler;
    export let currentPage;

    let pagesList = [];
    let message = '';
    let loading = false;

    onMount(async () => {
        // get all existing pages
        loading = true;
        const pagesListRequest = await getAllPagesList();
        pagesList = pagesListRequest.list;
        message = pagesListRequest.message;
        loading = false;
    })

</script>

<h3>Pages</h3>

{#if loading}
    <Loading number={1} color="secondary" />
{/if}
{#if message}
    <Message color="danger">{message}</Message>
{/if}
{#if pagesList && pagesList.length}
    <div class='page-list d-grid gap-2'>
        {#each pagesList as page}
            <button 
                class={`page-item btn ${page.name === currentPage ? "btn-primary" : "btn-transparent"} text-start text-break overflow-hidden shadow-sm p-2`} 
                type="button" 
                on:click={() => selectPageHandler(page.name)}
                data-bs-toggle="tooltip" 
                data-bs-placement="top" 
                title={page.name}
            >{`{URL}/${page.name}`}</button>
        {/each}
    </div>
{/if}

<style>
    .page-item {
        transition: 0.5s;
    }
    .page-item:hover {
        background-color: rgba(255, 255, 255, .5);
        transition: 0.5s;
    }
</style>