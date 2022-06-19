<script>
    export let values;
    export let styles;
    export let selectedComponentPosition;

    import { updateStyle, watchStyle } from '../../utils/styleFunctions'; 
    import AddElement from '../AddElement.svelte';
    import Message from '../Message.svelte';
    import Loading from '../Loading.svelte';
    import { uploadFile } from '../../actions/uploadActions';
    import { imagesFormats } from '../../constants/files';
    import EditLayoutComponentChildren from './EditLayoutComponentChildren.svelte';
import DropDown from './DropDown.svelte';
    
    let positionToCreate = 0;

    let loadingImage = false;
    let messageUploadImage = null;

    const modalId = 'editLayoutComponentModal' + crypto.randomUUID();

    const addToLayout = (column, position) => {
        values[position].values[0] = column;
        values = values;
    };

    const columnChangeHandler = (number) => {
        if (number > values.length && number >=1) {
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
    };

    const onChangeFileHandler = async(index, e) => {
        loadingImage = true;
        const file = e.target.files[0];
        const fileName = Date.now() + '_' + file.name;
        
        const res = await uploadFile(file, fileName, backgroundImage, imagesFormats);

        if (res.map(x => x.status).find(y => y === 'Error')) {
            messageUploadImage = res
                .filter(x => x.status === 'Error')
                .map(x => x.data)
                .join(', ');
        } else {
            styles = updateStyle(styles, { name:'backgroundImage', value: `/uploads/${fileName}` });
            messageUploadImage = null;            
        }
        loadingImage = false;
    };

    const colors = ['primary', 'secondary', 'pomme', 'outremer', 'lavande', 'caraibe', 'tangerine', 'ambre', 'light', 'white', 'dark', 'black'];

    $: xsSize = watchStyle(styles, 'xsSize', 12);
    $: smSize = watchStyle(styles, 'smSize', 12);
    $: mdSize = watchStyle(styles, 'mdSize', 12);
    $: lgSize = watchStyle(styles, 'lgSize', 10);
    $: xlSize = watchStyle(styles, 'xlSize', 10);
    
    $: alignContent = watchStyle(styles, 'align-items', 'start');
    $: backgroundHTML = watchStyle(styles, 'backgroundHTML', '');
    $: backgroundImage = watchStyle(styles, 'backgroundImage', '');
    
    $: marginX = watchStyle(styles, 'marginX', 0);
    $: marginY = watchStyle(styles, 'marginY', 0);
    $: paddingX = watchStyle(styles, 'paddingX', 1);
    $: paddingY = watchStyle(styles, 'paddingY', 1);
    $: rounded = watchStyle(styles, 'rounded', 0);
    
    $: gutterX = watchStyle(styles, 'gutterX', 2);
    $: gutterY = watchStyle(styles, 'gutterY', 2);
    
    $: border = watchStyle(styles, 'border', 'btn-primary');
    
</script>

<div class="row align-items-center d-block">
    <DropDown
        title="Size"
    >
        <div class="d-flex align-items-center my-1">
            <label for="xs-size" class="w-100">On Mobile</label>
            <input 
                type="number" 
                class="form-control" 
                id="xs-size" 
                min={1} 
                max={12} 
                value={xsSize} 
                on:change={(e) => styles = updateStyle(styles, {name:'xsSize', value:e.target.value})}
            />
        </div>
        <div class="d-flex align-items-center my-1">
            <label for="sm-size" class="w-100">On small tablet</label>
            <input 
                type="number" 
                class="form-control" 
                id="sm-size" 
                min={1} 
                max={12} 
                value={smSize} 
                on:change={(e) => styles = updateStyle(styles, {name:'smSize', value:e.target.value})}
            />
        </div>
        <div class="d-flex align-items-center my-1">
            <label for="md-size" class="w-100">On large tablet</label>
            <input 
                type="number" 
                class="form-control" 
                id="md-size" 
                min={1} 
                max={12} 
                value={mdSize} 
                on:change={(e) => styles = updateStyle(styles, {name:'mdSize', value:e.target.value})}
            />
        </div>
        <div class="d-flex align-items-center my-1">
            <label for="lg-size" class="w-100">On regular desktop</label>
            <input 
                type="number" 
                class="form-control" 
                id="lg-size" 
                min={1} 
                max={12} 
                value={lgSize} 
                on:change={(e) => styles = updateStyle(styles, {name:'lgSize', value:e.target.value})}
            />
        </div>
        <div class="d-flex align-items-center my-1">
            <label for="xl-size" class="w-100">On large desktop</label>
            <input 
                type="number" 
                class="form-control" 
                id="xl-size" 
                min={1} 
                max={12} 
                value={xlSize} 
                on:change={(e) => styles = updateStyle(styles, {name:'xlSize', value:e.target.value})}
            />
        </div>
    </DropDown>

    <DropDown
        title="Align"
    >
        <div class='row p-3 align-items-center'>
            <div class="col-3">Align: </div>
            <div class="col-9">
                <button class={`px-2 btn ${alignContent === "start" ? "btn-selected" : "btn-light"}`} on:click={() => styles = updateStyle(styles, {name:'align-items', value:'start'})}><i class='bi bi-align-top' /></button>
                <button class={`px-2 btn ${alignContent === "center" ? "btn-selected" : "btn-light"}`} on:click={() => styles = updateStyle(styles, {name:'align-items', value:'center'})}><i class='bi bi-align-middle' /></button>
                <button class={`px-2 btn ${alignContent === "end" ? "btn-selected" : "btn-light"}`} on:click={() => styles = updateStyle(styles, {name:'align-items', value:'end'})}><i class='bi bi-align-bottom' /></button>
            </div>
        </div>
    </DropDown>
    
    <DropDown
        title="Border"
    >
        <div class='col p-3'>
            <div class='my-1 row align-items-center'>
                <div class="col-2">Color: </div>
                <div class='col-10 d-flex'>
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
            </div>
            <div class='my-1 row align-items-center'>
                <div class="col-2">Rounded: </div>
                <div class="col-10">
                    <button class={`btn px-2 rounded-0 ${rounded === "rounded-0" ? "btn-selected" : "btn-light"}`} on:click={() => styles = updateStyle(styles, {name:'rounded', value:'rounded-0'})}><span>r-0</span></button>
                    <button class={`btn px-2 rounded-1 ${rounded === "rounded-1" ? "btn-selected" : "btn-light"}`} on:click={() => styles = updateStyle(styles, {name:'rounded', value:'rounded-1'})}><span>r-1</span></button>
                    <button class={`btn px-2 rounded-2 ${rounded === "rounded-2" ? "btn-selected" : "btn-light"}`} on:click={() => styles = updateStyle(styles, {name:'rounded', value:'rounded-2'})}><span>r-2</span></button>
                    <button class={`btn px-2 rounded-3 ${rounded === "rounded-3" ? "btn-selected" : "btn-light"}`} on:click={() => styles = updateStyle(styles, {name:'rounded', value:'rounded-3'})}><span>r-3</span></button>
                </div>
            </div>
        </div>
    </DropDown>
    
    <DropDown
        title="Background"
    >
        <div class='d-flex row gx-3 p-3 align-items-end'>
            <div class='col-6 d-block'>
                <label for="backgroud-color">Color from template</label>
                <select name="backgroud-color" id="backgroud-color" class="form-control" on:change={(e) => styles = updateStyle(styles, {name:'backgroud-color', value:`bg-${e.target.value}`})}>
                    <option value="transparent">Background Transparent (default)</option>
                    {#each colors as color}
                        <option value={color}>{color}</option>
                    {/each}
                </select>
            </div>
            <div class="col-6 d-block">
                <label for="color-html">Color from HTML</label>
                <input class='form-control' id="color-html" type='text' placeholder="#FFFFFF" value={backgroundHTML} on:change={(e) => styles = updateStyle(styles, {name:'backgroundHTML', value:e.target.value})} />
            </div>
            <div class="my-1">
                <div class="col">
                    <span>Background image : </span>
                    <input type="file" class="form-control" on:change={(e) => onChangeFileHandler(0, e)}/>
                    {#if messageUploadImage}
                        <Message color='danger'>{messageUploadImage}</Message>
                    {/if}
                    {#if loadingImage}
                        <Loading />
                    {/if}
                </div>
            </div>
        </div>
    </DropDown>

    <DropDown
        title="Margin (out), Padding (in), gutter (spaces)"
    >
        <div class='p-3'>
            <div class="row my-1">
                <div class='col d-flex align-items-center'>
                    <span class="w-100">Margin X: </span>
                    <input type='number' step={1} min={0} class='form-control' value={marginX} on:change={(e) => styles = updateStyle(styles, {name:'marginX', value:e.target.value})} />
                </div>
                <div class='col d-flex align-items-center'>
                    <span class="w-100">Margin Y: </span>
                    <input type='number' step={1} min={0} class='form-control' value={marginY} on:change={(e) => styles = updateStyle(styles, {name:'marginY', value:e.target.value})} />
                </div>
            </div>
            <div class="row my-1">
                <div class='col d-flex align-items-center'>
                    <span class="w-100">Padding X: </span>
                    <input type='number' step={1} min={0} class='form-control' value={paddingX} on:change={(e) => styles = updateStyle(styles, {name:'paddingX', value:e.target.value})} />
                </div>
                <div class='col d-flex align-items-center'>
                    <span class="w-100">Padding Y: </span>
                    <input type='number' step={1} min={0} class='form-control' value={paddingY} on:change={(e) => styles = updateStyle(styles, {name:'paddingY', value:e.target.value})} />
                </div>
            </div>
            <div class="row my-1">
                <div class='col d-flex align-items-center'>
                    <span class="w-100">Gutter X: </span>
                    <input type='number' step={1} min={0} max={5} class='form-control' value={gutterX} on:change={(e) => styles = updateStyle(styles, {name:'gutterX', value:e.target.value})} />
                </div>
                <div class='col d-flex align-items-center'>
                    <span class="w-100">Gutter Y: </span>
                    <input type='number' step={1} min={0} max={5} class='form-control' value={gutterY} on:change={(e) => styles = updateStyle(styles, {name:'gutterY', value:e.target.value})} />
                </div>
            </div>
        </div>
    </DropDown>
    
    <DropDown
        title="Number of columns"
    >
        <div class='p-3 d-flex align-items-center'>
            <label for="input-columns" class="form-label w-100"><strong>Number of column in the frame</strong></label>
            <input type="number" class="form-control" id="input-columns" 
                aria-describedby="nombre de colonnes" 
                placeholder="Nombre de colonnes"
                min={1}
                required
                value={values.length}
                on:change={(e) => columnChangeHandler(e.target.value)}
            />
        </div>
    </DropDown>
    
    
    <div class="mt-1 d-block">
        {#each values as component, index}
            <EditLayoutComponentChildren 
                bind:values={values}
                bind:component={component}
                bind:selectedComponentPosition={selectedComponentPosition}
                bind:positionToCreate={positionToCreate}
                index={index}
                modalId={modalId}
            />
        {/each}
    </div>    
</div>

<AddElement
    position={positionToCreate}
    action={addToLayout}
    modalId={modalId}
/>

<style>
    .btn-selected {
        background-color: rgb(190, 190, 190);
        border: 2px solid rgb(88, 88, 88);
    }
</style>