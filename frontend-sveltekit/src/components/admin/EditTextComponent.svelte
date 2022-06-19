<script>
    import { getFonts } from "../../actions/fontsActions";

    import { onMount } from "svelte";

    import { updateStyle, watchStyle } from '../../utils/styleFunctions'; 
import DropDown from "./DropDown.svelte";

    export let values=[];
    export let styles=[];

    const colors = ['primary', 'secondary', 'pomme', 'outremer', 'lavande', 'caraibe', 'tangerine', 'ambre', 'light', 'white', 'dark', 'black'];
    let fonts = [];

    let textColorsOpen = false;
    let bgColorsOpen = false;
    let borderRadiusOpen = false;

    let backgroundColored = false;

    onMount(() => {
        getFonts()
            .then((result) => fonts = result.fonts)
            .catch((error) => fonts = []);
    })

    $: textAlign = watchStyle(styles, 'text-align', '');
    $: textColor = watchStyle(styles, 'text-color', 'primary');
    $: bgColor = watchStyle(styles, 'backgroud-color', 'transparent');
    $: fontWeight = watchStyle(styles, 'font-weight', 'normal');
    $: fontStyle = watchStyle(styles, 'font-style', 'normal');
    $: fontFamily = watchStyle(styles, 'fontFamily', '');
    $: fontSize = watchStyle(styles, 'fontSize', '');
    $: marginL = watchStyle(styles, 'marginL', 0);
    $: marginR = watchStyle(styles, 'marginR', 0);
    $: marginT = watchStyle(styles, 'marginT', 0);
    $: marginB = watchStyle(styles, 'marginB', 0);
    $: paddingL = watchStyle(styles, 'paddingL', 0);
    $: paddingR = watchStyle(styles, 'paddingR', 0);
    $: paddingT = watchStyle(styles, 'paddingT', 0);
    $: paddingB = watchStyle(styles, 'paddingB', 0);
    $: rounded = watchStyle(styles, 'rounded', 0);
    $: transformR = watchStyle(styles, 'transformR', 0);
</script>

<DropDown title="Margin (out)">
    <div class="row">
        <div class='col-3 text-center'>
            <span>Left : </span>
            <input type='number' step={1} min={0} class='form-control' value={marginL} on:change={(e) => styles = updateStyle(styles, {name:'marginL', value:e.target.value})} />
        </div>
        <div class='col-3 text-center'>
            <span>Right : </span>
            <input type='number' step={1} min={0} class='form-control' value={marginR} on:change={(e) => styles = updateStyle(styles, {name:'marginR', value:e.target.value})} />
        </div>
        <div class='col-3 text-center'>
            <span>Top : </span>
            <input type='number' step={1} min={0} class='form-control' value={marginT} on:change={(e) => styles = updateStyle(styles, {name:'marginT', value:e.target.value})} />
        </div>
        <div class='col-3 text-center'>
            <span>Bottom : </span>
            <input type='number' step={1} min={0} class='form-control' value={marginB} on:change={(e) => styles = updateStyle(styles, {name:'marginB', value:e.target.value})} />
        </div>
    </div>
</DropDown>

<DropDown title="Padding (in)">
    <div class="row">
        <div class='col-3 text-center'>
            <span>Left : </span>
            <input type='number' step={1} min={0} class='form-control' value={paddingL} on:change={(e) => styles = updateStyle(styles, {name:'paddingL', value:e.target.value})} />
        </div>
        <div class='col-3 text-center'>
            <span>Right : </span>
            <input type='number' step={1} min={0} class='form-control' value={paddingR} on:change={(e) => styles = updateStyle(styles, {name:'paddingR', value:e.target.value})} />
        </div>
        <div class='col-3 text-center'>
            <span>Top : </span>
            <input type='number' step={1} min={0} class='form-control' value={paddingT} on:change={(e) => styles = updateStyle(styles, {name:'paddingT', value:e.target.value})} />
        </div>
        <div class='col-3 text-center'>
            <span>Bottom : </span>
            <input type='number' step={1} min={0} class='form-control' value={paddingB} on:change={(e) => styles = updateStyle(styles, {name:'paddingB', value:e.target.value})} />
        </div>
    </div>
</DropDown>

<DropDown title="Rotation">
    <div class="row align-items-center">
        <div class='col-4'>Rotate : </div>
        <div class='col-8'>
            <input type='number' class='px-1 form-control' value={transformR} on:change={(e) => styles = updateStyle(styles, {name:'transformR', value:e.target.value})}>
        </div>
    </div>
</DropDown>

<div class='row py-1'>
    <div class='col-12 d-flex justify-content-startn'>
        <div class="col d-flex align-items-center">
            <div class='w-50'>Text: </div>
            <input type="number" class="form-control" placeholder="Default" min={0} max={5} step={0.05} value={fontSize} on:change={(e) => styles = updateStyle(styles, {name: 'fontSize', value: e.target.value})}>
        </div>
        <div class="d-flex align-items-center">
            <select class="form-control" id="select-font" value={fontFamily} on:change={(e) => styles = updateStyle(styles, {name: 'fontFamily', value: e.target.value})}>
                <option value="">Default</option>
                {#each fonts as font}
                    <option value={font.name}>{font.name}</option>
                {/each}
            </select>
        </div>
    </div>
    <div class='col-12 d-flex justify-content-start'>
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
        <div>
            <button class={`px-2 border btn bg-light ${textColor}`} on:click={() => textColorsOpen = !textColorsOpen}>Txt</button>
            {#if textColorsOpen}
                <div class="row position-absolute rounded panel justify-content-around p-1 g-1">
                    {#each colors as color}
                        <button 
                            class={`bg-${color} color-button`} 
                            on:click={() => {
                                styles = updateStyle(styles, {name:'text-color', value:`text-${color}`})
                                textColorsOpen = false;
                            }}
                        ></button>
                    {/each}
                    <button 
                        class='color-button bg-transparent'
                        on:click={() => {
                            styles = updateStyle(styles, {name:'text-color', value:`text-transparent`})
                            textColorsOpen = false;
                        }}
                    ></button>
                </div>
            {/if}
        </div>
        <div>
            <button class={`px-2 border btn ${bgColor}`} on:click={() => bgColorsOpen = !bgColorsOpen}>Bgd</button>
            {#if bgColorsOpen}
                <div class="row position-absolute rounded panel justify-content-around p-1 g-1">
                    {#each colors as color}
                        <button 
                            class={`bg-${color} color-button`} 
                            on:click={() => {
                                styles = updateStyle(styles, {name:'backgroud-color', value:`bg-${color}`})
                                bgColorsOpen = false;
                            }}
                        ></button>
                    {/each}
                    <button 
                        class='color-button bg-transparent'
                        on:click={() => {
                            styles = updateStyle(styles, {name:'backgroud-color', value:`bg-transparent`})
                            textColorsOpen = false;
                        }}
                    ></button>
                </div>
            {/if}
        </div>
    </div>
    <div class='col-12 d-flex justify-content-start'>
        <button class='btn btn-light border px-1' on:click={() => {
            const currentUnderlined = watchStyle(styles, 'bgPrimaryText', false);
            styles = updateStyle(styles, { name:'bgPrimaryText', value: !currentUnderlined })
        }}
        ><span class='bg-primary'>Background</span></button>
        <div>
            <button class={`px-2 border btn bg-light`} on:click={() => borderRadiusOpen = !borderRadiusOpen}>Border</button>
            {#if borderRadiusOpen}
                <div class="row position-absolute rounded panel justify-content-around p-1 g-1">
                    <button class={`btn color-button px-2 border rounded-0 ${rounded === "rounded-0" ? "border border-secondary" : "btn-light"}`} on:click={() => styles = updateStyle(styles, {name:'rounded', value:'rounded-0'})}><span>r-0</span></button>
                    <button class={`btn color-button px-2 border rounded-1 ${rounded === "rounded-1" ? "border border-secondary" : "btn-light"}`} on:click={() => styles = updateStyle(styles, {name:'rounded', value:'rounded-1'})}><span>r-1</span></button>
                    <button class={`btn color-button px-2 border rounded-2 ${rounded === "rounded-2" ? "border border-secondary" : "btn-light"}`} on:click={() => styles = updateStyle(styles, {name:'rounded', value:'rounded-2'})}><span>r-2</span></button>
                    <button class={`btn color-button px-2 border rounded-3 ${rounded === "rounded-3" ? "border border-secondary" : "btn-light"}`} on:click={() => styles = updateStyle(styles, {name:'rounded', value:'rounded-3'})}><span>r-3</span></button>
                </div>
            {/if}
        </div>
    </div>
</div>
<textarea 
    name='textarea' 
    id='input-textarea' 
    class='my-3 form-control' 
    rows={6}
    bind:value={values[0].value}
/>

<style>
    .panel {
        background-color: white;
        width: 128px;
    }
    .color-button {
        width: 24px;
        height: 24px;
        border-radius: 8px;
        border: 1px solid darkgrey;
    }
</style>