<script>
import { uploadFile } from "../../actions/uploadActions";

    import { videosFormats } from "../../constants/files";
    import { updateStyle } from "../../utils/styleFunctions";
    import Loading from "../Loading.svelte";
    import Message from "../Message.svelte";

    export let values;
    export let styles;

    let loadingVideo = false;
    let messageUploadVideo;

    $: textAlign = styles.filter(x => x.name === 'text-align')[0] && styles.filter(x => x.name === 'text-align')[0].value;
    $: size = styles.filter(x => x.name === 'maxWidth')[0] && styles.filter(x => x.name === 'maxWidth')[0].value || "normal";

    const sizeChange = (e) => {

        const size = e.target.value;

        if(size === 'small') {
            styles.filter( x => x.name === 'maxWidth')[0].value = '250px';
            styles.filter( x => x.name === 'maxWidth')[0].size = size;
        } else if(size === 'normal') {
            styles.filter( x => x.name === 'maxWidth')[0].value = '500px';
            styles.filter( x => x.name === 'maxWidth')[0].size = size;
        }else if(size === 'large') {
            styles.filter( x => x.name === 'maxWidth')[0].value = '1000px';
            styles.filter( x => x.name === 'maxWidth')[0].size = size;
        }
        styles = styles;
    };

    const onChangeHandler = async(index, e) => {
        loadingVideo = true;
        const file = e.target.files[0];
        const fileName = Date.now() + '_' + file.name;
        
        const res = await uploadFile(file, fileName, values[index].url, videosFormats);

        if (res.map(x => x.status).find(y => y === 'Error')) {
            messageUploadVideo = res
                .filter(x => x.status === 'Error')
                .map(x => x.data)
                .join(', ');
        } else {
            messageUploadVideo = null;
            values[index].url = `/uploads/${fileName}`;
            values = values;
        }
        loadingVideo = false;
    };

</script>

<div class="row align-items-center">
    <div class="col-4">
        <label for='input-text'>Youtube video url</label>
    </div>
    <div class="col-8">
        <input class="form-control" type='text' name='text' id='input-text' bind:value={values[0].url} placeholder='url'/>
    </div>
</div>
<div class="row mt-3 align-items-center">
    <div class="col-4">
        <label for='upload-video' >[option] upload the video file</label>
    </div>
    <div class="col-8">
        <input class="form-control" type='file' on:change={(e) => onChangeHandler (1, e)}/>
    </div>
    {#if messageUploadVideo}
        <Message color='danger'>{messageUploadVideo}</Message>
    {/if}
    {#if loadingVideo}
      <Loading />
    {/if}
</div>
<div class="row mt-3">
    <div class="col d-flex align-items-center justify-content-center">
        <button class='px-2 btn btn-light border rounded' on:click={() => styles = updateStyle(styles, {name:'text-align', value:'margin-right: auto;'})}><i class="bi bi-text-right"></i></button>
        <button class='px-2 btn btn-light border rounded' on:click={() => styles = updateStyle(styles, {name:'text-align', value:'margin-left: auto;margin-right: auto'})}><i class='bi bi-text-center' /></button>
        <button class='px-2 btn btn-light border rounded' on:click={() => styles = updateStyle(styles, {name:'text-align', value:'margin-left: auto'})}><i class='bi bi-text-right' /></button>
        <label class="mx-1" for='select-size'>Size (px): </label>
        <input class="form-control" type="number" min={0} value={size.split("px").length > 0 ? size.split("px")[0] : 500} on:change={(e) => styles = updateStyle(styles, {name:'maxWidth', value:`${e.target.value}px`})} />
    </div>
</div>
