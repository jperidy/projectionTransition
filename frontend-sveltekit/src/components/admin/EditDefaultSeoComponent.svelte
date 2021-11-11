<script>
import { getSeo, updateOrCreateSeo } from '../../actions/seoActions';

import { onMount } from 'svelte';

    import { uploadImage } from '../../actions/imagesActions';

    import config from '../../config.json';
    import Message from '../Message.svelte';
    const API_URL = config.SVELTE_ENV === 'dev' ? config.API_URL_DEV : config.SVELTE_ENV === 'preprod' ? config.API_URL_PREPROD : config.SVELTE_ENV === 'production' ? config.API_URL_PROD : config.API_URL_DEV;

    let messageUploadImage = "";
    let loadingUpdateSeo = false;
    let messageUpdateSeo = "";

    // Default SEO
    export let seo = {
        "name": "seo",
        "DEFAULT_TITLE": "",
        "DEFAULT_DESCRIPTION": "",
        "DEFAULT_OG_TITLE": "",
        "DEFAULT_OG_DESCRIPTION": "",
        "DEFAULT_OG_IMAGE": "",
        "FAVICON_48_48": "",
        "FAVICON_64_64": "",
        "FAVICON_96_96": "",
        "FAVICON_128_128": "",
        "FAVICON_196_196": ""
    }

    onMount(async() => {
        let seoRequest = await getSeo();
        if (seoRequest && seoRequest.seo) {
        for (let key in seoRequest.seo) {
            seo[key] = seoRequest.seo[key];
        }
        }
        seo = seo;
    });

    const updateOrCreateHandler = () => {
        messageUpdateSeo = '';
        loadingUpdateSeo = true;
        updateOrCreateSeo(seo)
            .then((result) => {seo = result.seo; loadingUpdateSeo = false;})
            .catch((error) => {messageUpdateSeo = error; loadingUpdateSeo = false});
    };

    // Manage OG
    const onSelectAnImageOg = async(e) => {
        const data = new FormData();
        data.append('file', e.target.files[0]);
        const result = await uploadImage(data, seo.DEFAULT_OG_IMAGE);
        if (result.status === 'Ok') {
            seo.DEFAULT_OG_IMAGE = result.data;
            seo = seo;
            updateOrCreateHandler();
            // messageUploadImage = '';
            // updateOrCreateSeo(seo)
            // .then((result) => seo = result.seo)
            // .catch((error) => messageUpdateSeo = error);
        } else {
            messageUploadImage = result.data;
        }
    };

</script>

<div class="px-5 py-3">
    {#if messageUpdateSeo}
        <Message color="danger">{messageUpdateSeo}</Message>
    {/if}
    <div class="d-flex justify-content-end">
        <button class="btn btn-primary" on:click={updateOrCreateHandler}>
            {#if loadingUpdateSeo}
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <span class="visually-hidden">Loading...</span>
            {:else}
                Save
            {/if}
        </button>
    </div>

    <h3 class="border-bottom mb-3 pb-2">Default SEO</h3>
    <div class="row gx-3 gy-2 align-items-center">
        <div class="col-3">
            <img class='img-fluid rounded bg-light' style="min-height: 5vh;" id="default-og-image" src={API_URL + seo.DEFAULT_OG_IMAGE} alt={seo.DEFAULT_OG_TITLE} />
        </div>
        <div class="col-auto">
            <label for="seo-default-OG-image">Upload an image</label>
            <input type="file" class="form-control" id="seo-default-OG-image" on:change={(e) => onSelectAnImageOg(e)}/>
        </div>
    </div>
    {#if messageUploadImage}
        <Message color="danger">{messageUploadImage}</Message>
    {/if}
    <div class="row mt-3 gx-3 gy-2">
        <div class="col">
            <label for="seo-default-title">Balise title</label>
            <input type="text" class="form-control" id="seo-default-title" bind:value={seo.DEFAULT_TITLE}/>
        </div>
        <div class="col">
            <label for="seo-default-description">Balise META Description</label>
            <textarea type="text" class="form-control" id="seo-default-description" bind:value={seo.DEFAULT_DESCRIPTION}/>
        </div>
    </div>
    <div class="row mt-3 gx-3 gy-2">
        <div class="col">
            <label for="seo-default-og-title">Balise OG Title (par défaut)</label>
            <input type="text" class="form-control" id="seo-default-og-title" bind:value={seo.DEFAULT_OG_TITLE}/>
        </div>
        <div class="col">
            <label for="seo-default-og-description">Balise OG Description (par défaut)</label>
            <textarea type="text" class="form-control" id="seo-default-og-description" bind:value={seo.DEFAULT_OG_DESCRIPTION}/>
        </div>
    </div>
</div>