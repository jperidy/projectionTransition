<script>
    import { uploadVideo } from "../../actions/videosActions";
    import { Icon } from "sveltestrap";
    import { updateStyle } from "../../utils/styleFunctions";

    export let values;
    export let styles;

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
        const data = new FormData();

        data.append('video', e.target.files[0]);

        const videoToReplace = values[index].url;
        
        const result = await uploadVideo(data, videoToReplace);

        if (result.status === 'Ok') {
            values[index].url = result.data;
            values = values;
        } else {
            console.log('error', result.data);
        }
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
</div>
<div class="row mt-3">
    <div class="col d-flex align-items-center justify-content-center">
        <button class='px-2 btn btn-light border rounded' on:click={() => styles = updateStyle(styles, {name:'text-align', value:'margin-right: auto;'})}><Icon name='text-left' /></button>
        <button class='px-2 btn btn-light border rounded' on:click={() => styles = updateStyle(styles, {name:'text-align', value:'margin-left: auto;margin-right: auto'})}><Icon name='text-center' /></button>
        <button class='px-2 btn btn-light border rounded' on:click={() => styles = updateStyle(styles, {name:'text-align', value:'margin-left: auto'})}><Icon name='text-right' /></button>
        <label class="mx-1" for='select-size'>Size (px): </label>
        <input class="form-control" type="number" min={0} value={size.split("px").length > 0 ? size.split("px")[0] : 500} on:change={(e) => styles = updateStyle(styles, {name:'maxWidth', value:`${e.target.value}px`})} />
    </div>
</div>
