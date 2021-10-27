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

    // Manage Navigation
    const arrayMove = (arr, fromIndex, toIndex) => {
        var element = arr[fromIndex];
        arr.splice(fromIndex, 1);
        arr.splice(toIndex, 0, element);
        return arr;
    };

    let navName = '';
    let navUrl = '';
    const addNavigation = (e) => {
        e.preventDefault();
        footer.TITLE = [ ...footer.TITLE, {"name": navName, "url": navUrl, "SUBTITLE": []}];
        footer = footer;
        navName = '';
        navUrl = '';
        updateOrCreateFooter(footer)
        .then((result) => footer = result.footer)
        .catch((error) => messageUpdateNav = error);
    };

    const deleteNavigation = (index) => {
    footer.TITLE.splice(index, 1);
    footer = footer;
    updateOrCreateFooter(footer)
      .then((result) => footer = result.footer)
      .catch((error) => messageUpdateNav = error);
    };
    const upNavigation = (index) => {
        if (index > 0) {
        footer.TITLE = arrayMove(footer.TITLE, index, index - 1);
        updateOrCreateFooter(footer)
            .then((result) => footer = result.footer)
            .catch((error) => messageUpdateNav = error);
        }
    };
    const downNavigation = (index) => {
        if (index < footer.TITLE.length - 1) {
        footer.TITLE = arrayMove(footer.TITLE, index, index + 1);
        updateOrCreateFooter(footer)
            .then((result) => footer = result.footer)
            .catch((error) => messageUpdateFooter = error);
        }
    };

    // Manage Social Network
    let snName = '';
    let snIcon = '';
    let snAlt = '';
    let snRedirect = '';
    let newTarget = true;

    const addSocialNetwork = (e) => {
        e.preventDefault();
        footer.SOCIAL_NETWORKS = [ ...footer.SOCIAL_NETWORKS, {"name": snName, "icon": snIcon, "alt": snAlt, "redirect": snRedirect, "target": newTarget ? '_blank' : ''}];
        footer = footer;
        snName = "";
        snIcon = "";
        snAlt = "";
        snRedirect = "";
        newTarget = true;
        updateOrCreateFooter(footer)
        .then((result) => footer = result.footer)
        .catch((error) => messageUpdateFooter = error);
    };
    const deleteSocialNetwork = (index) => {
        footer.SOCIAL_NETWORKS.splice(index, 1);
        footer = footer;
        updateOrCreateFooter(footer)
        .then((result) => footer = result.footer)
        .catch((error) => messageUpdateFooter = error);
    };
    const upSocialNetwork = (index) => {
        if (index > 0) {
        footer.SOCIAL_NETWORKS = arrayMove(footer.SOCIAL_NETWORKS, index, index - 1);
        }
    };
    const downSocialNetwork = (index) => {
        if (index < footer.SOCIAL_NETWORKS.length - 1) {
        footer.SOCIAL_NETWORKS = arrayMove(footer.SOCIAL_NETWORKS, index, index + 1);
        }
    };
    const onSelectAnImageSocialNetwork = async(index, e) => {
        const data = new FormData();
        data.append('file', e.target.files[0]);
        const result = await uploadImage(data, index === -1 ? '' : footer.SOCIAL_NETWORKS[index].icon);
        if (result.status === 'Ok') {
        if (index === -1) { // create
            snIcon = result.data;
        } else { // update
            footer.SOCIAL_NETWORKS[index].icon = result.data;
            footer = footer;
            updateOrCreateFooter(footer)
            .then((result) => footer = result.footer)
            .catch((error) => messageUpdateFooter = error);
        }
            messageUpdateBrand = '';
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

<Modal isOpen={edit} {toggle} size='lg' scrollable>
    <ModalHeader {toggle}>Editer le pied de page</ModalHeader>
    <ModalBody>
        <div class="row gx-0">
            <div class="col p-2">

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
                    <div class="border rounded">
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
        
                        <!-- Navigation edition -->
                        <div class='row p-2'>
                            <div class="col">
                            <form on:submit={addNavigation}>
                                <div class="row align-items-end">
                                <div class="col">
                                    <label for="nameMenu">Menu Name</label>
                                    <input type="text" class="form-control" id="nameMenu" bind:value={navName} placeholder="Ex. MENTIONS LEGALES"/>
                                </div>
                                <div class="col">
                                    <label for="urlMenu">Redirection vers </label>
                                    <input type="text" class="form-control" id="urlMenu" bind:value={navUrl} placeholder="Ex. /mentions-legales#up"/>
                                </div>
                                <div class="col">
                                    <button type='submit' class="btn btn-primary">+</button>
                                </div>
                                </div>
                            </form>
                        
                            {#each footer.TITLE as itemFooter, ind}
                                <div class='row mt-1'>
                                <div class="col">
                                    <input type="text" class="form-control" id={`itemFooter-${ind}`} bind:value={itemFooter.name} >
                                </div>
                                <div class="col">
                                    <input type="text" class="form-control" id={`url-${ind}`} bind:value={itemFooter.url} >
                                </div>
                                <div class="col">
                                    <button class="btn btn-danger btn-sm" on:click={() => deleteNavigation(ind)}>x</button>
                                    <button class="btn btn-secondary btn-sm" on:click={() => upNavigation(ind)}>Up</button>
                                    <button class="btn btn-secondary btn-sm" on:click={() => downNavigation(ind)}>Down</button>
                                </div>
                                </div>
                            {/each}
                            </div>
                        </div> 
        
                        <!-- social network edition -->
                        <div class='row p-2'>
                            <div class="col">
                            <p>Social Networks</p>
                            <form on:submit={addSocialNetwork}>
                                <div class="row align-items-end">
                                <div class="col">
                                    <label for="nameSN">Name</label>
                                    <input type="text" class="form-control" id="nameSN" bind:value={snName} placeholder="Ex. Facebook"/>
                                </div>
                                <div class="col">
                                    <label for="iconSN">Icon </label>
                                    <input type="file" class="form-control" id="iconSN" on:change={(e) => onSelectAnImageSocialNetwork(-1, e)}/>
                                </div>
                                <div class="col bg-light">
                                    <img class='img-fluid' src={API_URL + snIcon} alt={snAlt} />
                                </div>
                                <div class="col">
                                    <label for="altSN">Texte alternatif</label>
                                    <input type="text" class="form-control" id="altSN" bind:value={snAlt} placeholder="Ex. Lien vers Facebook"/>
                                </div>
                                <div class="col">
                                    <label for="redirectSN">Redirection vers </label>
                                    <input type="text" class="form-control" id="redirectSN" bind:value={snRedirect} placeholder="Ex. https://facebook.com"/>
                                </div>
                                <div class="col">
                                    <div class="form-check form-switch align-items-center">
                                    <label for="targetSN">Nouvel onglet </label>
                                    <input type="checkbox" class="form-check-input" id="targetSN" bind:checked={newTarget} />
                                    </div>
                                </div>
                                <div class="col">
                                    <button type='submit' class="btn btn-primary">+</button>
                                </div>
                                </div>
                            </form>
        
                            <!-- {"name": "", "icon": "", "alt": "", "redirect": "", "target": ""}, -->
                            {#each footer.SOCIAL_NETWORKS as item, ind}
                                <div class='row mt-1'>
                                <div class="col my-auto">
                                    <input type="text" class="form-control" bind:value={item.name} >
                                </div>
                                <div class="col my-auto">
                                    <input type="file" class="form-control" on:change={(e) => onSelectAnImageSocialNetwork(ind, e)}>
                                </div>
                                <div class="col my-auto bg-light">
                                    <img class='img-fluid' src={API_URL + item.icon} alt={snAlt} />
                                </div>
                                <div class="col my-auto">
                                    <input type="text" class="form-control" bind:value={item.alt} >
                                </div>
                                <div class="col my-auto">
                                    <input type="text" class="form-control" bind:value={item.redirect} >
                                </div>
                                <div class="col my-auto">
                                    <input type="text" class="form-control" bind:value={item.target} >
                                </div>
                                <div class="col my-auto">
                                    <button class="btn btn-danger btn-sm" on:click={() => deleteSocialNetwork(ind)}>x</button>
                                    <button class="btn btn-secondary btn-sm" on:click={() => upSocialNetwork(ind)}>Up</button>
                                    <button class="btn btn-secondary btn-sm" on:click={() => downSocialNetwork(ind)}>Down</button>
                                </div>
                                </div>
                            {/each}
                            </div>
                        </div>
                    </div>
                        
                    {/if}
                </div>
        
                <div class="row p-2">
                    <div class="form-check form-switch align-items-center">
                        <label for="switch-navigation">Ajouter le copyrigth </label>
                        <input type="checkbox" class="form-check-input" id="switch-navigation" bind:checked={footer.TYPE.copyright} />
                    </div>
        
                    {#if footer.TYPE.copyright}
                    <div class="border rounded">
                        <div class="row p-2">
                            <div class="col">
                                <label for="copyright-name">Name</label>
                                <input type="text" class="form-control" id="copyright-name" bind:value={footer.COPYRIGHT.value} placeholder="©2021">
                            </div>
                            <div class="col">
                                <label for="copyright-bootstrapclass">Classe bootstrap</label>
                                <input type="text" class="form-control" id="copyright-bootstrapclass" bind:value={footer.COPYRIGHT.bootstrapClass} placeholder="Ex. bg-primary">
                            </div>
                            <div class="col">
                                <label for="copyright-style">Style (CSS)</label>
                                <input type="text" class="form-control" id="copyright-style" bind:value={footer.COPYRIGHT.style} placeholder="Ex. background: blue;">
                            </div>
                        </div>
                    </div>
                    {/if}
                    
                    <p class="mt-2 mb-1">GLOBAL STYLES</p>
                    <div class="border rounded">
                        <div class="row p-2 align-items-end">
                            <div class="col">
                                <p class="my-auto">FOOTER STYLE: </p>
                            </div>
                            <div class="col">
                                <label for="footer-bootstrapclass">Classe bootstrap</label>
                                <input type="text" class="form-control" id="footer-bootstrapclass" bind:value={footer.STYLE.FOOTER.bootstrapClass} placeholder="Ex. bg-primary">
                            </div>
                            <div class="col">
                                <label for="footer-style">Style (CSS)</label>
                                <input type="text" class="form-control" id="footer-style" bind:value={footer.STYLE.FOOTER.style} placeholder="Ex. background: blue;">
                            </div>
                        </div>
                        <div class="row p-2 align-items-end">
                            <div class="col">
                                <p class="my-auto">NAVIGATION STYLE: </p>
                            </div>
                            <div class="col">
                                <label for="navigation-bootstrapclass">Classe bootstrap</label>
                                <input type="text" class="form-control" id="navigation-bootstrapclass" bind:value={footer.STYLE.NAVIGATION.bootstrapClass} placeholder="Ex. bg-primary">
                            </div>
                            <div class="col">
                                <label for="navigation-style">Style (CSS)</label>
                                <input type="text" class="form-control" id="navigation-style" bind:value={footer.STYLE.NAVIGATION.style} placeholder="Ex. background: blue;">
                            </div>
                        </div>
                        <div class="row p-2 align-items-end">
                            <div class="col">
                                <p class="my-auto">COPYRIGHT STYLE: </p>
                            </div>
                            <div class="col">
                                <label for="copyright-style-bootstrapclass">Classe bootstrap</label>
                                <input type="text" class="form-control" id="copyright-style-bootstrapclass" bind:value={footer.STYLE.COPYRIGHT.bootstrapClass} placeholder="Ex. bg-primary">
                            </div>
                            <div class="col">
                                <label for="copyright-style-style">Style (CSS)</label>
                                <input type="text" class="form-control" id="copyright-style-style" bind:value={footer.STYLE.COPYRIGHT.style} placeholder="Ex. background: blue;">
                            </div>
                        </div>
                        <div class="row p-2 align-items-end">
                            <div class="col">
                                <p class="my-auto">TITLE STYLE: </p>
                            </div>
                            <div class="col">
                                <label for="title-style-bootstrapclass">Classe bootstrap</label>
                                <input type="text" class="form-control" id="title-style-bootstrapclass" bind:value={footer.STYLE.TITLE.bootstrapClass} placeholder="Ex. bg-primary">
                            </div>
                            <div class="col">
                                <label for="title-style-style">Style (CSS)</label>
                                <input type="text" class="form-control" id="title-style-style" bind:value={footer.STYLE.TITLE.style} placeholder="Ex. background: blue;">
                            </div>
                        </div>
                        <div class="row p-2 align-items-end">
                            <div class="col">
                                <p class="my-auto">SOCIAL NETWORKS STYLE: </p>
                            </div>
                            <div class="col">
                                <label for="social-networks-style-bootstrapclass">Classe bootstrap</label>
                                <input type="text" class="form-control" id="social-networks-style-bootstrapclass" bind:value={footer.STYLE.SOCIAL_NETWORKS.bootstrapClass} placeholder="Ex. bg-primary">
                            </div>
                            <div class="col">
                                <label for="social-networks-style-style">Style (CSS)</label>
                                <input type="text" class="form-control" id="social-networks-style-style" bind:value={footer.STYLE.SOCIAL_NETWORKS.style} placeholder="Ex. background: blue;">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </ModalBody>
    <ModalFooter>
        <button class="btn btn-primary" on:click={toggle}>Enregistrer</button>
        <button class="btn btn-secondary" on:click={toggle}>Cancel</button>
    </ModalFooter>
  </Modal> 