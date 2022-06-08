<script>
    import { uploadImage } from "../../actions/imagesActions";
    import { uploadFile } from "../../actions/uploadActions";
    import Message from "../Message.svelte";
    import config from '../../config.json';
import Loading from "../Loading.svelte";
    const API_URL = config.API_URL;

    export let navBar;

    let messageUploadImage = "";
    let loadingImage = false;
    

    const onSelectAnImageBrand = async(e) => {
      loadingImage = true;
      const file = e.target.files[0];
      const fileName = Date.now() + '_' + file.name;
      const res = await uploadFile(file, fileName, navBar.BRAND.LOGO.path);

      if (res.map(x => x.status).find(y => y === 'Error')) {
        messageUploadImage = res
          .filter(x => x.status === 'Error')
          .map(x => x.data)
          .join(', ');
      }
      navBar.BRAND.LOGO.path = `/uploads/${fileName}`;
      navBar = navBar;
      loadingImage = false;

      // const data = new FormData();
      // data.append('file', e.target.files[0]);
      // const result = await uploadImage(data, navBar.BRAND.LOGO.path);
      // if (result.status === 'Ok') {
      //     navBar.BRAND.LOGO.path = result.data;
      //     navBar = navBar;
      //     messageUploadImage = '';
      // } else {
      //     messageUploadImage = result.data;
      // }
    };

</script>
<h3 class="border-bottom mb-3 pb-2">Brand</h3>

{#if messageUploadImage}
    <Message color='danger'>{messageUploadImage}</Message>
{/if}
<div class="row">
  <div class="col-3">
    {#if loadingImage}
      <Loading />
    {:else}
      <img src={navBar.BRAND.LOGO.path ? API_URL + navBar.BRAND.LOGO.path : ''} alt={navBar.BRAND.LOGO.alt} class="img-fluid rounded" />
    {/if}
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