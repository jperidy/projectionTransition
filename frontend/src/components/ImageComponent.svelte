<script>

    import { Button, Col, Icon, Input, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "sveltestrap";
    import { uploadImage } from "../actions/imagesActions";

    import EditButton from "./EditButton.svelte";

    export let values=[];
    export let styles=[];
    export let admin='false';
    export let edit='false';
    export let updateContent;

    styles;
    //$: console.log('edit', edit);

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
        if (values.length === 0) {
            values.push({caption: '',substitution: '',url: ''});
        }
    }
    
    // styles section
    $: shadow = styles.filter(x => x.name === 'shadow')[0] && styles.filter(x => x.name === 'shadow')[0].value;
    $: rounded = styles.filter(x => x.name === 'rounded')[0] && styles.filter(x => x.name === 'rounded')[0].value;
    
    $: transformR = styles.filter(x => x.name === 'transformR')[0] ? styles.filter(x => x.name === 'transformR')[0].value : 0;
    $: transformX = styles.filter(x => x.name === 'transformX')[0] ? styles.filter(x => x.name === 'transformX')[0].value : 0;
    $: transformY = styles.filter(x => x.name === 'transformY')[0] ? styles.filter(x => x.name === 'transformY')[0].value : 0;
    $: scaleXY = styles.filter(x => x.name === 'scaleXY')[0] ? styles.filter(x => x.name === 'scaleXY')[0].value : 1;


    const updateStyle = ({name, value}) => {
        //console.log('updatesstyle', {name, value});
        const curentStyleItem = styles.filter(x => x.name === name);
        if (curentStyleItem.length) {
            for (let index = 0; index < styles.length; index++) {
                if (styles[index].name === name) {
                    styles[index].value = value;
                }
            }
            styles = styles;
        } else {
            styles = [...styles, {name, value}];
        }
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
</style>

<Modal isOpen={edit} {toggle}>
    <ModalHeader {toggle}>Editer l'image</ModalHeader>
    <ModalBody>
    <Row>
        <Col>
            <Input type='file' name='image-url' on:change={(e) => onChangeHandler (0, e)} />
            <Input type='text' name='text' class='my-3' bind:value={values[0].caption} placeholder='Caption'/>
            <Input type='text' name='text' class='my-3' bind:value={values[0].substitution} placeholder='Substitution text'/>
            <p class='my-3'><strong>Prévisualisation</strong></p>
            <figure class='figure' style={`transform: rotate(${transformR}deg) translateX(${transformX}vh) translateY(${transformY}vh) scale(${scaleXY, scaleXY});`}>
                <img class={`figure-img img-fluid ${rounded} ${shadow}`} src={values[0].url} alt={values[0].substitution}>
                <figcaption class='figure-caption'>{values[0].caption}</figcaption>
            </figure>
            <div class='row py-1'>
                <div class='col'>
                    <Button class='px-1' on:click={() => updateStyle({name:'shadow', value:'shadow'})}><Icon name='back' /></Button>
                    <Button class='px-1' on:click={() => updateStyle({name:'shadow', value:''})}>No shadow</Button>
                </div>
            </div>
            <div class='row py-1'>
                <div class='col'>
                    <Button class='px-1' on:click={() => updateStyle({name:'rounded', value:'rounded-3'})}><Icon name='app' /></Button>
                    <Button class='px-1' on:click={() => updateStyle({name:'rounded', value:''})}>No rounded</Button>
                </div>
            </div>
            <div class='row py-1 align-items-center'>
                <div class='col-4'>Rotate : </div>
                <div class='col-8'>
                    <Input type='number' class='px-1' value={transformR} on:change={(e) => updateStyle({name:'transformR', value: e.target.value})} />
                </div>
            </div>
            <div class='row py-1 align-items-center'>
                <div class='col-4'>Translate X : </div>
                <div class='col-8'>
                    <Input type='number' class='px-1' value={transformX} on:change={(e) => updateStyle({name:'transformX', value:e.target.value})} />
                </div>
            </div>
            <div class='row py-1 align-items-center'>
                <div class='col-4'>Translate Y : </div>
                <div class='col-8'>
                    <Input type='number' class='px-1' value={transformY} on:change={(e) => updateStyle({name:'transformY', value:e.target.value})} />
                </div>
            </div>
            <div class='row py-1 align-items-center'>
                <div class='col-4'>Scale XY : </div>
                <div class='col-8'>
                    <Input type='number' class='px-1' value={scaleXY} on:change={(e) => updateStyle({name:'scaleXY', value:e.target.value})} step={0.05} />
                </div>
            </div>
        </Col>
    </Row>
    </ModalBody>
    <ModalFooter>
        <Button color="primary" on:click={toggle}>Enregistrer</Button>
        <Button color="secondary" on:click={toggle}>Cancel</Button>
    </ModalFooter>
</Modal>

<div class='content-container'>
    <div class='row'>
        <div class='col'>   
            {#if !values[0].url}
                <div class='bg-secondary text-center text-white' style='min-height:100px;'>Image</div>
            {/if}
            <figure class='figure' style={`transform: rotate(${transformR}deg) translateX(${transformX}vh) translateY(${transformY}vh) scale(${scaleXY, scaleXY});`}>
                <img class={`figure-img img-fluid ${rounded} ${shadow}`} src={values[0].url} alt={values[0].substitution}>
                <figcaption class='figure-caption'>{values[0].caption}</figcaption>
            </figure>
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