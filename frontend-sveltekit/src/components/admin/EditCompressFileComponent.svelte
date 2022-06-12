<script>
    import { uploadFile } from "../../actions/uploadActions";
    import { filesFormats } from "../../constants/files";
    import { updateStyle } from "../../utils/styleFunctions";
import Loading from "../Loading.svelte";
import Message from "../Message.svelte";

    export let values;
    export let styles;

    let loadingFile = null;
    let messageUploadFile = null;

    const colors = ['primary', 'secondary', 'pomme', 'outremer', 'lavande', 'caraibe', 'tangerine', 'ambre', 'light', 'white', 'dark', 'black'];

    $: btnColor = styles.filter(x => x.name === 'btn-color')[0] && styles.filter(x => x.name === 'btn-color')[0].value || 'btn-light';
    $: textAlign = styles.filter(x => x.name === 'text-align')[0] && styles.filter(x => x.name === 'text-align')[0].value;

    
    const onChangeHandler = async(index, e) => {
        loadingFile = true;
        const file = e.target.files[0];
        const fileName = Date.now() + '_' + file.name;

        const result = await uploadFile(file, fileName, values[index].url, filesFormats);
      
        if (result.map(x => x.status).find(y => y === 'Error')) {
            messageUploadFile = result
                .filter(x => x.status === 'Error')
                .map(x => x.data)
                .join(', ');
        } else {
            messageUploadFile = null;
            values[index].url = result.data;
            values = values;
        }
        loadingFile = false;
    };

</script>

<div class='row'>
    <div class='col'>
        <div class="mb-3">
            {#if messageUploadFile}
                <Message color='danger'>{messageUploadFile}</Message>
            {/if}
            <label for="formFile" class="form-label">Select compress file to upload (.zip .7z .tar)</label>
            {#if loadingFile}
                <Loading />
            {/if}
            <input class="form-control" type="file" id="formFile" on:change={(e) => onChangeHandler (0, e)} >
        </div>
        <div class='row py-1'>
            <p>Styles</p>
            <div class='col d-flex align-items-center'>
                <button class={`px-1 btn btn-ligth border rounded ${textAlign === "start" ? "btn-primary" : "btn-light"}`} on:click={() => styles = updateStyle(styles, {name:'text-align', value:'start'})}><i class='bi bi-text-left' /></button>
                <button class={`px-1 btn btn-ligth border rounded ${textAlign === "center" ? "btn-primary" : "btn-light"}`} on:click={() => styles = updateStyle(styles, {name:'text-align', value:'center'})}><i class='bi bi-text-center' /></button>
                <button class={`px-1 btn btn-ligth border rounded ${textAlign === "end" ? "btn-primary" : "btn-light"}`} on:click={() => styles = updateStyle(styles, {name:'text-align', value:'end'})}><i class='bi bi-text-right' /></button>
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