<script>
    import { createAPage, deleteAPage, duplicateAPage, getAllPagesList, updateDisplayState } from "../../actions/pagesActions";
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

    const transformPageName = (name) => {
        if (!name.startsWith('/')) {
            name = '/' + name;
        }
        if (!name.startsWith('/pages')) {
            name = '/pages' + name;
        }
        return name;
    };

    const createPageHandler = async(e) => {
        e.preventDefault();
        loadingCreate = true;
        const pageCreateResult = await createAPage({
            name: transformPageName(pageNameToCreate),
            content: []
        });
        messageCreate = pageCreateResult.message;
        loadingCreate = false;
        if (!messageCreate) {
            getPages();
        }
    };

    const removePageHandler = async(id) => {
        if (window.confirm('Attention cette action est irreversible !')) {
            await deleteAPage(id);
            getPages();
        }
    };

    const duplicatePageHandler = async(pageName) => {
        await duplicateAPage(pageName);
        getPages();
    };

    const updateDisplayStatus = async (id, displayState) => {
        await updateDisplayState(id, displayState);
        getPages();
    }

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
            <div class={`page-item d-flex justify-content-between rounded ${page.name === currentPage ? "btn-selected" : "btn-transparent"}`}>
                <button 
                    class={`btn text-start text-break overflow-hidden shadow-sm p-2 w-100`} 
                    type="button" 
                    on:click={() => selectPageHandler(page.name)}
                    data-bs-toggle="tooltip" 
                    data-bs-placement="top" 
                    title={page.name}
                >{`${page.name}`}
                </button>
                <button
                    class="btn btn-sm btn-transparent text-light"
                    on:click={() => updateDisplayStatus(page._id, !page.display)}
                >
                    {#if page.display}
                        <i class="bi bi-eye-fill"></i>
                    {:else}
                        <i class="bi bi-eye-slash-fill"></i>
                    {/if}
                </button>
                <button
                    class="btn btn-sm btn-transparent text-light"
                    on:click={() => duplicatePageHandler(page.name)}
                ><i class="bi bi-files"></i>
                </button>
                <button
                    class="btn btn-sm btn-transparent text-light"
                    on:click={() => removePageHandler(page._id)}
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
        background-color: rgb(150, 150, 150);
        transition: 0.5s;
    }
    .btn-selected {
        background-color: rgb(150, 150, 150);
    }
</style>