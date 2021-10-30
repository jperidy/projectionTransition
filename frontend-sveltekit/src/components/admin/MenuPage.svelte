<script>
    import { getAllPagesList } from "../../actions/pagesActions";
    import { onMount } from "svelte";
    import Loading from "../Loading.svelte";
    import Message from "../Message.svelte";

    export let selectPageHandler;

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
    <div class='page-items d-grid gap-1'>
        {#each pagesList as page}
            <button 
                class="btn btn-transparent text-start" 
                type="button" 
                on:click={() => selectPageHandler(page.name)}
                data-bs-toggle="tooltip" 
                data-bs-placement="top" 
                title={page.name}
            >> /{page.name}</button>
        {/each}
    </div>
{/if}