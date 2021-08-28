<script>

import { Button, Col, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "sveltestrap";
import EditButton from "./EditButton.svelte";


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
    

    const toggle = () => {
        if (edit && updateContent) {
            updateContent();
        }
        edit = !edit;
    };

    if (values.length === 0) {
        values.push({
            url: '',
        })
    }

    if (styles.length === 0) {
        styles.push({
            name: 'maxWidth', size: 'normal', value: '500px',
        });
        size = 'normal'
    } else {
        size = styles.filter( x => x.name === 'maxWidth')[0].size;
    }

</script>

{#if admin}

<Row>
    <Col class='text-center'>
        <EditButton
            admin={admin}
            updateContent={updateContent}
            bind:edit={edit}
        />
    </Col>
</Row>
{/if}

<Row>
    <Col>  
        <Modal isOpen={edit} {toggle}>
            <ModalHeader {toggle}>Editer le contenu de la Card</ModalHeader>
            <ModalBody>
              <Row>
                <Col>
                    <Row class='my-3'>
                        <Col>
                            <Label for='input-text'>Enter video YouTube url</Label>
                            <Input type='text' name='text' id='input-text' bind:value={values[0].url} placeholder='url'/>
                        </Col>
                        <Col>
                            <Label for='select-size'>Select display size</Label>
                            {size}
                            <select id='select-size' name='select-size' bind:value={size} on:change={sizeChange}>
                                <option value=''>--- select ---</option>
                                <option value='small'>Smal 250px</option>
                                <option value='normal'>Normal 500px [default]</option>
                                <option value='large'>Large 1000px</option>
                            </select>
                        </Col>
                    </Row>
                    <Row class='my-3'>
                        <Col>
                            <Label for='upload-video'>Select video to upload [TODO]</Label>
                            <Input type='file' class='h-1' />
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
        
        <Row class='my-5'>
            <Col>
                <div class='video-dimension' style={`max-width:${styles.filter(x => x.name === 'maxWidth')[0].value};margin-left: auto;margin-right: auto;`}>
                    <div class="video-container">
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
            </Col>
        </Row>

    </Col>
</Row>

<style>
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
    /* .video-dimension {
        max-width: 500px;
        margin-left: auto;
        margin-right: auto;
    } */
</style>