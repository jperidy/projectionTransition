<script>
    import { updateOrCreateNavBar } from "../../actions/navActions";
    import EditNavMenuComponent from "./EditNavMenuComponent.svelte";
    import EditNavSocialNetworks from "./EditNavSocialNetworks.svelte";
    import EditNavStylesComponent from "./EditNavStylesComponent.svelte";
    import EditNavBrandComponent from "./EditNavBrandComponent.svelte";
    import Message from "../Message.svelte";

    let messageUpdate = "";
    let loadingUpdate = false;

    // DEFAULT navBar
    export let navBar = {
        name:"nav",
        "TITLE": [{"name": "MENU 1", "url": "", "SUBTITLE": []}],
        "BRAND": {"LOGO": {"path": "", "alt": "", "style": "max-width: 20vh; height:auto;"},"NAME": ""},
        "SOCIAL_NETWORKS": [{"name": "", "icon": "", "alt": "", "redirect": "", "target": "_blank"}],
        "STYLE": {"expand": "xl","color": "white","theme": "light","TITLE": { "bootstrapClass": "text-dark mx-2", "style": "font-family: omotenashi_2regular;font-size: 1.3rem;" },"SOCIAL_NETWORKS": { "bootstrapClass": "", "style": "max-width: 6vh;height: auto;"}}
    };

    const updateHandler = () => {
        messageUpdate = "";
        loadingUpdate = true;
        updateOrCreateNavBar(navBar)
            .then((result) => {
                navBar = result.navBar;
                loadingUpdate = false
            })
            .catch((error) => {messageUpdate = error; loadingUpdate = false});
    };

</script>

<div class="px-5 py-3">
    <!-- validate changes -->
    <div class="d-flex justify-content-end">
        <button class="btn btn-primary" on:click={updateHandler}>
            {#if loadingUpdate}
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <span class="visually-hidden">Loading...</span>
            {:else}
                Save
            {/if}
        </button>
    </div>
    {#if messageUpdate}
        <Message color='danger'>{messageUpdate}</Message>
    {/if}
    <!-- brand edition -->
    <div class="row p-2">
        <EditNavBrandComponent bind:navBar={navBar} />
    </div>
    <!-- menu edition -->
    <div class="row p-2">
        <EditNavMenuComponent bind:navBar={navBar} />
    </div>
    <!-- social network edition -->
    <div class='row p-2'>
        <EditNavSocialNetworks bind:navBar={navBar} />
    </div>
    <!-- styles edition -->
    <div class="row p-2">
        <EditNavStylesComponent bind:navBar={navBar} />
    </div>
</div>