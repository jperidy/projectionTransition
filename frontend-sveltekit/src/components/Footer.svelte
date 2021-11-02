<script>
    import { goto } from "$app/navigation";
    import { getFooter, updateOrCreateFooter } from "../actions/footerActions";
    import { Modal, ModalBody, ModalFooter, ModalHeader } from "sveltestrap";
    import config from '../config.json';
    import Message from "./Message.svelte";
    import { userInfo } from "../store";
    import { onMount } from "svelte";
    import EditFooterNavigation from "./EditFooterNavigation.svelte";
    import EditFooterBrand from "./EditFooterBrand.svelte";
    import EditFooterSocialNetworks from "./EditFooterSocialNetworks.svelte";
    import EditFooterCopyrightComponent from "./EditFooterCopyrightComponent.svelte";
    import EditFooterStyleComponent from "./EditFooterStyleComponent.svelte";
    const API_URL = config.SVELTE_ENV === 'dev' ? config.API_URL_DEV : config.SVELTE_ENV === 'preprod' ? config.API_URL_PREPROD : config.SVELTE_ENV === 'production' ? config.API_URL_PROD : config.API_URL_DEV;

    let edit=false;
    let messageUpdateFooter = "";
    let messageUpdateBrand = ""

    $: isAuthenticate = $userInfo && $userInfo.profil === 'admin' ? true : false;

    // Add to edit the footer
    const toggle = async() => {
        if (edit) {
            updateOrCreateFooter(footer)
              .then((result) => footer = result.footer)
              .catch((error) => messageUpdateFooter = error);
        }
        edit = !edit;
    };

    // Default footer
    let footer = {
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

</script>

{#if messageUpdateFooter}
  <Message color='danger'>{messageUpdateFooter}</Message>
{/if}

<!-- display the footer -->
<div class={`row ${footer.STYLE.FOOTER.bootstrapClass}`}>

    {#if footer.TYPE.navigation}
        <div class={`row ${footer.STYLE.NAVIGATION.bootstrapClass}`} style={footer.STYLE.NAVIGATION.style}>
            <div class='col-3 text-start'>
                <a href="#up">
                    <img 
                        class='img-fluid mx-2'
                        src={API_URL + footer.BRAND.LOGO.path}
                        alt={footer.BRAND.LOGO.alt}
                        style={footer.BRAND.LOGO.style}
                    />
                </a>
            </div>
            <div class='col-6 text-center'>
                <div class='row align-items-center'>
                    <div class='col text-center'>
                        {#each footer.TITLE as item, position}
                            <span class={footer.STYLE.TITLE.bootstrapClass} style={footer.STYLE.TITLE.style} on:click={() => goto(item.url)}>{item.name}</span>
                            {#if position < (footer.TITLE.length - 1)}
                                <span class='fw-bold' style={footer.STYLE.TITLE.style}>|</span>
                            {/if} 
                        {/each}
                    </div>
                </div>
            </div>
            <div class='col-3 text-center'>
                <div class='row my-1'>
                    <div class="col text-center" style='font-size:1.4rem'>
                        {#each footer.SOCIAL_NETWORKS as item}
                            <span class='fw-bold'><a class="" target={item.target} href={item.redirect}><img class={footer.STYLE.SOCIAL_NETWORKS.bootstrapClass} style={footer.STYLE.SOCIAL_NETWORKS.style} src={API_URL + item.icon} alt={item.alt} /></a></span>
                        {/each}
                    </div>
                </div>
            </div>
        </div>
    {/if}
    {#if footer.TYPE.copyright}
        <div class={`row ${footer.STYLE.COPYRIGHT.bootstrapClass}`} style={footer.STYLE.COPYRIGHT.style}>
            <div class='col text-center'>
                <span class={footer.COPYRIGHT.bootstrapClass} style={footer.COPYRIGHT.style}>{footer.COPYRIGHT.value}</span>
            </div>
        </div>
    {/if}
    {#if isAuthenticate}
        <button class="btn btn-light px-2" on:click={toggle}><i class="bi bi-pencil-square"></i></button>
    {/if}
</div>

<!-- Edit the footer -->
<Modal isOpen={edit} {toggle} size='lg' scrollable>
    <ModalHeader {toggle}>Editer le pied de page</ModalHeader>
    <ModalBody>
        <div class="row gx-0">
            <div class="col p-2">

                {#if messageUpdateBrand}
                  <Message color='danger'>{messageUpdateBrand}</Message>
                {/if}
        
                <!-- Navigation -->
                <div class="row p-2">
                    <div class="form-check form-switch align-items-center">
                        <label for="switch-navigation">Ajouter des liens de navigation </label>
                        <input type="checkbox" class="form-check-input" id="switch-navigation" bind:checked={footer.TYPE.navigation} />
                    </div>
                    {#if footer.TYPE.navigation}
                        <!-- Brand edition -->
                        <div class="row p-2">
                            <EditFooterBrand bind:footer={footer} updateOrCreateFooter={updateOrCreateFooter} />
                        </div>
            
                        <!-- Navigation edition -->
                        <div class='row p-2'>
                            <EditFooterNavigation bind:footer={footer} updateOrCreateFooter={updateOrCreateFooter} />
                        </div> 
            
                        <!-- social network edition -->
                        <div class='row p-2'>
                            <EditFooterSocialNetworks bind:footer={footer} updateOrCreateFooter={updateOrCreateFooter} />
                        </div>
                    {/if}
                </div>
        
                <div class="row p-2">
                    <div class="form-check form-switch align-items-center">
                        <label for="switch-navigation">Ajouter le copyrigth </label>
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
    </ModalBody>
    <ModalFooter>
        <button class="btn btn-primary" on:click={toggle}>Enregistrer</button>
        <button class="btn btn-secondary" on:click={() => edit = !edit}>Cancel</button>
    </ModalFooter>
  </Modal> 