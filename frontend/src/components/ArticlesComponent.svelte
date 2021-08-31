<script>
import { Button, Card, CardBody, CardFooter, CardHeader, CardSubtitle, CardText, CardTitle, Col, Input, ModalBody, ModalFooter, ModalHeader, Row } from "sveltestrap";
import EditButton from "./EditButton.svelte";
import TextComponent from "./TextComponent.svelte";


    export let values=[];
    export let styles=[];
    export let admin='false';
    export let edit='false';
    export let updateContent;

    if (values.length === 0) {
        values.push([]);
    }
    if (styles.length === 0) {
        styles.push([]);
    }

    const toggle = () => {
        if (edit && updateContent) {
            updateContent();
        }
        edit = !edit;
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
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        -ms-transform: translate(-50%, -50%);
        text-align: center;
    }
    .content-container:hover .middle {
        opacity: 1;
    }

    .card {

    }
    
</style>

<div class='content-container'>

    <Row>
        <Col>
            <!-- <Modal isOpen={edit} {toggle}>
                <ModalHeader {toggle}>Ajouter un lecteur d'articles</ModalHeader>
                <ModalBody>
                    <Row>
                        <Col>
                            <Input
                                type='text' 
                                name='text' 
                                id='article-name' 
                                class='my-3' 
                                bind:value={values[0].value}
                            />
                            
                            <p class='my-3'><strong>Prévisualisation</strong></p>

                            <Row>
                                <Col>
                                    <p class={`${textColor} ${bgColor}`} style={`text-align: ${textAlign};font-weight: ${fontWeight};font-style: ${fontStyle};`}>
                                        <SvelteMarkdown source={values[0] && values[0].value ? values[0].value : ''} />
                                    </p>
                                </Col>
                            </Row>
                            
                        </Col>
                    </Row>
                </ModalBody>
        
                <ModalFooter>
                    <Button color="primary" on:click={toggle}>Enregistrer</Button>
                    <Button color="secondary" on:click={toggle}>Cancel</Button>
                </ModalFooter>
        
            </Modal> -->
            <div class='row mt-5 mb-3'>
                <div class='col'>
                    <TextComponent
                        bind:values={values[0]}
                        bind:styles={styles[0]}
                        admin={admin}
                        edit={false}
                    />
                </div>
                <div class='col text-center'>
                    <input type='text' class='bg-secondary boder-none' placeholder="Rechercher un article">
                </div>
            </div>

            <div class='row mt-3'>
                <div class='col-12 col-md-4 py-3'>
                    <div class="card bg-light border-light align-middle shadow-sm" style="border-radius: 10%;">
                        <div class="card-header border-0 bg-transparent" style="height: 5rem;">
                            <h3 class='text-center text-primary'>
                                Cette semaine nous avons rencontré XXX
                            </h3>
                        </div>
                        <div class="card-body text-center" style="height: 15rem">
                            <p>Image here</p>
                        </div>
                        <div class="card-footer border-0 bg-transparent m-auto d-grid gap-1" style="height: 5rem;">
                            <button type='button' class='btn btn-light text-secondary'>
                                <i class="bi bi-eyeglasses"></i>
                                Lire l'article
                            </button> 
                        </div>
                    </div>
                </div>

                <div class='col-12 col-md-4 py-3'>
                    <div class="card bg-light border-light align-middle shadow-sm" style="border-radius: 10%;">
                        <div class="card-header border-0 bg-transparent" style="height: 5rem;">
                            <h3 class='text-center text-primary'>
                                Cette semaine nous avons rencontré XXX
                            </h3>
                        </div>
                        <div class="card-body text-center" style="height: 15rem">
                            <p>Image here</p>
                        </div>
                        <div class="card-footer border-0 bg-transparent m-auto d-grid gap-1" style="height: 5rem;">
                            <button type='button' class='btn btn-light text-secondary'>
                                <i class="bi bi-eyeglasses"></i>
                                Lire l'article
                            </button> 
                        </div>
                    </div>
                </div>

                <div class='col-12 col-md-4 py-3'>
                    <div class="card bg-light border-light align-middle shadow-sm" style="border-radius: 10%;">
                        <div class="card-header border-0 bg-transparent" style="height: 5rem;">
                            <h3 class='text-center text-primary'>
                                Cette semaine nous avons rencontré XXX
                            </h3>
                        </div>
                        <div class="card-body text-center" style="height: 15rem">
                            <p>Image here</p>
                        </div>
                        <div class="card-footer border-0 bg-transparent m-auto d-grid gap-1" style="height: 5rem;">
                            <button type='button' class='btn btn-light text-secondary'>
                                <i class="bi bi-eyeglasses"></i>
                                Lire l'article
                            </button> 
                        </div>
                    </div>
                </div>
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