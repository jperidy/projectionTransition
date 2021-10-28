<script>
    import { uploadImage } from 'src/actions/imagesActions';

    export let seo;
    export let updateOrCreateSeo;

    import config from '../config.json';
    import Message from './Message.svelte';
    const API_URL = config.SVELTE_ENV === 'dev' ? config.API_URL_DEV : config.SVELTE_ENV === 'preprod' ? config.API_URL_PREPROD : config.SVELTE_ENV === 'production' ? config.API_URL_PROD : config.API_URL_DEV;

    let messageUploadImage = "";

    // Manage OG
    const onSelectAnImageOg = async(e) => {
        const data = new FormData();
        data.append('file', e.target.files[0]);
        const result = await uploadImage(data, seo.DEFAULT_OG_IMAGE);
        if (result.status === 'Ok') {
            seo.DEFAULT_OG_IMAGE = result.data;
            seo = seo;
            messageUploadImage = '';
            updateOrCreateSeo(seo)
            .then((result) => seo = result.seo)
            .catch((error) => messageUpdateSeo = error);
        } else {
            messageUploadImage = result.data;
        }
    };

</script>

{#if messageUploadImage}
    <Message color="danger">{messageUploadImage}</Message>
{/if}

<h3>Configuration du SEO</h3>
<div class="row">
    <div class="col-3">
        <img class='img-fluid' src={API_URL + seo.DEFAULT_OG_IMAGE} alt={seo.DEFAULT_OG_TITLE} />
    </div>
    <div class="col-auto">
        <label for="seo-default-OG-image"></label>
        <input type="file" class="form-control" id="seo-default-OG-image" on:change={(e) => onSelectAnImageOg(e)}/>
    </div>
</div>
<div class="row">
    <div class="col">
        <label for="seo-default-title">Balise title</label>
        <input type="text" class="form-control" id="seo-default-title" bind:value={seo.DEFAULT_TITLE}/>
    </div>
    <div class="col">
      <label for="seo-default-description">Balise META Description</label>
      <input type="text" class="form-control" id="seo-default-description" bind:value={seo.DEFAULT_DESCRIPTION}/>
    </div>
</div>
<div class="row">
    <div class="col">
      <label for="seo-default-og-title">Balise OG Title (par défaut)</label>
      <input type="text" class="form-control" id="seo-default-og-title" bind:value={seo.DEFAULT_OG_TITLE}/>
    </div>
    <div class="col">
      <label for="seo-default-og-description">Balise OG Description (par défaut)</label>
      <input type="text" class="form-control" id="seo-default-og-description" bind:value={seo.DEFAULT_OG_DESCRIPTION}/>
    </div>
</div>
