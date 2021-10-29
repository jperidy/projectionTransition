<script>
    import { uploadImage } from "../actions/imagesActions";
    import { onMount } from "svelte";
    import { Icon, Modal, ModalBody, ModalFooter, ModalHeader } from "sveltestrap";
    import AddContent from "./AddContent.svelte";
    import CustomContainer from "./CustomContainer.svelte";
    import DisplayCustomComponent from "./DisplayCustomComponent.svelte";
    import EditButton from "./EditButton.svelte";
    import MovingContent from "./MovingContent.svelte";
    export let values=[];
    export let styles=[];
    export let admin='false';
    export let edit='false';
    export let updateContent;
    export let city='';

    let columnNumber = 1;
    let columnNumberMobile = 1;
    let md = 12;
    let sm = 12;

    $:{
        if (values.length === 0) {
            values.push({type:'layout', size: 4, sizeTablette: 4, sizeMobile: 12, values:[]});
        }
    };
    $:{
        if (!styles.length) {
            styles = [];
        }
    };

    onMount(() => {
        columnNumber = values.length;
        md = 12 / columnNumber;
        sm = 12 / columnNumberMobile;
    });

    $: columnChangeHandler = (number, endPoint) => {

        if (number > values.length && number >=1) {
            const limit = 12
            while (values.length < number && values.length < limit) {
                values.push({type:'layout', size: 4, sizeTablette: 4, sizeMobile: 12, values:[]});
            }
        } else {
            const limit = 0;
            while (values.length > number && values.length > limit) {
                values.pop();
            }
        }
        if (endPoint === 'pc') {
            md = 12 / number;
        }
        if (endPoint === 'mobile') {
            sm = 12 / number;
        }
        values = values;
        updateContent && updateContent();

    };

    const addToLayout = async(item, position) => {
        values[position].values.push({...item, size:'auto'});
        updateContent && await updateContent();
    };

    const updateMovedArray = async(array) => {
        values = array;
        columnNumber = values.length;
        updateContent && await updateContent();
    }

    const toggle = async() => {
        if (edit && updateContent) {
            await updateContent();
        }
        edit = !edit;
    };

    const colors = ['primary', 'secondary', 'pomme', 'outremer', 'lavande', 'caraibe', 'tangerine', 'ambre', 'light', 'white', 'dark', 'black'];

    $: xsSize = styles.filter(x => x.name === 'xsSize')[0] && styles.filter(x => x.name === 'xsSize')[0].value || 12;
    $: smSize = styles.filter(x => x.name === 'smSize')[0] && styles.filter(x => x.name === 'smSize')[0].value || 12;
    $: mdSize = styles.filter(x => x.name === 'mdSize')[0] && styles.filter(x => x.name === 'mdSize')[0].value || 12;
    $: lgSize = styles.filter(x => x.name === 'lgSize')[0] && styles.filter(x => x.name === 'lgSize')[0].value || 10;
    $: xlSize = styles.filter(x => x.name === 'xlSize')[0] && styles.filter(x => x.name === 'xlSize')[0].value || 8;
    
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

    const calculateCol = (size, position, arrayLength) => {
        if (size && size !=='auto') {
            if (position < arrayLength) {
                return size.toString();
            } else {
                return '4';
            }
        } else {
            return '4';
        }
    };

    const onChangeFileHandler = async(index, e) => {
        const data = new FormData();
        data.append('file', e.target.files[0]);
        const imageToReplace = backgroundImage;
        const result = await uploadImage(data, imageToReplace);
        if (result.status === 'Ok') {
            updateStyle({name:'backgroundImage', value: result.data});
        } else {
            console.log('error', result.data);
        }
    };

</script>

<style>
    .content-container{
        position: relative;
    }
    .content {
        opacity: 1;
        width: 100%;
        height: 100%;
        backface-visibility: hidden;
    }
    .middle {
        transition: .5s ease;
        opacity: 0.5;
        position: absolute;
        top: 10%;
        left: 50%;
        transform: translate(-50%, -50%);
        -ms-transform: translate(-50%, -50%);
        text-align: center;
        z-index: 1000;
    }
    .content-container:hover .middle {
        opacity: 1;
    }
    .moving-container {
        -webkit-transform: scale(0);
	    transform: scale(0);
        width: 0;
        height: 0;
        transition: .5s ease;
        border: dashed 1px;
    }
    .content-container:hover .moving-container {
        -webkit-transform: scale(1);
	    transform: scale(1);
        width: 100%;
        height: 100%;
        transition: .5s ease;
        border: dashed 1px;
    }
    
</style>

<CustomContainer 
    size={{ xs: xsSize, sm: smSize, md: mdSize, lg: lgSize, xl: xlSize}}
    backgroundColor={bgColor}
    backgroundHTML={backgroundHTML}
    backgroundImage={backgroundImage}
>

    <div class='content-container'>

        {#if admin}
            <div class='middle'>
            <EditButton
                admin={admin}
                updateContent={updateContent}
                bind:edit={edit}
            />
            </div>
        {/if}

        <Modal isOpen={edit} {toggle} size='lg' scrollable>
            <ModalHeader {toggle}>Editer le layout</ModalHeader>
            <ModalBody>
                <div class="row align-items-center my-2">
                    <div class='col'>
                        <label for="input-columns" class="form-label">Nombre de colonnes</label>
                        <input type="number" class="form-control" id="input-columns" 
                            aria-describedby="nombre de colonnes" 
                            placeholder="Nombre de colonnes"
                            min={1}
                            required
                            bind:value={columnNumber}
                            on:change={(e) => columnChangeHandler(e.target.value, 'pc')}
                        />
                        <div class='row my-3'>
                            <p>Largeur du layout en fonction de l'écran</p>
                            <div class='col'>
                                <label for="xs-size">"xs screen (Mobile) (/12)"</label>
                                <input type="number" class="form-control" id="xs-size" min={1} max={12} value={xsSize} on:change={(e) => updateStyle({name:'xsSize', value:e.target.value})}/>
                            </div>
                            <div class='col'>
                                <label for="sm-size">"sm screen (Tablette) (/12)"</label>
                                <input type="number" class="form-control" id="sm-size" min={1} max={12} value={smSize} on:change={(e) => updateStyle({name:'smSize', value:e.target.value})}/>
                            </div>
                            <div class='col'>
                                <label for="md-size">"md screen (Tablette) (/12)"</label>
                                <input type="number" class="form-control" id="md-size" min={1} max={12} value={mdSize} on:change={(e) => updateStyle({name:'mdSize', value:e.target.value})}/>
                            </div>
                            <div class='col'>
                                <label for="lg-size">"lg screen (Desktop) (/12)"</label>
                                <input type="number" class="form-control" id="lg-size" min={1} max={12} value={lgSize} on:change={(e) => updateStyle({name:'lgSize', value:e.target.value})}/>
                            </div>
                            <div class='col'>
                                <label for="xl-size">"xl screen (Ecran large) (/12)"</label>
                                <input type="number" class="form-control" id="xl-size" min={1} max={12} value={xlSize} on:change={(e) => updateStyle({name:'xlSize', value:e.target.value})}/>
                            </div>
                        </div>
                        <div class='row py-1 my-2'>
                            <div class='col'>
                                <span>Alignement : </span>
                                <button class={`px-1 btn ${alignContent === "start" ? "btn-primary border border-secondary" : "btn-light"}`} on:click={() => updateStyle({name:'align-items', value:'start'})}><Icon name='align-top' /></button>
                                <button class={`px-1 btn ${alignContent === "center" ? "btn-primary border border-secondary" : "btn-light"}`} on:click={() => updateStyle({name:'align-items', value:'center'})}><Icon name='align-middle' /></button>
                                <button class={`px-1 btn ${alignContent === "end" ? "btn-primary border border-secondary" : "btn-light"}`} on:click={() => updateStyle({name:'align-items', value:'end'})}><Icon name='align-bottom' /></button>
                            </div>
                        </div>
                        <div class='row py-1 my-2 align-items-center'>
                            <div class='col-8'>
                                <span>Fond : </span>
                                {#each colors as color}
                                    <button class='px-1 btn btn-light' on:click={() => updateStyle({name:'backgroud-color', value:`bg-${color}`})}><Icon name='file-font-fill' class={`text-${color}`} /></button>
                                {/each}
                                <button class='px-1 btn btn-light' on:click={() => {
                                    updateStyle({name:'backgroud-color', value:`bg-transparent`});
                                    updateStyle({name:'backgroundHTML', value:``});
                                }}>Transparent</button>
                            </div>
                            <div class="col-4">
                                <div class="form-inline mb-3">
                                    <label for="color-html">Others (HTML)</label>
                                    <input class='form-control' id="color-html" type='text' placeholder="#FFFFFF" value={backgroundHTML} on:change={(e) => updateStyle({name:'backgroundHTML', value:e.target.value})} />
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col">
                                <span>Image de fond : </span>
                                <input type="file" class="form-control" on:change={(e) => onChangeFileHandler(0, e)}/>
                            </div>
                        </div>
                        <div class="row py-1 my-2">
                            <div class='col'>
                                <span>Margin X : </span>
                                <input type='number' step={1} min={0} class='form-control' value={marginX} on:change={(e) => updateStyle({name:'marginX', value:e.target.value})} />
                            </div>
                            <div class='col'>
                                <span>Margin Y : </span>
                                <input type='number' step={1} min={0} class='form-control' value={marginY} on:change={(e) => updateStyle({name:'marginY', value:e.target.value})} />
                            </div>
                        </div>
                        <div class="row py-1 my-2">
                            <div class='col'>
                                <span>Padding X : </span>
                                <input type='number' step={1} min={0} class='form-control' value={paddingX} on:change={(e) => updateStyle({name:'paddingX', value:e.target.value})} />
                            </div>
                            <div class='col'>
                                <span>Padding Y : </span>
                                <input type='number' step={1} min={0} class='form-control' value={paddingY} on:change={(e) => updateStyle({name:'paddingY', value:e.target.value})} />
                            </div>
                        </div>
                        <div class="row py-1 my-2">
                            <div class='col'>
                                <span>Gutter X : </span>
                                <input type='number' step={1} min={0} max={5} class='form-control' value={gutterX} on:change={(e) => updateStyle({name:'gutterX', value:e.target.value})} />
                            </div>
                            <div class='col'>
                                <span>Gutter Y : </span>
                                <input type='number' step={1} min={0} max={5} class='form-control' value={gutterY} on:change={(e) => updateStyle({name:'gutterY', value:e.target.value})} />
                            </div>
                        </div>
                        <div class='row py-1 my-2'>
                            <div class='col'>
                                <span>Bordure arrondie : </span>
                                <button class={`btn px-1 rounded-0 ${rounded === "rounded-0" ? "btn-primary border border-secondary" : "btn-light"}`} on:click={() => updateStyle({name:'rounded', value:'rounded-0'})}><span>r-0</span></button>
                                <button class={`btn px-1 rounded-1 ${rounded === "rounded-1" ? "btn-primary border border-secondary" : "btn-light"}`} on:click={() => updateStyle({name:'rounded', value:'rounded-1'})}><span>r-1</span></button>
                                <button class={`btn px-1 rounded-2 ${rounded === "rounded-2" ? "btn-primary border border-secondary" : "btn-light"}`} on:click={() => updateStyle({name:'rounded', value:'rounded-2'})}><span>r-2</span></button>
                                <button class={`btn px-1 rounded-3 ${rounded === "rounded-3" ? "btn-primary border border-secondary" : "btn-light"}`} on:click={() => updateStyle({name:'rounded', value:'rounded-3'})}><span>r-3</span></button>
                            </div>
                        </div>
                        <div class='row py-1 my-2'>
                            <div class='col'>
                                <span>Couleur de la bordure : </span>
                                {#each colors as color}
                                    <button class='px-1 btn btn-light' on:click={() => {
                                        updateStyle({name:'border-color', value:`border-${color}`});
                                        updateStyle({name:'border', value:`border`});
                                    }}>
                                        <Icon name='border-outer' class={`text-${color}`} />
                                    </button>                            
                                {/each}
                                <button class='px-1 btn btn-light' on:click={() => updateStyle({name:'border', value:''})}>Transparent</button>
                            </div>
                        </div>
                    </div>
                </div>
                <p class='my-3'><strong>Prévisualisation</strong></p>
                <div class={`row gx-${gutterX} gy-${gutterY} align-items-${alignContent} ${marginX} ${marginY} ${rounded} ${border} ${borderColor}`} style={`margin-left: ${marginX}rem;margin-right: ${marginX}rem;margin-bottom: ${marginY}rem;margin-top: ${marginY}rem;padding-left: ${paddingX}rem;padding-right: ${paddingX}rem;padding-top: ${paddingY}rem;padding-bottom: ${paddingY}rem;`}>
                    {#each values as column, position}
                        <div class={`col-sm-${sm.toString()} col-md-${md.toString()} border border-secondary`} style={`min-height: 5vh;`};>
                            Colonne {position}                                
                        </div>
                    {/each}
                </div>
            </ModalBody>
            <ModalFooter>
                <button class="btn btn-primary" on:click={toggle}>Enregistrer</button>
                <button class="btn btn-secondary" on:click={() => edit = !edit}>Annuler</button>
            </ModalFooter>
        </Modal> 
        
        <div class={`row content gx-${gutterX} gy-${gutterY} align-items-${alignContent} ${marginX} ${marginY} ${rounded} ${border} ${borderColor}`} style={`margin-left: ${marginX}rem;margin-right: ${marginX}rem;margin-bottom: ${marginY}rem;margin-top: ${marginY}rem;padding-left: ${paddingX}rem;padding-right: ${paddingX}rem;padding-top: ${paddingY}rem;padding-bottom: ${paddingY}rem;`}>
            {#each values as column, position}
                <div class={`col-${calculateCol(column.sizeMobile, position, values.length)} col-md-${calculateCol(column.sizeTablette, position, values.length)} col-xl-${calculateCol(column.size, position, values.length)}`} style={`min-height: 5vh;`};>
                    <MovingContent 
                        array={values} 
                        position={position} 
                        admin={admin} 
                        updateMovedArray={updateMovedArray}
                        addContent={null}
                    >
                    {#if admin}
                        <div class='row align-items-end'>
                            <div class='col'>
                                <label for="conf-desktop-size">Largeur (/12) PC</label>
                                <input id='conf-desktop-size' class='form-control' type='number' bind:value={column.size} on:change={updateContent} min={1} max={12} />
                            </div>
                            <div class='col'>
                                <label for="conf-mobile-size">Largeur (/12) Tablette</label>
                                <input id='conf-mobile-size' class='form-control' type='number' bind:value={column.sizeTablette} on:change={updateContent} min={1} max={12} />
                            </div>
                            <div class='col'>
                                <label for="conf-mobile-size">Largeur (/12) Mobile</label>
                                <input id='conf-mobile-size' class='form-control' type='number' bind:value={column.sizeMobile} on:change={updateContent} min={1} max={12} />
                            </div>
                        </div>
                        <p>{"* somme de la ligne < 12"}</p>
                    {/if}
                    
                    {#each column.values as content, pos}
                        <MovingContent 
                            array={column.values} 
                            position={pos} 
                            admin={admin} 
                            updateMovedArray={async (array) => {
                                values[position].values = array;
                                updateContent && await updateContent();
                            }}
                            addContent={null}
                        >
                            <DisplayCustomComponent 
                                bind:value={content.value}
                                bind:values={content.values}
                                bind:styles={content.styles}
                                type={content.type}
                                updateContent={updateContent}
                                admin={admin}
                                edit={false}
                                city={city}
                            />
                        </MovingContent>
                    {/each}

                    {#if admin}
                        <!-- <AddContent admin={admin} addContent={addContent}/> -->
                        <div class="moving-container border-light rounded-3 my-1 py-1 px-3 bg-transparent shadow-lg text-center">
                            <AddContent admin={admin} position={position} addToLayout={addToLayout} />
                        </div>
                    {/if}
                        
                    </MovingContent>
                </div>
            {/each}
        </div>

    </div>
</CustomContainer>