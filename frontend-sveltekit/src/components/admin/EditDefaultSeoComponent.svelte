<script>
    import { getSeo, updateOrCreateSeo } from '../../actions/seoActions';
    import { onMount } from 'svelte';
    import config from '../../config.json';
    import Message from '../Message.svelte';
    import Loading from '../Loading.svelte';
    import { uploadFile } from '../../actions/uploadActions';
    import { imagesFormats } from '../../constants/files';
    
    const API_URL = config.API_URL;

    let messageUploadImage = "";
    let loadingUpdateSeo = false;
    let messageUpdateSeo = "";
    let loadingImage = false;

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
        loadingImage = true;
        const file = e.target.files[0];
        const fileName = Date.now() + '_' + file.name;
        
        const res = await uploadFile(file, fileName, seo.DEFAULT_OG_IMAGE, imagesFormats);

        if (res.map(x => x.status).find(y => y === 'Error')) {
            messageUploadImage = res
            .filter(x => x.status === 'Error')
            .map(x => x.data)
            .join(', ');
        } else {
            messageUploadImage = null;
            seo.DEFAULT_OG_IMAGE = `/uploads/${fileName}`;
            seo = seo;
            updateOrCreateHandler();
        }
        loadingImage = false;
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
            {#if loadingImage}
                <Loading />
            {:else}
                <img class='img-fluid rounded bg-light' style="min-height: 5vh;" id="default-og-image" src={API_URL + seo.DEFAULT_OG_IMAGE} alt={seo.DEFAULT_OG_TITLE} />
            {/if}
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