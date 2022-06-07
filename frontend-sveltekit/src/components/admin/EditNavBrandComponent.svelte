<script>
    import { uploadImage } from "../../actions/imagesActions";
    import { upload } from "../../actions/uploadActions";
    import Message from "../Message.svelte";
    import config from '../../config.json';
    const API_URL = config.API_URL;

    export let navBar;

    let messageUploadImage = "";

    const uploadFile = async (file, fileName, fileToDelete) => {
      const fileReader = new FileReader();
      const results = [];

      return new Promise ((resolve) => {
        fileReader.readAsArrayBuffer(file);
        fileReader.onload = async (event) => {
          const content = event.target.result;
          const CHUNK_SIZE = 5000;
          const totalChunks = content.byteLength / CHUNK_SIZE;
  
          for (let chunk = 0; chunk < totalChunks + 1; chunk++) {
              let CHUNK = content.slice(chunk * CHUNK_SIZE, (chunk + 1) * CHUNK_SIZE);
              const result = await upload(fileName, CHUNK, fileToDelete);
              results.push(result);
          }
          resolve(results);
        }
      }) 
    }

    const onSelectAnImageBrand = async(e) => {
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
    <img src={navBar.BRAND.LOGO.path ? API_URL + navBar.BRAND.LOGO.path : ''} alt={navBar.BRAND.LOGO.alt} class="img-fluid rounded" />
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