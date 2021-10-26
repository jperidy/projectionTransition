<script>
    import { goto } from "$app/navigation";
    import { getFooter, updateOrCreateFooter } from "../actions/footerActions";
    import { Modal, ModalBody, ModalFooter, ModalHeader } from "sveltestrap";
    import config from '../config.json';
    import Message from "./Message.svelte";
    import { userInfo } from "../store";
    import { onMount } from "svelte";
    import { uploadImage } from "../actions/imagesActions";
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
            {"name": "MENTIONS LÉGALES", "url": "/mentions-legales#up", "SUBTITLE": []}

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

    // Manage Brand
    const onSelectAnImageBrand = async(e) => {
        const data = new FormData();
        data.append('file', e.target.files[0]);
        const result = await uploadImage(data, footer.BRAND.LOGO.path);
        if (result.status === 'Ok') {
            footer.BRAND.LOGO.path = result.data;
            footer = footer;
            messageUpdateBrand = '';
            updateOrCreateFooter(footer)
                .then((result) => footer = result.footer)
                .catch((error) => messageUpdateFooter = error);
        } else {
            messageUpdateBrand = result.data;
        }
    };

</script>

{#if messageUpdateFooter}
  <Message color='danger'>{messageUpdateFooter}</Message>
{/if}

<!-- <div class={`row ${config.FOOTER.STYLE.FOOTER.bootstrapClass}`}>

    {#if config.FOOTER.TYPE.navigation}
        <div class={`row ${config.FOOTER.STYLE.NAVIGATION.bootstrapClass}`} style={config.FOOTER.STYLE.NAVIGATION.style}>
            <div class='col-3 text-start'>
                <a href="#up">
                    <img 
                        class='img-fluid mx-2'
                        src={config.FOOTER.BRAND.LOGO.path}
                        alt={config.FOOTER.BRAND.LOGO.alt}
                        style={config.FOOTER.BRAND.LOGO.style}
                    />
                </a>
            </div>
            <div class='col-6 text-center'>
                <div class='row align-items-center'>
                    <div class='col text-center'>
                        {#each config.FOOTER.TITLE as item, position}
                            <span class={config.FOOTER.STYLE.TITLE.bootstrapClass} style={config.FOOTER.STYLE.TITLE.style} on:click={() => goto(item.url)}>{item.name}</span>
                            {#if position < (config.FOOTER.TITLE.length - 1)}
                                <span class='fw-bold' style={config.FOOTER.STYLE.TITLE.style}>|</span>
                            {/if} 
                        {/each}
                    </div>
                </div>
            </div>
            <div class='col-3 text-center'>
                <div class='row my-1'>
                    <div class="col text-center" style='font-size:1.4rem'>
                        {#each config.FOOTER.SOCIAL_NETWORKS as item}
                            <span class='fw-bold'><a class="" target={item.target} href={item.redirect}><img class={config.FOOTER.STYLE.SOCIAL_NETWORKS.bootstrapClass} style={config.FOOTER.STYLE.SOCIAL_NETWORKS.style} src={item.icon} alt={item.alt} /></a></span>
                        {/each}
                    </div>
                </div>
            </div>
        </div>
    {/if}
    {#if config.FOOTER.TYPE.copyright}
        <div class={`row ${config.FOOTER.STYLE.COPYRIGHT.bootstrapClass}`} style={config.FOOTER.STYLE.COPYRIGHT.style}>
            <div class='col text-center'>
                <span class={config.FOOTER.COPYRIGHT.bootstrapClass} style={config.FOOTER.COPYRIGHT.style}>{config.FOOTER.COPYRIGHT.value}</span>
            </div>
        </div>
    {/if}
    {#if isAuthenticate}
        <button class="btn btn-light px-2" on:click={toggle}><i class="bi bi-pencil-square"></i></button>
    {/if}
</div> -->

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
                            <span class='fw-bold'><a class="" target={item.target} href={item.redirect}><img class={API_URL + footer.STYLE.SOCIAL_NETWORKS.bootstrapClass} style={footer.STYLE.SOCIAL_NETWORKS.style} src={item.icon} alt={item.alt} /></a></span>
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

<Modal isOpen={edit} {toggle} size='lg' scrollable>
    <ModalHeader {toggle}>Editer le pied de page</ModalHeader>
    <ModalBody>
        {#if messageUpdateBrand}
          <Message color='danger'>{messageUpdateBrand}</Message>
        {/if}

        <!-- Navigation edition -->
        <div class="row p-2">
            <div class="form-check form-switch align-items-center">
                <label for="switch-navigation">Ajouter des liens de navigation </label>
                <input type="checkbox" class="form-check-input" id="switch-navigation" bind:checked={footer.TYPE.navigation} />
            </div>
            {#if footer.TYPE.navigation}
                <div class="row p-2">
                    <div class="col">
                        <label for="logo-footer">Upload file</label>
                        <input type="file" id="logo-footer" class="form-control" on:change={(e) => onSelectAnImageBrand(e)}>
                    </div>
                    <div class="col">
                        <img class="img-fluid" src={API_URL + footer.BRAND.LOGO.path} alt={footer.BRAND.LOGO.alt}>
                    </div>
                    <div class="col">
                        <label for="logo-footer-alt">Alt</label>
                        <input type="text" id="logo-footer-alt" class="form-control" bind:value={footer.BRAND.LOGO.alt}>
                    </div>
                    <div class="col">
                        <label for="logo-footer-style">Styles (css)</label>
                        <input type="text" id="logo-footer-style" class="form-control" bind:value={footer.BRAND.LOGO.style}>
                    </div>
                    <div class="col">
                        <label for="brand-footer">Marque</label>
                        <input type="text" id="brand-footer" class="form-control" bind:value={footer.BRAND.NAME}>
                    </div>
                </div>
                
            {/if}
        </div>

        <div class="row p-2">
            <div class="form-check form-switch align-items-center">
                <label for="switch-navigation">Ajouter le copyrigth </label>
                <input type="checkbox" class="form-check-input" id="switch-navigation" bind:checked={footer.TYPE.copyright} />
            </div>
        </div>
    </ModalBody>
    <ModalFooter>
        <button class="btn btn-primary" on:click={toggle}>Enregistrer</button>
        <button class="btn btn-secondary" on:click={toggle}>Cancel</button>
    </ModalFooter>
  </Modal> 