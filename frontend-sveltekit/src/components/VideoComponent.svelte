<script>
import { uploadVideo } from "../actions/videosActions";
import { Button, Col, Icon, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "sveltestrap";
import EditButton from "./EditButton.svelte";
import config from '../config.json';
const API_URL = config.SVELTE_ENV === 'dev' ? config.API_URL_DEV : config.SVELTE_ENV === 'preprod' ? config.API_URL_PREPROD : config.SVELTE_ENV === 'production' ? config.API_URL_PROD : config.API_URL_DEV;
let local = false;

    export let values=[];
    export let styles=[];
    export let admin='false';
    export let edit='false';
    export let updateContent;

    styles;

    let size = '';

    const sizeChange = (e) => {

        const size = e.target.value;

        if(size === 'small') {
            styles.filter( x => x.name === 'maxWidth')[0].value = '250px';
            styles.filter( x => x.name === 'maxWidth')[0].size = size;
        } else if(size === 'normal') {
            styles.filter( x => x.name === 'maxWidth')[0].value = '500px';
            styles.filter( x => x.name === 'maxWidth')[0].size = size;
        }else if(size === 'large') {
            styles.filter( x => x.name === 'maxWidth')[0].value = '1000px';
            styles.filter( x => x.name === 'maxWidth')[0].size = size;
        }
        styles = styles;
    };
    

    const toggle = async() => {
        if (edit && updateContent) {
            await updateContent();
        }
        edit = !edit;
    };

    $: {
        if (values.length === 0) {
            values.push({
                type: 'youtube',
                url: '',
            })
        }
        if (values.length === 1) {
            values.push({
                type: 'local',
                url: '',
            })
        }
    }

    $: {
        if (styles.length === 0) {
            styles.push({
                name: 'maxWidth', size: 'normal', value: '500px',
            });
            size = 'normal'
        } else {
            size = styles.filter( x => x.name === 'maxWidth')[0].size;
        }
    }

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

    $: textAlign = styles.filter(x => x.name === 'text-align')[0] && styles.filter(x => x.name === 'text-align')[0].value;

    const onChangeHandler = async(index, e) => {
        const data = new FormData();

        data.append('video', e.target.files[0]);

        const videoToReplace = values[index].url;
        
        const result = await uploadVideo(data, videoToReplace);

        if (result.status === 'Ok') {
            values[index].url = result.data;
            values = values;
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
        transition: .5s ease;
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
    .video-container {
        position: relative;
        padding-bottom: 56.25%; /* 16:9 */
        height: 0;
    }
    .video-container iframe {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    .video-insert {
        min-width: 100%; 
        min-height: 100%;
        width: 100%; 
        height: 100%;
        background-size: cover;
        overflow: hidden;
    }
    
</style>

<div class='content-container'>
<Row>
    <Col>  
        <Modal isOpen={edit} {toggle} size='lg' scrollable>
            <ModalHeader {toggle}>Editer le contenu de la Card</ModalHeader>
            <ModalBody>
              <Row>
                <Col>
                    <Row class='my-3'>
                        <Col>
                            <Label for='input-text'>URL de la vidéo Youtube</Label>
                            <Input type='text' name='text' id='input-text' bind:value={values[0].url} placeholder='url'/>
                            <Label for='upload-video' class='mt-3'>Charger une vidéo localement</Label>
                            <Input type='file' class='h-1' on:change={(e) => onChangeHandler (1, e)}/>
                        </Col>
                        <Col>
                            <Label for='select-size'>Select display size</Label>
                            {size}
                            <select class='form-control' id='select-size' name='select-size' bind:value={size} on:change={sizeChange}>
                                <option value=''>--- select ---</option>
                                <option value='small'>Smal 250px</option>
                                <option value='normal'>Normal 500px [default]</option>
                                <option value='large'>Large 1000px</option>
                            </select>
                            <div class='row py-1'><div class='col'>
                                <button class='px-1 btn btn-light' on:click={() => updateStyle({name:'text-align', value:'margin-right: auto;'})}><Icon name='text-left' /></button>
                                <button class='px-1 btn btn-light' on:click={() => updateStyle({name:'text-align', value:'margin-left: auto;margin-right: auto'})}><Icon name='text-center' /></button>
                                <button class='px-1 btn btn-light' on:click={() => updateStyle({name:'text-align', value:'margin-left: auto'})}><Icon name='text-right' /></button>
                            </div></div>
                        </Col>
                    </Row>
                    <Row class='my-3'>
                        <Col>
                            
                        </Col>
                    </Row>

                </Col>
              </Row>
            </ModalBody>
      
            <ModalFooter>
              <Button color="primary" on:click={toggle}>Enregistrer</Button>
              <Button color="secondary" on:click={toggle}>Cancel</Button>
            </ModalFooter>
      
        </Modal>
        
        <div class='content'>
        <Row class='my-3'>
            <Col class='text-center'>
                {#if values[0].url}
                    <div class='video-dimension' style={`max-width:${styles.filter(x => x.name === 'maxWidth')[0].value};${textAlign};`}>
                        <div class={`video-container`}>
                            <iframe 
                                width="1280"
                                height="720"
                                src={values[0].url} 
                                title="YouTube video player" 
                                frameborder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowfullscreen
                            ></iframe>
                        </div>
                    </div>
                {/if}
                {#if values[1].url}
                    <!-- Afficher la version locale si la version youtube n'est pas disponible -->
                    {#if !values[0].url}
                        <div class='video-local-dimension' style={`max-width:${styles.filter(x => x.name === 'maxWidth')[0].value};${textAlign};`}>
                            <video class='video-insert' controls >
                                <source src={API_URL + '/' + values[1].url} type="video/mp4">
                                <source src={API_URL + '/' + values[1].url} type="video/webm">
                                <source src={API_URL + '/' + values[1].url} type="video/ogg">
                                <track default kind="captions"/>
                                Sorry, your browser doesn't support embedded videos.
                            </video>
                        </div>
                    {:else}
                        <!-- si la version youtube est disponible on peut regarder optionnellement la version locale -->
                        <button class='btn btn-sm btn-primary my-3' on:click={() => local = !local}>
                            {local ? 'Retour' : 'Voir la version locale'}
                        </button>
                        {#if local}
                            <div class='video-local-dimension' style={`max-width:${styles.filter(x => x.name === 'maxWidth')[0].value};${textAlign};`}>
                                <video class='video-insert' controls >
                                    <source src={API_URL + '/' + values[1].url} type="video/mp4">
                                    <source src={API_URL + '/' + values[1].url} type="video/webm">
                                    <source src={API_URL + '/' + values[1].url} type="video/ogg">
                                    <track default kind="captions"/>
                                    Sorry, your browser doesn't support embedded videos.
                                </video>
                            </div>
                        {/if}
                    {/if}
                {/if}
            </Col>
        </Row>
        </div>

    </Col>
</Row>

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