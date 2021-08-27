<script>
import { Button, Col, Figure, Image, Input, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "sveltestrap";
import { uploadImage } from "../actions/imagesActions";

import EditButton from "./EditButton.svelte";



    export let values=[];
    export let styles=[];
    export let admin='false';
    export let edit='false';
    export let updateContent;

    styles;

    const toggle = () => {
        if (edit && updateContent) {
            updateContent();
        }
        edit = !edit;
    };


    const onChangeHandler = async(index, e) => {
        const data = new FormData();

        data.append('file', e.target.files[0]);

        const imageToReplace = values[index].url;
        
        const result = await uploadImage(data, imageToReplace);

        console.log("result", result);
        console.log("index", index)

        if (result.status === 'Ok') {
            values[index].url = result.data;
            values = values;
        } else {
            console.log('error', result.data);
        }
    };

    // Build the first component
    if (values.length === 0) {
        values.push({
            caption: '',
            substitution: '',
            url: ''
        })
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
                    <Input type='file' name='image-url' on:change={(e) => onChangeHandler (0, e)} />
                    <Input type='text' name='text' id='input-caption' class='my-3' bind:value={values[0].caption} placeholder='Caption'/>
                    <Input type='text' name='text' id='input-alt' class='my-3' bind:value={values[0].substitution} placeholder='Substitution text'/>
                    
                    <p class='my-3'><strong>Prévisualisation</strong></p>
                    <Row>
                        <Col>
                            <Figure caption={values[0].caption}>
                                <Image fluid alt={values[0].substitution} src={values[0].url} />
                            </Figure>
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
        
        <Row>
            <Col>
                <Figure caption={values[0].caption}>
                    <Image fluid alt={values[0].substitution} src={values[0].url} />
                </Figure>
            </Col>
        </Row>

    </Col>
</Row>