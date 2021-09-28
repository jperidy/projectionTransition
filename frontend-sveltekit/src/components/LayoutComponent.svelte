<script>

    import { onMount } from "svelte";
    import { Icon, Modal, ModalBody, ModalFooter, ModalHeader } from "sveltestrap";
    import AddContent from "./AddContent.svelte";
    import DisplayCustomComponent from "./DisplayCustomComponent.svelte";
    import EditButton from "./EditButton.svelte";
    import MovingContent from "./MovingContent.svelte";
    export let values=[];
    export let styles=[];
    export let admin='false';
    export let edit='false';
    export let updateContent;

    styles;

    let columnNumber = 1;
    let md = 12;

    $:{
        if (values.length === 0) {
            values.push({type:'layout', values:[]});
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
    });

    $: columnChangeHandler = (number) => {

        if (number > values.length && number >=1) {
            values.push({type:'layout', values:[]})
        } else {
            values.pop();
        }
        md = 12 / number;
        values = values;
        updateContent && updateContent();

    };

    const addToLayout = async(item, position) => {
        //values[position] = item;
        //console.log("item", item);
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

    const colors = ['pomme', 'outremer', 'lavande', 'caraibe', 'tangerine', 'ambre', 'light', 'white', 'dark', 'black'];


    $: alignContent = styles.filter(x => x.name === 'align-items')[0] && styles.filter(x => x.name === 'align-items')[0].value;
    $: bgColor = styles.filter(x => x.name === 'backgroud-color')[0] && styles.filter(x => x.name === 'backgroud-color')[0].value;
    $: padding = styles.filter(x => x.name === 'padding')[0] && styles.filter(x => x.name === 'padding')[0].value;
    $: marginX = styles.filter(x => x.name === 'marginX')[0] && styles.filter(x => x.name === 'marginX')[0].value;
    $: marginY = styles.filter(x => x.name === 'marginY')[0] && styles.filter(x => x.name === 'marginY')[0].value;
    $: rounded = styles.filter(x => x.name === 'rounded')[0] && styles.filter(x => x.name === 'rounded')[0].value;
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
        if (size) {
            if (position < arrayLength) {
                return size.toString();
            } else {
                return 'auto';
            }
        } else {
            return 'auto';
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
        -webkit-transform: scale(1);
	    transform: scale(1);
        transition: .5s ease;
        border: dashed 1px;
    }
    .moving-container:hover {
        -webkit-transform: scale(1.03);
	    transform: scale(1.03);
        transition: .5s ease;
    }
    
</style>

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
                <div class="row align-items-center">
                    <div class='col'>
                        <label for="input-columns" class="form-label">Nombre de colonnes *</label>
                        <input type="number" class="form-control" id="input-columns" 
                            aria-describedby="nombre de colonnes" 
                            placeholder="Nombre de colonnes"
                            min={1}
                            max={4}
                            required
                            bind:value={columnNumber}
                            on:change={(e) => columnChangeHandler(e.target.value)}
                        />
                        <div class='row py-1'>
                            <div class='col'>
                                <span>Alignement : </span>
                                <button class='px-1 btn btn-light' on:click={() => updateStyle({name:'align-items', value:'start'})}><Icon name='align-top' /></button>
                                <button class='px-1 btn btn-light' on:click={() => updateStyle({name:'align-items', value:'center'})}><Icon name='align-middle' /></button>
                                <button class='px-1 btn btn-light' on:click={() => updateStyle({name:'align-items', value:'end'})}><Icon name='align-bottom' /></button>
                            </div>
                        </div>
                        <div class='row py-1'>
                            <div class='col'>
                                <span>Fond : </span>
                                {#each colors as color}
                                    <button class='px-1 btn btn-light' on:click={() => updateStyle({name:'backgroud-color', value:`bg-${color}`})}><Icon name='file-font-fill' class={`text-${color}`} /></button>
                                {/each}
                                <button class='px-1 btn btn-light' on:click={() => updateStyle({name:'backgroud-color', value:``})}>Transparent</button>
                            </div>
                        </div>
                        <div class='row py-1'>
                            <div class='col'>
                                <span>Padding : </span>
                                <button class='btn btn-light p-0' on:click={() => updateStyle({name:'padding', value:'p-0'})}><span>p-0</span></button>
                                <button class='btn btn-light p-1' on:click={() => updateStyle({name:'padding', value:'p-1'})}><span>p-1</span></button>
                                <button class='btn btn-light p-2' on:click={() => updateStyle({name:'padding', value:'p-2'})}><span>p-2</span></button>
                                <button class='btn btn-light p-3' on:click={() => updateStyle({name:'padding', value:'p-3'})}><span>p-3</span></button>
                                <button class='btn btn-light p-4' on:click={() => updateStyle({name:'padding', value:'p-4'})}><span>p-4</span></button>
                                <button class='btn btn-light p-5' on:click={() => updateStyle({name:'padding', value:'p-5'})}><span>p-5</span></button>
                            </div>
                        </div>
                        <div class="row py-1">
                            <div class='col'>
                                <span>Margin X : </span>
                                <button class='btn btn-light mx-0' on:click={() => updateStyle({name:'marginX', value:'mx-0'})}><span>marginX-0</span></button>
                                <button class='btn btn-light mx-1' on:click={() => updateStyle({name:'marginX', value:'mx-1'})}><span>marginX-1</span></button>
                                <button class='btn btn-light mx-2' on:click={() => updateStyle({name:'marginX', value:'mx-2'})}><span>marginX-2</span></button>
                                <button class='btn btn-light mx-3' on:click={() => updateStyle({name:'marginX', value:'mx-3'})}><span>marginX-3</span></button>
                                <button class='btn btn-light mx-4' on:click={() => updateStyle({name:'marginX', value:'mx-4'})}><span>marginX-4</span></button>
                                <button class='btn btn-light mx-5' on:click={() => updateStyle({name:'marginX', value:'mx-5'})}><span>marginX-5</span></button>
                            </div>
                        </div>
                        <div class="row py-1">
                            <div class='col'>
                                <span>Margin Y : </span>
                                <button class='btn btn-light my-0' on:click={() => updateStyle({name:'marginY', value:'my-0'})}><span>marginY-0</span></button>
                                <button class='btn btn-light my-1' on:click={() => updateStyle({name:'marginY', value:'my-1'})}><span>marginY-1</span></button>
                                <button class='btn btn-light my-2' on:click={() => updateStyle({name:'marginY', value:'my-2'})}><span>marginY-2</span></button>
                                <button class='btn btn-light my-3' on:click={() => updateStyle({name:'marginY', value:'my-3'})}><span>marginY-3</span></button>
                                <button class='btn btn-light my-4' on:click={() => updateStyle({name:'marginY', value:'my-4'})}><span>marginY-4</span></button>
                                <button class='btn btn-light my-5' on:click={() => updateStyle({name:'marginY', value:'my-5'})}><span>marginY-5</span></button>
                            </div>
                        </div>
                        <div class='row py-1'>
                            <div class='col'>
                                <span>Bordure : </span>
                                <button class='btn btn-light px-1 rounded-0' on:click={() => updateStyle({name:'rounded', value:'rounded-0'})}><span>r-0</span></button>
                                <button class='btn btn-light px-1 rounded-1' on:click={() => updateStyle({name:'rounded', value:'rounded-1'})}><span>r-1</span></button>
                                <button class='btn btn-light px-1 rounded-2' on:click={() => updateStyle({name:'rounded', value:'rounded-2'})}><span>r-2</span></button>
                                <button class='btn btn-light px-1 rounded-3' on:click={() => updateStyle({name:'rounded', value:'rounded-3'})}><span>r-3</span></button>
                            </div>
                        </div>
                        <div class='row py-1'>
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
                <div class={`row gx-2 align-items-${alignContent} ${bgColor} ${padding} ${marginX} ${marginY} ${rounded} ${border} ${borderColor}`}>
                    {#each values as column, position}
                        <div class={`col-sm-12 col-md-${md.toString()} border border-light`} style={`min-height: 5vh;`};>
                            Colonne {position}                                
                        </div>
                    {/each}
                </div>

        </ModalBody>
        <ModalFooter>
            <button class="btn btn-primary" on:click={toggle}>Enregistrer</button>
            <button class="btn btn-secondary" on:click={toggle}>Cancel</button>
        </ModalFooter>
    </Modal> 
    
    <div class={`row gx-2 content align-items-${alignContent} ${bgColor} ${padding} ${marginX} ${marginY} ${rounded} ${border} ${borderColor}`}>
        {#each values as column, position}

        <!-- <div class={`col-sm-12 col-md-${md.toString()}`} style={`min-height: 5vh;`};> -->
            <div class={`col-sm-12 col-md-${calculateCol(column.size, position, values.length)}`} style={`min-height: 5vh;`};>
                <MovingContent 
                    array={values} 
                    position={position} 
                    admin={admin} 
                    updateMovedArray={updateMovedArray}
                    addContent={null}
                >
                {#if admin}
                    <input class='form-control' type='number' bind:value={column.size} min={1} max={12} />
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
                            city={""}
                        />
                    </MovingContent>
                {/each}

                {#if admin}
                    <!-- <AddContent admin={admin} addContent={addContent}/> -->
                    <div class="moving-container border-light rounded-3 mt-3 mb-1 py-1 px-3 bg-lavande shadow-lg text-center">
                        <AddContent admin={admin} position={position} addToLayout={addToLayout} />
                    </div>
                {/if}
                    
                </MovingContent>
            </div>
        {/each}
    </div>

</div>