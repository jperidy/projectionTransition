<script>
    import { getContent, updateOrCreateContent } from "../actions/pagesActions";
    import { onMount } from "svelte";
    import DisplayCustomComponent from "../components/DisplayCustomComponent.svelte";
    import MenuPage from "../components/admin/MenuPage.svelte";
    import MenuEdit from "../components/admin/MenuEdit.svelte";
    import { userInfo } from "../store";
    import { logout } from "../actions/userActions";
    import { goto } from "$app/navigation";
    import { browser } from "$app/env";

    let pageRequest = { content: { content: [], name: '' }, loading: true, message: '' };
    let componentIdSelected = "";
    //$: console.log(componentIdSelected)
    
    let isAuthenticate = false;
    $: {
        isAuthenticate = $userInfo && $userInfo.profil === 'admin' ? true : false;
        if (browser && !isAuthenticate) { goto('/login'); }
    }

    onMount(async() => {
        pageRequest = await getContent("homeContent");
    });

    //
    const selectPageHandler = async (pageName) => {
        pageRequest = await getContent(pageName);
    };

    const updateContent = async() => {
        pageRequest = await updateOrCreateContent(pageRequest.content);
    }

    //$: console.log('pageRequest', pageRequest)
</script>

{#if isAuthenticate}
<div class="row">
    <!-- zone to list and select a page -->
    <div class="col-2 menu-page bg-dark shadow-lg overflow-auto">
        <div class="p-2">
            <MenuPage selectPageHandler={selectPageHandler} />
        </div>
    </div>

    <!-- zone to edit components of selected page -->
    <div class="col-3 menu-edition bg-light shadow-lg overflow-auto text-dark">
        <div class="p-2">
            <MenuEdit 
                bind:page={pageRequest.content}
                bind:componentIdSelected={componentIdSelected}
                updateContent={updateContent}
            />
        </div>
    </div>

    <!-- zone to preview your page -->
    <div class="col-7 p-0 preview overflow-auto">
        <!-- select the screen size -->
        <div class="bandeau bg-dark border-light shadow px-3 py-auto d-flex align-items-center justify-content-center">
            <h3 class="my-0 mx-2">Previews </h3>
            <button class="btn btn-primary mx-2">Desktop</button>
            <button class="btn btn-primary mx-2">Tablet</button>
            <button class="btn btn-primary mx-2">Mobile</button>
            <button
                    class='btn btn-light'
                    style='margin-left:auto'
                    on:click={() => logout()}
                    block
                ><i class="bi bi-door-open"></i>Logout</button>
        </div>
        <!-- preview -->
        <div class="display-preview">
            {#if pageRequest.content && pageRequest.content.content}
                {#each pageRequest.content.content as section, position}
                    <div class={`${section._id === componentIdSelected ? 'border rounded-3 shadow' : ''}`}>
                        <DisplayCustomComponent 
                            bind:value={section.value}
                            bind:values={section.values}
                            bind:styles={section.styles}
                            type={section.type}
                            updateContent={null}
                            admin={false}
                            edit={false}
                            city={"city"}
                        />   
                    </div>
                {/each}
            {/if}
        </div>
    </div>
</div>
{/if}

<style>
    .menu-page {
        height: 80vh;
    }
    .menu-edition {
        height: 80vh;
    }
    .preview {
        height: 80vh;
    }
    .bandeau {
        min-height: 10vh;
    }
</style>