<script>
    import { Icon } from 'sveltestrap';

    export let values;
    export let styles;

    import { updateStyle } from '../../utils/styleFunctions'; 
    import DisplayEditMenu from './DisplayEditMenu.svelte';

    let columnNumber = 1;
    $: columnNumber = values.length;

    //$: console.log("values", values)

    const columnChangeHandler = (number) => {
        if (number > values.length && number >=1) {
            //const limit = 12
            while (values.length < number) {
                values.push({type:'layout', size: 4, sizeTablette: 4, sizeMobile: 12, values:[]});
            }
        } else {
            const limit = 0;
            while (values.length > number && values.length > limit) {
                values.pop();
            }
        }
        values = values;
        //updateContent && updateContent();
    };

    const onChangeFileHandler = async(index, e) => {
        const data = new FormData();
        data.append('file', e.target.files[0]);
        const imageToReplace = backgroundImage;
        const result = await uploadImage(data, imageToReplace);
        if (result.status === 'Ok') {
            styles = updateStyle(styles, {name:'backgroundImage', value: result.data});
        } else {
            console.log('error', result.data);
        }
    };


    const colors = ['primary', 'secondary', 'pomme', 'outremer', 'lavande', 'caraibe', 'tangerine', 'ambre', 'light', 'white', 'dark', 'black'];

    $: xsSize = styles.filter(x => x.name === 'xsSize')[0] && styles.filter(x => x.name === 'xsSize')[0].value || 12;
    $: smSize = styles.filter(x => x.name === 'smSize')[0] && styles.filter(x => x.name === 'smSize')[0].value || 12;
    $: mdSize = styles.filter(x => x.name === 'mdSize')[0] && styles.filter(x => x.name === 'mdSize')[0].value || 12;
    $: lgSize = styles.filter(x => x.name === 'lgSize')[0] && styles.filter(x => x.name === 'lgSize')[0].value || 10;
    $: xlSize = styles.filter(x => x.name === 'xlSize')[0] && styles.filter(x => x.name === 'xlSize')[0].value || 10;
    
    $: alignContent = styles.filter(x => x.name === 'align-items')[0] && styles.filter(x => x.name === 'align-items')[0].value;
    $: bgColor = styles.filter(x => x.name === 'backgroud-color')[0] && styles.filter(x => x.name === 'backgroud-color')[0].value;
    $: backgroundHTML = styles.filter(x => x.name === 'backgroundHTML')[0] && styles.filter(x => x.name === 'backgroundHTML')[0].value || '';
    $: backgroundImage = styles.filter(x => x.name === 'backgroundImage')[0] && styles.filter(x => x.name === 'backgroundImage')[0].value || '';

    $: marginX = styles.filter(x => x.name === 'marginX')[0] && styles.filter(x => x.name === 'marginX')[0].value || 0;
    $: marginY = styles.filter(x => x.name === 'marginY')[0] && styles.filter(x => x.name === 'marginY')[0].value || 0;
    $: paddingX = styles.filter(x => x.name === 'paddingX')[0] && styles.filter(x => x.name === 'paddingX')[0].value || 1;
    $: paddingY = styles.filter(x => x.name === 'paddingY')[0] && styles.filter(x => x.name === 'paddingY')[0].value || 1;
    $: rounded = styles.filter(x => x.name === 'rounded')[0] && styles.filter(x => x.name === 'rounded')[0].value || 0;
    
    $: gutterX = styles.filter(x => x.name === 'gutterX')[0] && styles.filter(x => x.name === 'gutterX')[0].value || 2;
    $: gutterY = styles.filter(x => x.name === 'gutterY')[0] && styles.filter(x => x.name === 'gutterY')[0].value || 2;

    $: border = styles.filter(x => x.name === 'border')[0] && styles.filter(x => x.name === 'border')[0].value;
    $: borderColor = styles.filter(x => x.name === 'border-color')[0] && styles.filter(x => x.name === 'border-color')[0].value;
    
</script>

<div class="row align-items-center my-2">
    <div class='row my-3'>
        <p class="my-0"><strong>Frame covering on screen (max cover is 12)</strong></p>
        <div class="d-flex justify-content-end my-1">
            <label for="xs-size" class="w-75">"xs screen (Mobile)"</label>
            <input type="number" class="form-control" id="xs-size" min={1} max={12} value={xsSize} on:change={(e) => styles = updateStyle(styles, {name:'xsSize', value:e.target.value})}/>
        </div>
        <div class="d-flex justify-content-end my-1">
            <label for="sm-size" class="w-75">"sm screen (Tablet)"</label>
            <input type="number" class="form-control" id="sm-size" min={1} max={12} value={smSize} on:change={(e) => styles = updateStyle(styles, {name:'smSize', value:e.target.value})}/>
        </div>
        <div class="d-flex justify-content-end my-1">
            <label for="md-size" class="w-75">"md screen (Tablet)"</label>
            <input type="number" class="form-control" id="md-size" min={1} max={12} value={mdSize} on:change={(e) => styles = updateStyle(styles, {name:'mdSize', value:e.target.value})}/>
        </div>
        <div class="d-flex justify-content-end my-1">
            <label for="lg-size" class="w-75">"lg screen (Desktop)"</label>
            <input type="number" class="form-control" id="lg-size" min={1} max={12} value={lgSize} on:change={(e) => styles = updateStyle(styles, {name:'lgSize', value:e.target.value})}/>
        </div>
        <div class="d-flex justify-content-end my-1">
            <label for="xl-size" class="w-75">"xl screen (Desktop) (/12)"</label>
            <input type="number" class="form-control" id="xl-size" min={1} max={12} value={xlSize} on:change={(e) => styles = updateStyle(styles, {name:'xlSize', value:e.target.value})}/>
        </div>
    </div>
    <div class='my-1'>
        <div class='col'>
            <button class={`px-2 border btn ${alignContent === "start" ? "btn-primary border border-secondary" : "btn-light"}`} on:click={() => styles = updateStyle(styles, {name:'align-items', value:'start'})}><Icon name='align-top' /></button>
            <button class={`px-2 border btn ${alignContent === "center" ? "btn-primary border border-secondary" : "btn-light"}`} on:click={() => styles = updateStyle(styles, {name:'align-items', value:'center'})}><Icon name='align-middle' /></button>
            <button class={`px-2 border btn ${alignContent === "end" ? "btn-primary border border-secondary" : "btn-light"}`} on:click={() => styles = updateStyle(styles, {name:'align-items', value:'end'})}><Icon name='align-bottom' /></button>
            <button class={`btn px-2 border rounded-0 ${rounded === "rounded-0" ? "btn-primary border border-secondary" : "btn-light"}`} on:click={() => styles = updateStyle(styles, {name:'rounded', value:'rounded-0'})}><span>r-0</span></button>
            <button class={`btn px-2 border rounded-1 ${rounded === "rounded-1" ? "btn-primary border border-secondary" : "btn-light"}`} on:click={() => styles = updateStyle(styles, {name:'rounded', value:'rounded-1'})}><span>r-1</span></button>
            <button class={`btn px-2 border rounded-2 ${rounded === "rounded-2" ? "btn-primary border border-secondary" : "btn-light"}`} on:click={() => styles = updateStyle(styles, {name:'rounded', value:'rounded-2'})}><span>r-2</span></button>
            <button class={`btn px-2 border rounded-3 ${rounded === "rounded-3" ? "btn-primary border border-secondary" : "btn-light"}`} on:click={() => styles = updateStyle(styles, {name:'rounded', value:'rounded-3'})}><span>r-3</span></button>
        </div>
    </div>
    <label for="border-color">Border color</label>
    <div class='my-1 d-flex'>
        <select name="border-color" id="border-color" class="form-control" on:change={(e) => {
            styles = updateStyle(styles, {name:'border-color', value:`border-${e.target.value}`});
            styles = updateStyle(styles, {name:'border', value:`border`});
        }}>
            {#each colors as color}
                <option value={color}>{color}</option>                         
            {/each}
        </select>
        <button class={`px-1 btn ${border ? "btn-light" : "btn-primary"} border`} on:click={() => styles = updateStyle(styles, {name:'border', value:''})}>Transparent</button>
    </div>
    <div class='my-1'>
        <div class='col-8'>
            <label for="backgroud-color">Background color</label>
            <select name="backgroud-color" id="backgroud-color" class="form-control" on:change={(e) => styles = updateStyle(styles, {name:'backgroud-color', value:`bg-${e.target.value}`})}>
                <option value="transparent">Background Transparent (default)</option>
                {#each colors as color}
                    <option value={color}>{color}</option>
                {/each}
            </select>
        </div>
        <div class="col-4">
            <label for="color-html">HTML color</label>
            <input class='form-control' id="color-html" type='text' placeholder="#FFFFFF" value={backgroundHTML} on:change={(e) => styles = updateStyle(styles, {name:'backgroundHTML', value:e.target.value})} />
        </div>
    </div>
    <div class="my-1">
        <div class="col">
            <span>Image de fond : </span>
            <input type="file" class="form-control" on:change={(e) => onChangeFileHandler(0, e)}/>
        </div>
    </div>
    <div class="row my-1">
        <div class='col'>
            <span>Margin X : </span>
            <input type='number' step={1} min={0} class='form-control' value={marginX} on:change={(e) => styles = updateStyle(styles, {name:'marginX', value:e.target.value})} />
        </div>
        <div class='col'>
            <span>Margin Y : </span>
            <input type='number' step={1} min={0} class='form-control' value={marginY} on:change={(e) => styles = updateStyle(styles, {name:'marginY', value:e.target.value})} />
        </div>
    </div>
    <div class="row my-1">
        <div class='col'>
            <span>Padding X : </span>
            <input type='number' step={1} min={0} class='form-control' value={paddingX} on:change={(e) => styles = updateStyle(styles, {name:'paddingX', value:e.target.value})} />
        </div>
        <div class='col'>
            <span>Padding Y : </span>
            <input type='number' step={1} min={0} class='form-control' value={paddingY} on:change={(e) => styles = updateStyle(styles, {name:'paddingY', value:e.target.value})} />
        </div>
    </div>
    <div class="row my-1">
        <div class='col'>
            <span>Gutter X : </span>
            <input type='number' step={1} min={0} max={5} class='form-control' value={gutterX} on:change={(e) => styles = updateStyle(styles, {name:'gutterX', value:e.target.value})} />
        </div>
        <div class='col'>
            <span>Gutter Y : </span>
            <input type='number' step={1} min={0} max={5} class='form-control' value={gutterY} on:change={(e) => styles = updateStyle(styles, {name:'gutterY', value:e.target.value})} />
        </div>
    </div>

    <div class='my-1'>
        <label for="input-columns" class="form-label"><strong>Number of column in the frame</strong></label>
        <input type="number" class="form-control" id="input-columns" 
            aria-describedby="nombre de colonnes" 
            placeholder="Nombre de colonnes"
            min={1}
            required
            value={values.length}
            on:change={(e) => columnChangeHandler(e.target.value)}
        />
    </div>
    
    <div class="mt-3 border-top">
        {#each values as component, index}
            <p>Column: {index + 1}</p>
            <p>Column width depending on screen</p>
            <div class="d-flex justify-content-end my-1">
                <label for="xs-size" class="w-75">"Mobile"</label>
                <input type="number" class="form-control" id="xs-size" min={1} max={12} bind:value={component.sizeMobile}/>
            </div>
            <div class="d-flex justify-content-end my-1">
                <label for="xs-size" class="w-75">"Tablet"</label>
                <input type="number" class="form-control" id="xs-size" min={1} max={12} bind:value={component.sizeTablette}/>
            </div>
            <div class="d-flex justify-content-end my-1">
                <label for="xs-size" class="w-75">"Desktop"</label>
                <input type="number" class="form-control" id="xs-size" min={1} max={12} bind:value={component.size}/>
            </div>
            {#if component.values.length > 0}
                <DisplayEditMenu
                    type={component.values[0].type}
                    bind:values={component.values[0].values}
                    bind:styles={component.values[0].styles}
                />
            {:else}
                <p>TODO : select type of component</p>
            {/if}
        {/each}
    </div>
    
</div>