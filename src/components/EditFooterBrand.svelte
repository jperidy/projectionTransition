<script>
    import { imagesFormats } from '../constants/files';

    import config from '../config.json';
    import Message from './Message.svelte';
    import Loading from './Loading.svelte';
    import { uploadFile } from '../actions/uploadActions';

    export let footer;

    const API_URL = config.API_URL;
    
    let messageUpdateBrand;
    let loadingImage = false;

    // Manage Brand
    const onSelectAnImageBrand = async(e) => {
        loadingImage = true;
        const file = e.target.files[0];
        const fileName = Date.now() + '_' + file.name;

        const { error, path } = await uploadFile(file, fileName, footer.BRAND.LOGO.path, imagesFormats);
      
        messageUpdateBrand = error;
        footer.BRAND.LOGO.path = `/uploads/${fileName}`;
        footer = footer;

        loadingImage = false;
    };
</script>

<h3 class="border-bottom mb-3 pb-2">Brand on footer</h3>
{#if messageUpdateBrand}
    <Message color='danger'>{messageUpdateBrand}</Message>
{/if}
<div class="row align-items-center gx-3 gy-2">
    <div class="col-2">
        {#if loadingImage}
            <Loading />
        {:else}
            <img class="img-fluid rounded" src={API_URL + footer.BRAND.LOGO.path} alt={footer.BRAND.LOGO.alt}>
        {/if}
    </div>
    <div class="col">
        <label for="logo-footer">Upload a file</label>
        <input type="file" id="logo-footer" class="form-control" on:change={(e) => onSelectAnImageBrand(e)}>
    </div>
    <div class="col">
        <label for="logo-footer-alt">Alt</label>
        <input type="text" id="logo-footer-alt" class="form-control" bind:value={footer.BRAND.LOGO.alt}>
    </div>
</div>
<div class="row mt-3">        
    <div class="col">
        <label for="logo-footer-style">Styles (css)</label>
        <textarea type="text" id="logo-footer-style" class="form-control" bind:value={footer.BRAND.LOGO.style} />
    </div>
    <div class="col">
        <label for="brand-footer">[option] Brand name</label>
        <input type="text" id="brand-footer" class="form-control" bind:value={footer.BRAND.NAME}>
    </div>
</div>