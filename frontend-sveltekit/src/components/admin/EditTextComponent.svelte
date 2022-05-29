<script>
    import { getFonts } from "../../actions/fontsActions";

    import { onMount } from "svelte";

    import { updateStyle } from '../../utils/styleFunctions'; 

    export let values=[];
    export let styles=[];

    const colors = ['primary', 'secondary', 'pomme', 'outremer', 'lavande', 'caraibe', 'tangerine', 'ambre', 'light', 'white', 'dark', 'black'];
    let fonts = [];

    onMount(() => {
        getFonts()
            .then((result) => fonts = result.fonts)
            .catch((error) => fonts = []);
    })

    $: textAlign = styles.filter(x => x.name === 'text-align')[0] && styles.filter(x => x.name === 'text-align')[0].value;
    $: textColor = styles.filter(x => x.name === 'text-color')[0] && styles.filter(x => x.name === 'text-color')[0].value;
    $: bgColor = styles.filter(x => x.name === 'backgroud-color')[0] && styles.filter(x => x.name === 'backgroud-color')[0].value;
    $: bgPrimaryText = styles.filter(x => x.name === 'bgPrimaryText')[0] && styles.filter(x => x.name === 'bgPrimaryText')[0].value;
    $: fontWeight = styles.filter(x => x.name === 'font-weight')[0] && styles.filter(x => x.name === 'font-weight')[0].value;
    $: fontStyle = styles.filter(x => x.name === 'font-style')[0] && styles.filter(x => x.name === 'font-style')[0].value;
    $: fontFamily = styles.filter(x => x.name === 'fontFamily')[0] && styles.filter(x => x.name === 'fontFamily')[0].value || "";
    $: fontSize = styles.filter(x => x.name === 'fontSize')[0] && styles.filter(x => x.name === 'fontSize')[0].value || "";
    
    //$: console.log('bgColor', bgColor);

    $: marginL = styles.filter(x => x.name === 'marginL')[0] && styles.filter(x => x.name === 'marginL')[0].value || 0;
    $: marginR = styles.filter(x => x.name === 'marginR')[0] && styles.filter(x => x.name === 'marginR')[0].value || 0;
    $: marginT = styles.filter(x => x.name === 'marginT')[0] && styles.filter(x => x.name === 'marginT')[0].value || 0;
    $: marginB = styles.filter(x => x.name === 'marginB')[0] && styles.filter(x => x.name === 'marginB')[0].value || 0;

    $: paddingL = styles.filter(x => x.name === 'paddingL')[0] && styles.filter(x => x.name === 'paddingL')[0].value || 0;
    $: paddingR = styles.filter(x => x.name === 'paddingR')[0] && styles.filter(x => x.name === 'paddingR')[0].value || 0;
    $: paddingT = styles.filter(x => x.name === 'paddingT')[0] && styles.filter(x => x.name === 'paddingT')[0].value || 0;
    $: paddingB = styles.filter(x => x.name === 'paddingB')[0] && styles.filter(x => x.name === 'paddingB')[0].value || 0;

    $: rounded = styles.filter(x => x.name === 'rounded')[0] && styles.filter(x => x.name === 'rounded')[0].value;

    $: transformR = styles.filter(x => x.name === 'transformR')[0] ? styles.filter(x => x.name === 'transformR')[0].value : 0;

</script>


<div class='row py-1'>
    <div class='col'>
        <button class={`px-2 border btn ${textAlign === "start" ? "btn-primary border border-secondary" : "btn-light"}`} on:click={() => styles = updateStyle(styles, {name:'text-align', value:'start'})}><i class='bi bi-text-left' /></button>
        <button class={`px-2 border btn ${textAlign === "center" ? "btn-primary border border-secondary" : "btn-light"}`} on:click={() => styles = updateStyle(styles, {name:'text-align', value:'center'})}><i class='bi bi-text-center' /></button>
        <button class={`px-2 border btn ${textAlign === "justify" ? "btn-primary border border-secondary" : "btn-light"}`} on:click={() => styles = updateStyle(styles, {name:'text-align', value:'justify'})}><i class='bi bi-justify-left' /></button>
        <button class={`px-2 border btn ${textAlign === "end" ? "btn-primary border border-secondary" : "btn-light"}`} on:click={() => styles = updateStyle(styles, {name:'text-align', value:'end'})}><i class='bi bi-text-right' /></button>
        <button class={`px-2 border btn ${fontWeight === 'normal' ? 'btn-primary' : 'btn-light' } px-1`} on:click={() => {
            styles = updateStyle(styles, {name:'font-weight', value:'normal'});
            styles = updateStyle(styles, {name:'font-style', value:'normal'})
        } }>N</button>
        <button class={`px-2 border btn ${fontWeight === 'bold' ? 'btn-primary' : 'btn-light' } px-1`} on:click={() => styles = updateStyle(styles, {name:'font-weight', value:'bold'})}><i class='bi bi-type-bold' /></button>
        <button class={`px-2 border btn ${fontStyle === 'italic' ? 'btn-primary' : 'btn-light' } px-1`} on:click={() => styles = updateStyle(styles, {name:'font-style', value:'italic'})}><i class='bi bi-type-italic' /></button>
    </div>
</div>
<div class='row py-1'>
    <div class='col'>
        <label for="text-color">Text color</label>
        <select name="text-color" id="text-color" class="form-control" on:change={(e) => styles = updateStyle(styles, {name:'text-color', value:`text-${e.target.value}`})}>
            <option value="white">Text white (default)</option>
            {#each colors as color}
                <option value={color}>{color}</option>
            {/each}
        </select>
    </div>
    <div class='col'>
        <label for="backgroud-color">Background color</label>
        <select name="backgroud-color" id="backgroud-color" class="form-control" on:change={(e) => styles = updateStyle(styles, {name:'backgroud-color', value:`bg-${e.target.value}`})}>
            <option value="transparent">Background Transparent (default)</option>
            {#each colors as color}
                <option value={color}>{color}</option>
            {/each}
        </select>
    </div>
</div>
<div class="row py-1">
    <div class="col">
        <label for="select-font">Font</label>
        <select class="form-control" id="select-font" value={fontFamily} on:change={(e) => styles = updateStyle(styles, {name: 'fontFamily', value: e.target.value})}>
            <option value="">Default</option>
            {#each fonts as font}
                <option value={font.name}>{font.name}</option>
            {/each}
        </select>
    </div>
    <div class="col">
        <label for="select-font">Size (rem) : </label>
        <input type="number" class="form-control" placeholder="Default" min={0} max={5} step={0.05} value={fontSize} on:change={(e) => styles = updateStyle(styles, {name: 'fontSize', value: e.target.value})}>
    </div>
</div>
<div class='row py-1'>
    <div class='col'>
        <p class="my-0">Highlight</p>
        <button class='btn btn-light border px-1' on:click={() => styles = updateStyle(styles, {name:'bgPrimaryText', value:true})}><span class='bg-primary'>Background</span></button>
        <button class='btn btn-light border px-1' on:click={() => styles = updateStyle(styles, {name:'bgPrimaryText', value:false})}><span class='bg-transparent'>No Background</span></button>
    </div>
</div>
<div class='row py-1'>
    <div class='col'>
        <span>Border : </span>
        <button class={`btn px-2 border rounded-0 ${rounded === "rounded-0" ? "btn-primary border border-secondary" : "btn-light"}`} on:click={() => styles = updateStyle(styles, {name:'rounded', value:'rounded-0'})}><span>r-0</span></button>
        <button class={`btn px-2 border rounded-1 ${rounded === "rounded-1" ? "btn-primary border border-secondary" : "btn-light"}`} on:click={() => styles = updateStyle(styles, {name:'rounded', value:'rounded-1'})}><span>r-1</span></button>
        <button class={`btn px-2 border rounded-2 ${rounded === "rounded-2" ? "btn-primary border border-secondary" : "btn-light"}`} on:click={() => styles = updateStyle(styles, {name:'rounded', value:'rounded-2'})}><span>r-2</span></button>
        <button class={`btn px-2 border rounded-3 ${rounded === "rounded-3" ? "btn-primary border border-secondary" : "btn-light"}`} on:click={() => styles = updateStyle(styles, {name:'rounded', value:'rounded-3'})}><span>r-3</span></button>
    </div>
</div>
<textarea 
    name='textarea' 
    id='input-textarea' 
    class='my-3 form-control' 
    rows={6}
    bind:value={values[0].value}
/>
<div class="row py-1">
    <p class='my-0'>Margin</p>
    <div class='col'>
        <span>Left : </span>
        <input type='number' step={1} min={0} class='form-control' value={marginL} on:change={(e) => styles = updateStyle(styles, {name:'marginL', value:e.target.value})} />
    </div>
    <div class='col'>
        <span>Right : </span>
        <input type='number' step={1} min={0} class='form-control' value={marginR} on:change={(e) => styles = updateStyle(styles, {name:'marginR', value:e.target.value})} />
    </div>
    <div class='col'>
        <span>Top : </span>
        <input type='number' step={1} min={0} class='form-control' value={marginT} on:change={(e) => styles = updateStyle(styles, {name:'marginT', value:e.target.value})} />
    </div>
    <div class='col'>
        <span>Bottom : </span>
        <input type='number' step={1} min={0} class='form-control' value={marginB} on:change={(e) => styles = updateStyle(styles, {name:'marginB', value:e.target.value})} />
    </div>
</div>
<div class="row py-1">
    <p class='my-0'>Padding</p>
    <div class='col'>
        <span>Left : </span>
        <input type='number' step={1} min={0} class='form-control' value={paddingL} on:change={(e) => styles = updateStyle(styles, {name:'paddingL', value:e.target.value})} />
    </div>
    <div class='col'>
        <span>Right : </span>
        <input type='number' step={1} min={0} class='form-control' value={paddingR} on:change={(e) => styles = updateStyle(styles, {name:'paddingR', value:e.target.value})} />
    </div>
    <div class='col'>
        <span>Top : </span>
        <input type='number' step={1} min={0} class='form-control' value={paddingT} on:change={(e) => styles = updateStyle(styles, {name:'paddingT', value:e.target.value})} />
    </div>
    <div class='col'>
        <span>Bottom : </span>
        <input type='number' step={1} min={0} class='form-control' value={paddingB} on:change={(e) => styles = updateStyle(styles, {name:'paddingB', value:e.target.value})} />
    </div>
</div>
<div class='row py-1 align-items-center'>
    <div class='col-4'>Rotate : </div>
    <div class='col-8'>
        <input type='number' class='px-1 form-control' value={transformR} on:change={(e) => styles = updateStyle(styles, {name:'transformR', value:e.target.value})}>
    </div>
</div>
