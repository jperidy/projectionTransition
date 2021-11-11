<script>
  import { getSeo, updateOrCreateSeo } from "../../actions/seoActions";

  import { uploadImage } from "../../actions/imagesActions";
  import config from '../../config.json';
  import Message from "../Message.svelte";
  import { onMount } from "svelte";
  const API_URL = config.SVELTE_ENV === 'dev' ? config.API_URL_DEV : config.SVELTE_ENV === 'preprod' ? config.API_URL_PREPROD : config.SVELTE_ENV === 'production' ? config.API_URL_PROD : config.API_URL_DEV;

    let messageUpdateFavicon;

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

    // Manage Favicon
    const onSelectAnImageFavicon = async(e, name) => {
        const data = new FormData();
        data.append('file', e.target.files[0]);
        const result = await uploadImage(data, seo[name]);
        if (result.status === 'Ok') {
            seo[name] = result.data;
            seo = seo;
            messageUpdateFavicon = '';
            updateOrCreateSeo(seo)
            .then((result) => seo = result.seo)
            .catch((error) => messageUpdateSeo = error);
        } else {
            messageUpdateFavicon = result.data;
        }
    };

</script>

<div class="px-5 py-3">
{#if messageUpdateFavicon}
  <Message color='danger'>{messageUpdateFavicon}</Message>
{/if}

  <div class="row">
    <h3 class="border-bottom mb-3 pb-2">Favicon</h3>
    <div class="col text-center">
      <label class="mb-2" for="FAVICON_48_48">FAVICON_48_48</label>
      <input type="file" class="form-control" id="FAVICON_48_48" on:change={(e) => onSelectAnImageFavicon(e, "FAVICON_48_48")}/>
      <img class="img-fluid mt-3" src={API_URL + seo.FAVICON_48_48} alt="FAVICON_48_48" />
    </div>
    <div class="col text-center">
      <label class="mb-2" for="FAVICON_64_64">FAVICON_64_64</label>
      <input type="file" class="form-control" id="FAVICON_64_64" on:change={(e) => onSelectAnImageFavicon(e, "FAVICON_64_64")}/>
      <img class="img-fluid mt-3" src={API_URL + seo.FAVICON_64_64} alt="FAVICON_64_64" />
    </div>
    <div class="col text-center">
      <label class="mb-2" for="FAVICON_96_96">FAVICON_96_96</label>
      <input type="file" class="form-control" id="FAVICON_96_96" on:change={(e) => onSelectAnImageFavicon(e, "FAVICON_96_96")}/>
      <img class="img-fluid mt-3" src={API_URL + seo.FAVICON_96_96} alt="FAVICON_96_96" />
    </div>
    <div class="col text-center">
      <label class="mb-2" for="FAVICON_128_128">FAVICON_128_128</label>
      <input type="file" class="form-control" id="FAVICON_128_128" on:change={(e) => onSelectAnImageFavicon(e, "FAVICON_128_128")}/>
      <img class="img-fluid mt-3" src={API_URL + seo.FAVICON_128_128} alt="FAVICON_128_128" />
    </div>
    <div class="col text-center">
      <label class="mb-2" for="FAVICON_196_196">FAVICON_196_196</label>
      <input type="file" class="form-control" id="FAVICON_196_196" on:change={(e) => onSelectAnImageFavicon(e, "FAVICON_196_196")}/>
      <img class="img-fluid mt-3" src={API_URL + seo.FAVICON_196_196} alt="FAVICON_196_196" />
    </div>
  </div>
</div>