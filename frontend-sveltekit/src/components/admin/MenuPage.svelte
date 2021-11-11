<script>
    import { createAPage, deleteAPage, duplicateAPage, getAllPagesList } from "../../actions/pagesActions";
    import { onMount } from "svelte";
    import Loading from "../Loading.svelte";
    import Message from "../Message.svelte";

    export let selectPageHandler;
    export let currentPage;

    export let pagesList = [];
    export let getPages;
    
    let message = '';
    let loading = false;
    let loadingCreate = false;
    let messageCreate = false;

    let pageNameToCreate = "";

    // const getPages = async () => {
    //     loading = true;
    //     const pagesListRequest = await getAllPagesList();
    //     pagesList = pagesListRequest.list;
    //     message = pagesListRequest.message;
    //     loading = false;
    // };

    // onMount(() => {
    //     // get all existing pages
    //     getPages();
    // });

    const transformUrl = (url) => {
        // supprimer le premier /
        if(url.match(/^\//i)) {
            url = url.substr(1);
        }
        url = url.replace('/', '-');
        return url;
    };

    const createPageHandler = async(e) => {
        e.preventDefault();
        loadingCreate = true;
        const pageCreateResult = await createAPage({
            name: transformUrl(pageNameToCreate),
            content: []
        });
        messageCreate = pageCreateResult.message;
        loadingCreate = false;
        if (!messageCreate) {
            getPages();
        }
    };

    const removePageHandler = async(pageName) => {
        if (window.confirm('Attention cette action est irreversible !')) {
            await deleteAPage(pageName);
            getPages();
        }
    };

    const duplicatePageHandler = async(pageName) => {
        await duplicateAPage(pageName);
        getPages();
    };

</script>

<h3 class="mt-2">Pages</h3>

{#if loading}
    <Loading number={1} color="secondary" />
{/if}
{#if message}
    <Message color="danger">{message}</Message>
{/if}

<!-- create an empty page -->
<form on:submit={createPageHandler}>
    <div class="input-group mb-3">
        <input 
            type="text" 
            class="form-control" 
            placeholder="/url/to/create"
            aria-label="Enter page URL" 
            aria-describedby="button-addon2" 
            bind:value={pageNameToCreate}/>
        <button class="btn btn-outline-light" type="submit" id="button-addon2">
            {#if loadingCreate}
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            {:else}
                <i class="bi bi-file-earmark-plus"></i>
            {/if}
        </button>
    </div>
    {#if messageCreate}
        <Message color="danger">{messageCreate}</Message>
    {/if}
</form>

<!-- display all existing pages -->
{#if pagesList && pagesList.length}
    <div class='page-list d-grid gap-2'>
        {#each pagesList as page}
            <div class="page-item d-flex justify-content-between">
                <button 
                    class={`btn ${page.name === currentPage ? "btn-primary" : "btn-transparent"} text-start text-break overflow-hidden shadow-sm p-2 w-100`} 
                    type="button" 
                    on:click={() => selectPageHandler(page.name)}
                    data-bs-toggle="tooltip" 
                    data-bs-placement="top" 
                    title={page.name}
                >{`/${page.name}`}</button>
                <button
                    class="btn btn-sm btn-transparent text-light"
                    on:click={() => duplicatePageHandler(page.name)}
                ><i class="bi bi-files"></i>
                </button>
                <button
                    class="btn btn-sm btn-transparent text-light"
                    on:click={() => removePageHandler(page.name)}
                >
                    <i class="bi bi-trash"></i>
                </button>
            </div>
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