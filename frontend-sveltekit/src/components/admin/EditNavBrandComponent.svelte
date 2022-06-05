<script>
    import { uploadImage } from "../../actions/imagesActions";
    import Message from "../Message.svelte";
    import config from '../../config.json';
    const API_URL = config.SVELTE_ENV === 'dev' ? config.API_URL_DEV : config.SVELTE_ENV === 'preprod' ? config.API_URL_PREPROD : config.SVELTE_ENV === 'production' ? config.API_URL_PROD : config.API_URL_DEV;

    export let navBar;

    let messageUploadImage = "";

    // const uploadImageHandler = async (imgBase64) => {
    //   const imgData = imgBase64.split(',');
    //   const result = await uploadImage(imgData[1], navBar.BRAND.LOGO.path);
    //   if (result.status === 'Ok') {
    //       navBar.BRAND.LOGO.path = result.data;
    //       navBar = navBar;
    //       messageUploadImage = '';
    //   } else {
    //       messageUploadImage = result.data;
    //   }
    // };
    // Manage Brand
    const onSelectAnImageBrand = async(e) => {
      // const reader = new FileReader();
	    // reader.onload = (e) => {
		  //   uploadImageHandler(e.target.files[0]);
	    // };
	    // reader.readAsDataURL(image);
      
      
        const data = new FormData();
        data.append('file', e.target.files[0]);
        const result = await uploadImage(data, navBar.BRAND.LOGO.path);
        if (result.status === 'Ok') {
            navBar.BRAND.LOGO.path = result.data;
            navBar = navBar;
            messageUploadImage = '';
        } else {
            messageUploadImage = result.data;
        }
    };

</script>

<h3 class="border-bottom mb-3 pb-2">Brand</h3>

{#if messageUploadImage}
    <Message color='danger'>{messageUploadImage}</Message>
{/if}
<div class="row">
  <div class="col-3">
    <img src={navBar.BRAND.LOGO.path ? API_URL + navBar.BRAND.LOGO.path : ""} alt={navBar.BRAND.LOGO.alt} class="img-fluid rounded" />
  </div>
  <div class="col">
    <label for="logo-img">Upload a logo</label>
    <input type="file" name="" id="logo-img" on:change={(e) => onSelectAnImageBrand(e)}/>
  </div>
  <div class="col">
    <label for="logo-alt">Alt attribut</label>
    <input type="text" name="" id="logo-alt" class="form-control" bind:value={navBar.BRAND.LOGO.alt}/>
  </div>
</div>
<div class="row mt-3">
  <div class="col">
    <label for="logo-img">Bootstrap style : </label>
    <textarea type="text" name="" id="logo-img" class="form-control" bind:value={navBar.BRAND.LOGO.style}/>
  </div>
</div>