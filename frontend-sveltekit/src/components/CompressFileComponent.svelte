<script>

    import EditButton from "./EditButton.svelte";
    import config from '../config.json';
    import { uploadCompress } from "../actions/compressActions";
    import { Modal, Icon, ModalBody, ModalHeader, ModalFooter } from "sveltestrap";

    const API_URL = config.SVELTE_ENV === 'dev' ? config.API_URL_DEV : config.SVELTE_ENV === 'preprod' ? config.API_URL_PREPROD : config.SVELTE_ENV === 'production' ? config.API_URL_PROD : config.API_URL_DEV;

    export let values=[];
    export let styles=[];
    export let admin='false';
    export let edit='false';
    export let updateContent;

    const toggle = async() => {
        if (edit && updateContent) {
            await updateContent();
        }
        edit = !edit;
    };

    const onChangeHandler = async(index, e) => {
        const data = new FormData();

        data.append('compress', e.target.files[0]);

        const fileCompressToReplace = values[index].url;
        
        const result = await uploadCompress(data, fileCompressToReplace);

        if (result.status === 'Ok') {
            values[index].url = result.data;
            values = values;
            await updateContent();
        } else {
            console.log('error', result.data);
        }
    };

    // Build the first component
    $:{
        if (values && values.length === 0) {
            values.push({caption: '',substitution: '',url: ''});
        }
        if (!styles) styles = [];
        if (!values) values = [];
    };

    $:{
        if (!styles.length) {
            styles = [];
        }
    };

    const downloadHandler = () => {

        const filePath = values[0].url;
        const link = document.createElement('a');
        link.href = API_URL + '/' + filePath;
        link.download = filePath.substr(filePath.lastIndexOf('/') + 1);
        link.click();
    };

    const updateStyle = ({name, value}) => {
        const curentStyleItem = styles.filter(x => x.name === name);
        if (curentStyleItem.length) {
            for (let index = 0; index < styles.length; index++) {
                if (styles[index].name === name) {
                    styles[index].value = value;
                }
            }
        } else {
            styles = [...styles, {name, value}];
        }
        styles = styles;
    };


    const colors = ['primary', 'secondary', 'pomme', 'outremer', 'lavande', 'caraibe', 'tangerine', 'ambre', 'light', 'white', 'dark', 'black'];

    $: btnColor = styles.filter(x => x.name === 'btn-color')[0] && styles.filter(x => x.name === 'btn-color')[0].value || 'btn-light';
    $: textAlign = styles.filter(x => x.name === 'text-align')[0] && styles.filter(x => x.name === 'text-align')[0].value;


    
</script>

<style>
    .content-container{
        position: relative;
    }
    .middle {
        transition: .5s ease;
        opacity: 0.7;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        -ms-transform: translate(-50%, -50%);
        text-align: center;
    }
    .content-container:hover .middle {
        opacity: 1;
    }
</style>

<Modal isOpen={edit} {toggle} size='lg' scrollable>
    <ModalHeader {toggle}>Ajouter un contenu</ModalHeader>
    <ModalBody>
        <div class='row'>
            <div class='col'>
                <div class="mb-3">
                    <label for="formFile" class="form-label">Importer un fichier compressé (.zip .7z .tar)</label>
                    <input class="form-control" type="file" id="formFile" on:change={(e) => onChangeHandler (0, e)} >
                </div>
                <div class='row py-1'><div class='col'>
                    <p>Couleur du bouton de téléchargement</p>
                    {#each colors as color}
                        <btn class='px-1 btn btn-light' on:click={() => updateStyle({name:'btn-color', value:`btn-${color}`})}><Icon name='fonts' class={`text-${color}`} /></btn>
                    {/each}
                </div></div>
                <div class='row py-1'><div class='col'>
                    <p>Aligne du boutton</p>
                    <button class={`px-1 btn ${textAlign === "start" ? "btn-primary" : "btn-light"}`} on:click={() => updateStyle({name:'text-align', value:'start'})}><Icon name='text-left' /></button>
                    <button class={`px-1 btn ${textAlign === "center" ? "btn-primary" : "btn-light"}`} on:click={() => updateStyle({name:'text-align', value:'center'})}><Icon name='text-center' /></button>
                    <button class={`px-1 btn ${textAlign === "end" ? "btn-primary" : "btn-light"}`} on:click={() => updateStyle({name:'text-align', value:'end'})}><Icon name='text-right' /></button>
                </div></div>
            </div>
        </div>
        <p class='my-3'><strong>Prévisualisation</strong></p>
        <div class='row'>
            <div class='col' style={`text-align: ${textAlign};`}>
                <button class={`btn ${btnColor}`} on:click={downloadHandler}>Télécharger</button>
            </div>
        </div>
    </ModalBody>
    <ModalFooter>
        <button class="btn btn-primary" on:click={toggle}>Enregistrer</button>
        <button class="btn btn-secondary" on:click={toggle}>Cancel</button>
    </ModalFooter>
</Modal>

<div class='content-container'>
    <div class='row'>
            {#if values[0] && values[0].url}
                <div class='col' style={`text-align: ${textAlign};`}>
                    <button class={`btn ${btnColor}`} on:click={downloadHandler}>Télécharger</button>
                </div>
            {/if}
    </div>

    {#if admin}
        <div class='middle'>
            <EditButton
                admin={admin}
                updateContent={updateContent}
                bind:edit={edit}
            />
        </div>
    {/if}
</div>