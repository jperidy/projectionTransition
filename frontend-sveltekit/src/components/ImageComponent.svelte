<script>

    import { Button, Col, Icon, Input, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "sveltestrap";
    import { uploadImage } from "../actions/imagesActions";
    import EditButton from "./EditButton.svelte";
    import config from '../config.json';
    const API_URL = config.SVELTE_ENV === 'dev' ? config.API_URL_DEV : config.SVELTE_ENV === 'preprod' ? config.API_URL_PREPROD : config.SVELTE_ENV === 'production' ? config.API_URL_PROD : config.API_URL_DEV;

    export let values=[];
    export let styles=[];
    export let admin='false';
    export let edit='false';
    export let updateContent;

    const toggle = async () => {
        if (edit && updateContent) {
            await updateContent();
        }
        edit = !edit;
    };

    const onChangeHandler = async(index, e) => {
        const data = new FormData();

        data.append('file', e.target.files[0]);

        const imageToReplace = values[index].url;
        
        const result = await uploadImage(data, imageToReplace);

        if (result.status === 'Ok') {
            values[index].url = result.data;
            values = values;
        } else {
            console.log('error', result.data);
        }
    };

    // Build the first component
    $:{
        if (values && values.length === 0) {
            values.push({caption: '',substitution: '',url: '',redirection:''});
        }
        if (!styles) styles = [];
        if (!values) values = [];
    }

    $:{
        if (!styles.length) {
            styles = [];
        }
    }
    
    // styles section
    $: shadow = styles.filter(x => x.name === 'shadow')[0] && styles.filter(x => x.name === 'shadow')[0].value;
    $: rounded = styles.filter(x => x.name === 'rounded')[0] && styles.filter(x => x.name === 'rounded')[0].value;
    $: textAlign = styles.filter(x => x.name === 'text-align')[0] && styles.filter(x => x.name === 'text-align')[0].value;
    
    $: transformR = styles.filter(x => x.name === 'transformR')[0] ? styles.filter(x => x.name === 'transformR')[0].value : 0;
    $: scaleXY = styles.filter(x => x.name === 'scaleXY')[0] ? styles.filter(x => x.name === 'scaleXY')[0].value : 1;
    $: width = styles.filter(x => x.name === 'width')[0] ? styles.filter(x => x.name === 'width')[0].value : 100;

    $: paddingL = styles.filter(x => x.name === 'paddingL')[0] && styles.filter(x => x.name === 'paddingL')[0].value || 0;
    $: paddingR = styles.filter(x => x.name === 'paddingR')[0] && styles.filter(x => x.name === 'paddingR')[0].value || 0;
    $: paddingT = styles.filter(x => x.name === 'paddingT')[0] && styles.filter(x => x.name === 'paddingT')[0].value || 0;
    $: paddingB = styles.filter(x => x.name === 'paddingB')[0] && styles.filter(x => x.name === 'paddingB')[0].value || 0;

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
    img {
        object-fit: cover;
        /* width: 100%;
        height: auto; */
    }
    figure {
        object-fit: cover;
        width: 100%;
        height: 100%;
    }
</style>

<Modal isOpen={edit} {toggle} size='lg' scrollable>
    <ModalHeader {toggle}>Editer l'image</ModalHeader>
    <ModalBody>
    <Row>
        <Col class={`col`}>
            <Input type='file' name='image-url' on:change={(e) => onChangeHandler(0, e)} />
            <Input type='text' name='text' class='my-3' bind:value={values[0].caption} placeholder='[option] Légende'/>
            <Input type='text' name='text' class='my-3' bind:value={values[0].substitution} placeholder='Texte de substitution'/>
            <Input type='text' name='text' class='my-3' bind:value={values[0].redirection} placeholder='[option] url de redirection *'/>
            <p>* exemple : https://url_cible.com Pour une url externe au site <br>* exemple : /edito pour une url interne au site</p>
            <div class='row py-1'><div class='col'>
                <button class={`px-1 btn ${textAlign === "text-start" ? "btn-primary border border-secondary" : "btn-light"}`} on:click={() => updateStyle({name:'text-align', value:'text-start'})}><Icon name='text-left' /></button>
                <button class={`px-1 btn ${textAlign === "text-center" ? "btn-primary border border-secondary" : "btn-light"}`} on:click={() => updateStyle({name:'text-align', value:'text-center'})}><Icon name='text-center' /></button>
                <button class={`px-1 btn ${textAlign === "text-end" ? "btn-primary border border-secondary" : "btn-light"}`} on:click={() => updateStyle({name:'text-align', value:'text-end'})}><Icon name='text-right' /></button>
            </div></div>
            <div class='row py-1'>
                <div class='col'>
                    <Button class="px-1" color={`${shadow === "shadow" ? "primary" : "light"}`} on:click={() => updateStyle({name:'shadow', value:'shadow'})}><Icon name='back' /></Button>
                    <Button class='px-1' color={`${shadow === "" ? "primary" : "light"}`}  on:click={() => updateStyle({name:'shadow', value:''})}>No shadow</Button>
                </div>
            </div>
            <div class='row py-1'>
                <div class='col'>
                    <Button class='px-1 rounded-3' color={`${rounded === "rounded-3" ? "primary" : "light"}`}   on:click={() => updateStyle({name:'rounded', value:'rounded-3'})}><Icon name='app' /></Button>
                    <Button class='px-1 rounded-circle' color={`${rounded === "rounded-circle" ? "primary" : "light"}`} on:click={() => updateStyle({name:'rounded', value:'rounded-circle'})}>Circle</Button>
                    <Button class='px-1' color={`${rounded === "" ? "primary" : "light"}`} on:click={() => updateStyle({name:'rounded', value:''})}>No rounded</Button>
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
            <div class='row py-1 align-items-center'>
                <div class='col-4'>Rotate : </div>
                <div class='col-8'>
                    <Input type='number' class='px-1' value={transformR} on:change={(e) => updateStyle({name:'transformR', value: e.target.value})} />
                </div>
            </div>
            <div class='row py-1 align-items-center'>
                <div class='col-4'>Scale XY : </div>
                <div class='col-8'>
                    <Input type='number' class='px-1' value={scaleXY} on:change={(e) => updateStyle({name:'scaleXY', value:e.target.value})} step={0.05} />
                </div>
            </div>
            <div class='row py-1 align-items-center'>
                <div class='col-4'>Largeur (%) : </div>
                <div class='col-8'>
                    <Input type='number' class='px-1' value={width} on:change={(e) => updateStyle({name:'width', value:e.target.value})} step={0.5} min={0} max={100} />
                </div>
            </div>
            <p class='my-3'><strong>Prévisualisation</strong></p>
            <div class='row'>
                <div class={`col ${textAlign}`}>
                    <!-- margin-left: ${marginL}rem;margin-right: ${marginR}rem;;margin-top: ${marginT}rem;;margin-bottom: ${marginB}rem; -->
                    <figure class='figure' style={`transform: rotate(${transformR}deg) scale(${scaleXY, scaleXY});padding-left: ${paddingL}rem;padding-right: ${paddingR}rem;;padding-top: ${paddingT}rem;;padding-bottom: ${paddingB}rem;`}>
                        <img 
                            src={`${API_URL}${values[0].url}`} 
                            alt={values[0].substitution}
                            class={`figure-img img-fluid m-0 p-0 ${rounded} ${shadow}`}
                            style={`width:${width}%;height:100%;`}
                            >
                        <figcaption class='figure-caption'>{values[0].caption}</figcaption>
                    </figure>
                </div>
            </div>
            
        </Col>
    </Row>
    </ModalBody>
    <ModalFooter>
        <Button color="primary" on:click={toggle}>Enregistrer</Button>
        <Button color="secondary" on:click={() => edit = !edit}>Annuler</Button>
    </ModalFooter>
</Modal>

<div class='content-container'>
    <div class='row'>
        <div class={`col ${textAlign}`}>   
            {#if !values[0].url}
                <div class='bg-secondary text-center text-dark rounded-3' style='min-height:100px;'>Ajouter l'image</div>
            {:else}
                {#if values[0].redirection}
                    <a href={values[0].redirection} target={values[0].redirection.match(/^http/i) ? '_blank' : ''} >
                        <figure class='figure' style={`transform: rotate(${transformR}deg) scale(${scaleXY, scaleXY});padding-left: ${paddingL}rem;;padding-right: ${paddingR}rem;padding-top: ${paddingT}rem;;padding-bottom: ${paddingB}rem;`}>
                            <img 
                                src={`${API_URL}${values[0].url}`} 
                                alt={values[0].substitution}
                                class={`figure-img img-fluid m-0 p-0 ${rounded} ${shadow}`}
                                style={`width:${width}%;height:100%;`}
                                >
                            <figcaption class='figure-caption'>{values[0].caption}</figcaption>
                        </figure>
                    </a>
                {:else}
                    <figure class='figure' style={`transform: rotate(${transformR}deg) scale(${scaleXY, scaleXY});padding-left: ${paddingL}rem;;padding-right: ${paddingR}rem;padding-top: ${paddingT}rem;;padding-bottom: ${paddingB}rem;`}>
                        <img 
                            src={`${API_URL}${values[0].url}`} 
                            alt={values[0].substitution}
                            class={`figure-img img-fluid m-0 p-0 ${rounded} ${shadow}`}
                            style={`width:${width}%;height:100%;`}
                            >
                        <figcaption class='figure-caption'>{values[0].caption}</figcaption>
                    </figure>
                {/if}
            {/if}

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