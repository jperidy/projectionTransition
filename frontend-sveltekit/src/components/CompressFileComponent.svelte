<script>

    import config from '../config.json';
    const API_URL = config.SVELTE_ENV === 'dev' ? config.API_URL_DEV : config.SVELTE_ENV === 'preprod' ? config.API_URL_PREPROD : config.SVELTE_ENV === 'production' ? config.API_URL_PROD : config.API_URL_DEV;

    export let values=[];
    export let styles=[];
    export let admin=false;admin; // to remove
    export let edit=false;edit; // to remove
    export let updateContent; updateContent; // to remove
    export let isSelected = {select: false, position:null};


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

    $: btnColor = styles.filter(x => x.name === 'btn-color')[0] && styles.filter(x => x.name === 'btn-color')[0].value || 'btn-light';
    $: textAlign = styles.filter(x => x.name === 'text-align')[0] && styles.filter(x => x.name === 'text-align')[0].value;

    const downloadHandler = () => {

        const filePath = values[0].url;
        const link = document.createElement('a');
        link.href = API_URL + '/' + filePath;
        link.download = filePath.substr(filePath.lastIndexOf('/') + 1);
        link.click();
    };
    
</script>

<div class={`content-container ${isSelected.select && "border border-3 rounded"}`}>
    <div class='row'>
        {#if values[0] && values[0].url}
            <div class='col' style={`text-align: ${textAlign};`}>
                <button class={`btn ${btnColor}`} on:click={downloadHandler}>Télécharger</button>
            </div>
        {:else}
            <div class="bg-secondary d-flex align-items-center justify-content-center text-dark" style="min-height:5vh;">Add a compress file</div>
        {/if}
    </div>
</div>