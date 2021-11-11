<script>
    import { getFooter, updateOrCreateFooter } from "../../actions/footerActions";

    import { onMount } from "svelte";
    import Message from "../Message.svelte";
    import EditFooterBrand from "../EditFooterBrand.svelte";
    import EditFooterNavigation from "../EditFooterNavigation.svelte";
    import EditFooterSocialNetworks from "../EditFooterSocialNetworks.svelte";
    import EditFooterCopyrightComponent from "../EditFooterCopyrightComponent.svelte";
    import EditFooterStyleComponent from "../EditFooterStyleComponent.svelte";

    let messageUpdateFooter = "";
    let loadingUpdate = false;
    let messageUpdateBrand = "";

    // Default footer
    export let footer = {
        name: "footer",
        "TYPE": {
            "navigation": true,
            "copyright": true
        },
        "BRAND": {
            "LOGO": {
                "path": "", 
                "alt": "",
                "style" : "width: 100%; max-width:130px;"
            },
            "NAME": ""
        },
        "TITLE": [
            {"name": "", "url": "", "SUBTITLE": []}

        ],
        "SOCIAL_NETWORKS": [
            {"name": "email", "icon": "", "alt": "", "redirect": "", "target": ""},
        ],
        "COPYRIGHT": {
            "value": "©2021",
            "style": "font-size:1rem;",
            "bootstrapClass": "mx-3"
        },
        "STYLE": {
            "FOOTER": {"bootstrapClass": "bg-white text-dark align-items-center" , "style": ""},
            "NAVIGATION": {"bootstrapClass": "row bg-white text-dark align-items-center px-3 py-2 " , "style": "min-height:15vh;"},
            "COPYRIGHT": {"bootstrapClass": "row align-items-center my-1" , "style": ""},
            "TITLE": {"bootstrapClass": "mx-3 fw-bold", "style": "font-size:1rem;cursor:pointer;"},
            "SOCIAL_NETWORKS" : {"bootstrapClass": "", "style" : "max-width: 7vh;height: auto;"}
        }
    };

    onMount(async () => {
        // load footer
        let footerRequest = await getFooter();
        if (footerRequest && footerRequest.footer) {
        for (let key in footerRequest.footer) {
            footer[key] = footerRequest.footer[key];
        }
        }
        footer = footer;
    });

    const updateFooterHander = () => {
        messageUpdateFooter = "";
        loadingUpdate = true;
        updateOrCreateFooter(footer)
            .then((result) => {footer = result.footer; loadingUpdate = false;})
            .catch((error) => {messageUpdateFooter = error; loadingUpdate = false;});
    }

</script>

<div class="px-5 py-3">
    <div class="d-flex justify-content-end">
        <button class="btn btn-primary" on:click={updateFooterHander}>
            {#if loadingUpdate}
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <span class="visually-hidden">Loading...</span>
            {:else}
                Save
            {/if}
        </button>
    </div>

    <h3 class="border-bottom mb-3 pb-2">Footer</h3>
    <div class="row gx-0">
        {#if messageUpdateFooter}
            <Message color='danger'>{messageUpdateFooter}</Message>
        {/if}
        <div class="col p-2">
            {#if messageUpdateBrand}
              <Message color='danger'>{messageUpdateBrand}</Message>
            {/if}
            <!-- Navigation -->
            <div class="row p-2">
                <div class="form-check form-switch align-items-center">
                    <label for="switch-navigation">Display brand, social network and navigations</label>
                    <input type="checkbox" class="form-check-input" id="switch-navigation" bind:checked={footer.TYPE.navigation} />
                </div>
                {#if footer.TYPE.navigation}
                    <!-- Brand edition -->
                    <div class="row p-2">
                        <EditFooterBrand bind:footer={footer} />
                    </div>
                    <!-- Navigation edition -->
                    <div class='row p-2'>
                        <EditFooterNavigation bind:footer={footer} />
                    </div> 
                    <!-- social network edition -->
                    <div class='row p-2'>
                        <EditFooterSocialNetworks bind:footer={footer} />
                    </div>
                {/if}
            </div>
            <div class="row p-2">
                <div class="form-check form-switch align-items-center">
                    <label for="switch-navigation">Display copyright</label>
                    <input type="checkbox" class="form-check-input" id="switch-navigation" bind:checked={footer.TYPE.copyright} />
                </div>
                {#if footer.TYPE.copyright}
                    <div class="row p-2">
                        <EditFooterCopyrightComponent bind:footer={footer} />
                    </div>
                {/if}
            </div>
            <div class="row p-2">
                <EditFooterStyleComponent bind:footer={footer} />
            </div>
        </div>
    </div>
</div>
