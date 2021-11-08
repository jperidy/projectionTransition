<script>
    import { uploadImage } from '../actions/imagesActions';

    import config from '../config.json';
    import Message from './Message.svelte';

    export let footer;
    // export let updateOrCreateFooter;

    const API_URL = config.SVELTE_ENV === 'dev' ? config.API_URL_DEV : config.SVELTE_ENV === 'preprod' ? config.API_URL_PREPROD : config.SVELTE_ENV === 'production' ? config.API_URL_PROD : config.API_URL_DEV;
    let messageUpdateBrand;

    // Manage Brand
    const onSelectAnImageBrand = async(e) => {
        const data = new FormData();
        data.append('file', e.target.files[0]);
        const result = await uploadImage(data, footer.BRAND.LOGO.path);
        if (result.status === 'Ok') {
            footer.BRAND.LOGO.path = result.data;
            footer = footer;
            messageUpdateBrand = '';
            // updateOrCreateFooter(footer)
            //     .then((result) => footer = result.footer)
            //     .catch((error) => messageUpdateBrand = error);
        } else {
            messageUpdateBrand = result.data;
        }
    };
</script>

<h3 class="border-bottom mb-3 pb-2">Brand on footer</h3>
{#if messageUpdateBrand}
    <Message color='danger'>{messageUpdateBrand}</Message>
{/if}
<div class="row align-items-center gx-3 gy-2">
    <div class="col-2">
        <img class="img-fluid rounded" src={API_URL + footer.BRAND.LOGO.path} alt={footer.BRAND.LOGO.alt}>
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