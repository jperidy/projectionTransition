<script>
    import { updateStyle } from "../../utils/styleFunctions";
    import { uploadCompress } from "../../actions/compressActions";
    import { Icon } from "sveltestrap";

    export let values;
    export let styles;

    const colors = ['primary', 'secondary', 'pomme', 'outremer', 'lavande', 'caraibe', 'tangerine', 'ambre', 'light', 'white', 'dark', 'black'];

    $: btnColor = styles.filter(x => x.name === 'btn-color')[0] && styles.filter(x => x.name === 'btn-color')[0].value || 'btn-light';
    $: textAlign = styles.filter(x => x.name === 'text-align')[0] && styles.filter(x => x.name === 'text-align')[0].value;

    
    const onChangeHandler = async(index, e) => {
        const data = new FormData();

        data.append('compress', e.target.files[0]);

        const fileCompressToReplace = values[index].url;
        
        const result = await uploadCompress(data, fileCompressToReplace);

        if (result.status === 'Ok') {
            values[index].url = result.data;
            values = values;
        } else {
            console.log('error', result.data);
        }
    };

</script>

<div class='row'>
    <div class='col'>
        <div class="mb-3">
            <label for="formFile" class="form-label">Select compress file to upload (.zip .7z .tar)</label>
            <input class="form-control" type="file" id="formFile" on:change={(e) => onChangeHandler (0, e)} >
        </div>
        <div class='row py-1'>
            <p>Styles</p>
            <div class='col d-flex align-items-center'>
                <button class={`px-1 btn btn-ligth border rounded ${textAlign === "start" ? "btn-primary" : "btn-light"}`} on:click={() => styles = updateStyle(styles, {name:'text-align', value:'start'})}><Icon name='text-left' /></button>
                <button class={`px-1 btn btn-ligth border rounded ${textAlign === "center" ? "btn-primary" : "btn-light"}`} on:click={() => styles = updateStyle(styles, {name:'text-align', value:'center'})}><Icon name='text-center' /></button>
                <button class={`px-1 btn btn-ligth border rounded ${textAlign === "end" ? "btn-primary" : "btn-light"}`} on:click={() => styles = updateStyle(styles, {name:'text-align', value:'end'})}><Icon name='text-right' /></button>
                <p class='p-0 my-0 mx-2'>Color</p>
                <select class='form-control' value={btnColor.split('-').length > 0 ? btnColor.split('-')[1] : ""} on:click={(e) => styles = updateStyle(styles, {name:'btn-color', value:`btn-${e.target.value}`})}>
                    <option value="">--select--</option>
                    {#each colors as color}
                        <option value={color}>{color}</option>
                    {/each}
                </select>
            </div>
        </div>
    </div>
</div>