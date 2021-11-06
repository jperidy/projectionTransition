<script>

import { Icon, Modal, ModalBody, ModalFooter, ModalHeader } from "sveltestrap";

import EditButton from "./EditButton.svelte";


    export let values=[];
    export let styles=[];
    export let admin='false';
    export let edit='false';
    export let updateContent;
    export let isSelected = {select: false, position:null};

    
    $:{
        if (values.length === 0) {
            values.push({type:'sousligne', value:'sousigne'});
        }
    }
    $:{
        if (!styles.length) {
            styles = [];
        }
    }
    const toggle = async() => {
        if (edit && updateContent) {
            await updateContent();
        }
        edit = !edit;
    };

    const colors = ['pomme', 'outremer', 'lavande', 'caraibe', 'tangerine', 'ambre', 'light', 'white', 'dark', 'black'];

    $: width = styles.filter(x => x.name === 'width')[0] ? styles.filter(x => x.name === 'width')[0].value : 10;
    $: marginTop = styles.filter(x => x.name === 'marginTop')[0] ? styles.filter(x => x.name === 'marginTop')[0].value : 0;
    $: marginBottom = styles.filter(x => x.name === 'marginBottom')[0] ? styles.filter(x => x.name === 'marginBottom')[0].value : 0;
    $: marginLeft = styles.filter(x => x.name === 'marginLeft')[0] ? styles.filter(x => x.name === 'marginLeft')[0].value : 0;
    $: marginRight = styles.filter(x => x.name === 'marginRight')[0] ? styles.filter(x => x.name === 'marginRight')[0].value : 0;
    $: textAlign = styles.filter(x => x.name === 'text-align')[0] && styles.filter(x => x.name === 'text-align')[0].value;
    $: textColor = styles.filter(x => x.name === 'text-color')[0] && styles.filter(x => x.name === 'text-color')[0].value;

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

<div class={`content-container row ${isSelected.select && "border border-3 rounded"}`}>
    <div class="col">
        <div 
            class={`border-top border-5 ${textColor}`}
            style={`max-width: ${width}vh; margin-top:${marginTop}rem;margin-left:${marginLeft}rem;margin-right:${marginRight}rem;margin-bottom:${marginBottom}rem;${textAlign};`}
        >
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

    {#if edit}
        <Modal isOpen={edit} {toggle} size='lg' scrollable>
            <ModalHeader {toggle}>Ajouter un contenu</ModalHeader>
            <ModalBody>
                <div class='parametres'>
                    <label for="inputWidth">Largeur en % de la largeur totale</label>
                    <input id ="inputWidth" type='number' class='form-control' value={width} on:change={(e) => updateStyle({name:'width', value:e.target.value})} />
                    <label for="marginTop">Marge au dessus en pixels</label>
                    <input id ="marginTop" type='number' class='form-control' value={marginTop} min={0} on:change={(e) => updateStyle({name:'marginTop', value:e.target.value})} />
                    <label for="marginBottom">Marge au dessous en pixels</label>
                    <input id ="marginBottom" type='number' class='form-control' value={marginBottom} min={0} on:change={(e) => updateStyle({name:'marginBottom', value:e.target.value})} />
                    <div class='py-1'><div class=''>
                        <button class={`px-1 btn ${textAlign === "margin-right:auto;" ? "btn-primary" : "btn-light"}`} on:click={() => updateStyle({name:'text-align', value:'margin-right:auto;'})}><Icon name='text-left' /></button>
                        <button class={`px-1 btn ${textAlign === "margin-right:auto;margin-left:auto;" ? "btn-primary" : "btn-light"}`} on:click={() => updateStyle({name:'text-align', value:'margin-right:auto;margin-left:auto;'})}><Icon name='text-center' /></button>
                        <button class={`px-1 btn ${textAlign === "margin-left:auto;" ? "btn-primary" : "btn-light"}`} on:click={() => updateStyle({name:'text-align', value:'margin-left:auto;'})}><Icon name='text-right' /></button>
                    </div></div>
                    <div class='py-1'><div class=''>
                        {#each colors as color}
                            <button class={`px-1 btn ${textColor === ('border-' + color) ? "btn-primary" : "btn-light"}`} on:click={() => updateStyle({name:'text-color', value:`border-${color}`})}><Icon name='fonts' class={`text-${color}`} /></button>
                        {/each}
                    </div></div>
                </div>
            </ModalBody>
            <ModalFooter>
                <button class="btn btn-primary" on:click={toggle}>Enregistrer</button>
                <button class="btn btn-secondary" on:click={() => edit = !edit}>Annuler</button>
            </ModalFooter>
        </Modal>
    {/if}
</div>


<style>
    /* .parametres {
        -webkit-transform: scale(0);
        transform: scale(0);
        transition: .5s ease;
    } */
    .content-container{
        position: relative;
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
    /* .content-container:hover .parametres {
        -webkit-transform: scale(1);
        transform: scale(1);
        transition: .5s ease;
        width: 20vh;
    } */

</style>