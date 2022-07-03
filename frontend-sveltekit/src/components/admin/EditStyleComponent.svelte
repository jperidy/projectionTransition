<script>
    import { onMount } from "svelte";
    import { getFonts } from "../../actions/fontsActions";
    import { updateStyle, watchStyle } from "../../utils/styleFunctions";
    import Loading from "../Loading.svelte";
    import Message from "../Message.svelte";
    import DropDown from "./DropDown.svelte";

    export let styles;
    export let stylesToEdit = {
        screenSize: false,
        alignContent: false,
        border: false,
        background: false,
        spaces: false,
        margin: false,
        padding: false,
        rotation: false,
        font: false,
        text: false,
    }

    let loadingImage = false;
    let messageUploadImage = null;

    let textColorsOpen = false;
    let bgColorsOpen = false;
    
    let fonts = [];
    onMount(() => {
        getFonts()
            .then((result) => fonts = result.fonts)
            .catch((error) => fonts = []);
    })
    
    const colors = ['primary', 'secondary', 'pomme', 'outremer', 'lavande', 'caraibe', 'tangerine', 'ambre', 'light', 'white', 'dark', 'black'];

    const onChangeFileHandler = async(index, e) => {
        loadingImage = true;
        const file = e.target.files[0];
        const fileName = Date.now() + '_' + file.name;
        
        const { error, path } = await uploadFile(file, fileName, backgroundImage, imagesFormats);

        messageUploadImage = error;
        styles = updateStyle(styles, { name:'backgroundImage', value: `/uploads/${fileName}` });

        loadingImage = false;
    };

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

    $: marginL = watchStyle(styles, 'marginL', 0);
    $: marginR = watchStyle(styles, 'marginR', 0);
    $: marginT = watchStyle(styles, 'marginT', 0);
    $: marginB = watchStyle(styles, 'marginB', 0);

    $: paddingL = watchStyle(styles, 'paddingL', 0);
    $: paddingR = watchStyle(styles, 'paddingR', 0);
    $: paddingT = watchStyle(styles, 'paddingT', 0);
    $: paddingB = watchStyle(styles, 'paddingB', 0);
    
    $: transformR = watchStyle(styles, 'transformR', 0);
    
    $: gutterX = watchStyle(styles, 'gutterX', 2);
    $: gutterY = watchStyle(styles, 'gutterY', 2);
    
    $: border = watchStyle(styles, 'border', 'btn-primary');

    $: fontFamily = watchStyle(styles, 'fontFamily', '');
    $: fontSize = watchStyle(styles, 'fontSize', '');

    $: textAlign = watchStyle(styles, 'text-align', '');
    $: textColor = watchStyle(styles, 'text-color', 'primary');
    $: bgColor = watchStyle(styles, 'backgroud-color', 'transparent');
    $: fontWeight = watchStyle(styles, 'font-weight', 'normal');
    $: fontStyle = watchStyle(styles, 'font-style', 'normal');
</script>

<div class="row align-items-center d-block">
    {#if stylesToEdit.screenSize}
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
    {/if}

    {#if stylesToEdit.alignContent}
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
    {/if}
    
    {#if stylesToEdit.border}
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
    {/if}
    
    {#if stylesToEdit.background}
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
    {/if}

    {#if stylesToEdit.spaces}
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
    {/if}

    {#if stylesToEdit.margin}
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
    {/if}
    
    {#if stylesToEdit.padding}
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
    {/if}

    {#if stylesToEdit.rotation}
    <DropDown title="Rotation">
        <div class="row align-items-center">
            <div class='col-4'>Rotate : </div>
            <div class='col-8'>
                <input type='number' class='px-1 form-control' value={transformR} on:change={(e) => styles = updateStyle(styles, {name:'transformR', value:e.target.value})}>
            </div>
        </div>
    </DropDown>
    {/if}

    {#if stylesToEdit.font}
    <DropDown title="Police">
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
    </DropDown>
    {/if}

    {#if stylesToEdit.text}
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
    {/if}
</div>

<style>
    .btn-selected {
        background-color: rgb(190, 190, 190);
        border: 2px solid rgb(88, 88, 88);
    }
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