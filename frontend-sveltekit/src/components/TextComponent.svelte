<script>
    import { getFonts } from "../actions/fontsActions";

    import SvelteMarkdown from "svelte-markdown";

    import { Icon, Modal, ModalBody, ModalFooter, ModalHeader } from "sveltestrap";

    import EditButton from "./EditButton.svelte";
    import ParagrapheMarkdown from "./markdown/ParagrapheMarkdown.svelte";
    import TableMarkdown from "./markdown/TableMarkdown.svelte";
    import TdMarkdown from "./markdown/TdMarkdown.svelte";
    import TextBgFillPrimaryMarkdown from "./markdown/TextBgFillPrimaryMarkdown.svelte";
    import TextMarkdown from "./markdown/TextMarkdown.svelte";
    import { scrollingToElement } from "..//utils/scrollingFunctin";

    export let values=[];
    export let styles=[];
    export let admin='false';
    export let edit='false';
    export let updateContent;
    export let isSelected = {select: false, position: null};

    const uniqueId = 'text_' + new Date().valueOf().toString();
    $: if (isSelected.select) scrollingToElement(uniqueId);

    const colors = ['primary', 'secondary', 'pomme', 'outremer', 'lavande', 'caraibe', 'tangerine', 'ambre', 'light', 'white', 'dark', 'black'];
    
    let fonts = [];

    $: {
        if (edit && fonts.length === 0) {
            // import font family
            getFonts()
                .then((result) => fonts = result.fonts)
                .catch((error) => fonts = []);
        }
    }

    const toggle = async() => {
        if (edit && updateContent) {
            await updateContent();
        }
        edit = !edit;
    };

    $: textAlign = styles.filter(x => x.name === 'text-align')[0] && styles.filter(x => x.name === 'text-align')[0].value;
    $: textColor = styles.filter(x => x.name === 'text-color')[0] && styles.filter(x => x.name === 'text-color')[0].value;
    $: bgColor = styles.filter(x => x.name === 'backgroud-color')[0] && styles.filter(x => x.name === 'backgroud-color')[0].value;
    $: bgPrimaryText = styles.filter(x => x.name === 'bgPrimaryText')[0] && styles.filter(x => x.name === 'bgPrimaryText')[0].value;
    $: fontWeight = styles.filter(x => x.name === 'font-weight')[0] && styles.filter(x => x.name === 'font-weight')[0].value;
    $: fontStyle = styles.filter(x => x.name === 'font-style')[0] && styles.filter(x => x.name === 'font-style')[0].value;
    $: fontFamily = styles.filter(x => x.name === 'fontFamily')[0] && styles.filter(x => x.name === 'fontFamily')[0].value || "";
    $: fontSize = styles.filter(x => x.name === 'fontSize')[0] && styles.filter(x => x.name === 'fontSize')[0].value || "";
        
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

    $:{
        if (values.length === 0) {
            values.push({type:'text', value:'#Edit your text here'});
        }
    }
    $:{
        if (!styles.length) {
            styles = [];
        }
    }

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

<div class='content-container'>

    <Modal isOpen={edit} {toggle} size='lg' scrollable>
        <ModalHeader {toggle}>Ajouter un contenu</ModalHeader>
        <ModalBody>
            <div class='row'>
                <div class='col'>
                    <textarea 
                        name='textarea' 
                        id='input-textarea' 
                        class='my-3 form-control' 
                        rows={6}
                        bind:value={values[0].value}
                    />
                    <div class='row py-1'><div class='col'>
                        <button class={`px-1 btn ${textAlign === "start" ? "btn-primary border border-secondary" : "btn-light"}`} on:click={() => updateStyle({name:'text-align', value:'start'})}><Icon name='text-left' /></button>
                        <button class={`px-1 btn ${textAlign === "center" ? "btn-primary border border-secondary" : "btn-light"}`} on:click={() => updateStyle({name:'text-align', value:'center'})}><Icon name='text-center' /></button>
                        <button class={`px-1 btn ${textAlign === "justify" ? "btn-primary border border-secondary" : "btn-light"}`} on:click={() => updateStyle({name:'text-align', value:'justify'})}><Icon name='justify-left' /></button>
                        <button class={`px-1 btn ${textAlign === "end" ? "btn-primary border border-secondary" : "btn-light"}`} on:click={() => updateStyle({name:'text-align', value:'end'})}><Icon name='text-right' /></button>
                    </div></div>
                    <div class='row py-1'><div class='col'>
                        {#each colors as color}
                            <button class={`px-1 btn ${textColor === `text-${color}` ? "btn-primary" : "btn-light"}`} on:click={() => updateStyle({name:'text-color', value:`text-${color}`})}><Icon name='fonts' class={`text-${color}`} /></button>
                        {/each}
                    </div></div>
                    <div class='row py-1'><div class='col'>
                        {#each colors as color}
                            <button class={`px-1 btn ${bgColor === `bg-${color}` ? "btn-primary" : "btn-light"}`} on:click={() => updateStyle({name:'backgroud-color', value:`bg-${color}`})}><Icon name='file-font-fill' class={`text-${color}`} /></button>
                        {/each}
                        <button class={`px-1 btn ${bgColor === `` ? "btn-primary" : "btn-light"}`} on:click={() => updateStyle({name:'backgroud-color', value:``})}>Transparent</button>
                    </div></div>
                    <div class='row py-1'><div class='col'>
                        <button class={`btn ${fontWeight === 'normal' ? 'btn-primary' : 'btn-light' } px-1`} on:click={() => {
                            updateStyle({name:'font-weight', value:'normal'});
                            updateStyle({name:'font-style', value:'normal'})
                        } }>N</button>
                        <button class={`btn ${fontWeight === 'bold' ? 'btn-primary' : 'btn-light' } px-1`} on:click={() => updateStyle({name:'font-weight', value:'bold'})}><Icon name='type-bold' /></button>
                        <button class={`btn ${fontStyle === 'italic' ? 'btn-primary' : 'btn-light' } px-1`} on:click={() => updateStyle({name:'font-style', value:'italic'})}><Icon name='type-italic' /></button>
                    </div></div>
                    <div class="row py-1">
                        <div class="col">
                            <label for="select-font">Choisir la police : </label>
                            <select class="form-control" id="select-font" value={fontFamily} on:change={(e) => updateStyle({name: 'fontFamily', value: e.target.value})}>
                                <option value="">Default</option>
                                {#each fonts as font}
                                    <option value={font.name}>{font.name}</option>
                                {/each}
                            </select>
                        </div>
                        <div class="col">
                            <label for="select-font">Taille de la police (rem) : </label>
                            <input type="number" class="form-control" placeholder="Default" min={0} max={5} step={0.05} value={fontSize} on:change={(e) => updateStyle({name: 'fontSize', value: e.target.value})}>
                        </div>
                    </div>
                    <div class='row py-1'>
                        <div class='col'>
                            <button class='btn btn-light px-1' on:click={() => updateStyle({name:'bgPrimaryText', value:true})}><span class='bg-primary'>Background</span></button>
                            <button class='btn btn-light px-1' on:click={() => updateStyle({name:'bgPrimaryText', value:false})}><span class='bg-transparent'>No Background</span></button>
                        </div>
                    </div>
                    <div class="row py-1">
                        <div class='col'>
                            <span>Margin Left : </span>
                            <input type='number' step={1} min={0} class='form-control' value={marginL} on:change={(e) => updateStyle({name:'marginL', value:e.target.value})} />
                        </div>
                        <div class='col'>
                            <span>Margin Right : </span>
                            <input type='number' step={1} min={0} class='form-control' value={marginR} on:change={(e) => updateStyle({name:'marginR', value:e.target.value})} />
                        </div>
                        <div class='col'>
                            <span>Margin Top : </span>
                            <input type='number' step={1} min={0} class='form-control' value={marginT} on:change={(e) => updateStyle({name:'marginT', value:e.target.value})} />
                        </div>
                        <div class='col'>
                            <span>Margin Bottom : </span>
                            <input type='number' step={1} min={0} class='form-control' value={marginB} on:change={(e) => updateStyle({name:'marginB', value:e.target.value})} />
                        </div>
                    </div>
                    <div class="row py-1">
                        <div class='col'>
                            <span>Padding Left : </span>
                            <input type='number' step={1} min={0} class='form-control' value={paddingL} on:change={(e) => updateStyle({name:'paddingL', value:e.target.value})} />
                        </div>
                        <div class='col'>
                            <span>Padding Right : </span>
                            <input type='number' step={1} min={0} class='form-control' value={paddingR} on:change={(e) => updateStyle({name:'paddingR', value:e.target.value})} />
                        </div>
                        <div class='col'>
                            <span>Padding Top : </span>
                            <input type='number' step={1} min={0} class='form-control' value={paddingT} on:change={(e) => updateStyle({name:'paddingT', value:e.target.value})} />
                        </div>
                        <div class='col'>
                            <span>Padding Bottom : </span>
                            <input type='number' step={1} min={0} class='form-control' value={paddingB} on:change={(e) => updateStyle({name:'paddingB', value:e.target.value})} />
                        </div>
                    </div>
                    <div class='row py-1'>
                        <div class='col'>
                            <span>Bordure arrondie : </span>
                            <button class={`btn px-1 rounded-0 ${rounded === "rounded-0" ? "btn-primary border border-secondary" : "btn-light"}`} on:click={() => updateStyle({name:'rounded', value:'rounded-0'})}><span>r-0</span></button>
                            <button class={`btn px-1 rounded-1 ${rounded === "rounded-1" ? "btn-primary border border-secondary" : "btn-light"}`} on:click={() => updateStyle({name:'rounded', value:'rounded-1'})}><span>r-1</span></button>
                            <button class={`btn px-1 rounded-2 ${rounded === "rounded-2" ? "btn-primary border border-secondary" : "btn-light"}`} on:click={() => updateStyle({name:'rounded', value:'rounded-2'})}><span>r-2</span></button>
                            <button class={`btn px-1 rounded-3 ${rounded === "rounded-3" ? "btn-primary border border-secondary" : "btn-light"}`} on:click={() => updateStyle({name:'rounded', value:'rounded-3'})}><span>r-3</span></button>
                        </div>
                    </div>
                    <div class='row py-1 align-items-center'>
                        <div class='col-4'>Rotate : </div>
                        <div class='col-8'>
                            <input type='number' class='px-1 form-control' value={transformR} on:change={(e) => updateStyle({name:'transformR', value:e.target.value})}>
                        </div>
                    </div>
                    <p class='my-3'><strong>Prévisualisation</strong></p>
                    <div class='row'>
                        <div class='col'>
                            <div class={`${textColor} ${bgColor} ${rounded}`} style={`text-align: ${textAlign}; font-family: ${fontFamily};${fontSize > 0 ? "font-size: " + fontSize + "rem"  : ""};font-weight: ${fontWeight};font-style: ${fontStyle};transform: rotate(${transformR}deg);margin-left: ${marginL}rem;margin-right: ${marginR}rem;margin-top: ${marginT}rem;margin-bottom: ${marginB}rem;padding-left: ${paddingL}rem;padding-right: ${paddingR}rem;padding-top: ${paddingT}rem;padding-bottom: ${paddingB}rem;`}>
                                <SvelteMarkdown source={values[0] && values[0].value ? values[0].value : ''} renderers={{
                                    paragraph: ParagrapheMarkdown, 
                                    table: TableMarkdown, 
                                    tablecell: TdMarkdown,
                                    text: bgPrimaryText ? TextBgFillPrimaryMarkdown : TextMarkdown,
                                    }}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ModalBody>
        <ModalFooter>
            <button class="btn btn-primary" on:click={toggle}>Enregistrer</button>
            <button class="btn btn-secondary" on:click={() => edit = !edit}>Annuler</button>
        </ModalFooter>
    </Modal>
    <div id={uniqueId} class={`content ${isSelected.select && "border border-3 rounded"}`} >
        <div class={`${textColor} ${bgColor} ${rounded}`} style={`text-align: ${textAlign}; font-family: ${fontFamily};${fontSize > 0 ? "font-size: " + fontSize + "rem"  : ""};font-weight: ${fontWeight};font-style: ${fontStyle};transform: rotate(${transformR}deg);margin-left: ${marginL}rem;margin-right: ${marginR}rem;margin-top: ${marginT}rem;margin-bottom: ${marginB}rem;padding-left: ${paddingL}rem;padding-right: ${paddingR}rem;padding-top: ${paddingT}rem;padding-bottom: ${paddingB}rem;`}>
            <SvelteMarkdown source={values[0] && values[0].value ? values[0].value : ''} renderers={{
                paragraph: ParagrapheMarkdown, 
                table: TableMarkdown, 
                tablecell: TdMarkdown,
                text: bgPrimaryText ? TextBgFillPrimaryMarkdown : TextMarkdown,
                }} />
        </div>
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