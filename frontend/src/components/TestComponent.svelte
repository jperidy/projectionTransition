<script>
    import SvelteMarkdown from "svelte-markdown";
    import { Button, Col, Icon, Input, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "sveltestrap";
    import EditButton from "./EditButton.svelte";
    import TextComponent from "./TextComponent.svelte";

    export let values=[];
    export let styles=[];
    export let admin='false';
    export let edit='false';
    export let updateContent;

    const toggle = () => {
        if (edit && updateContent) {
            updateContent();
        }
        edit = !edit;
    };

    $: textAlign = styles.filter(x => x.name === 'text-align')[0] && styles.filter(x => x.name === 'text-align')[0].value;

    const updateStyle = ({name, value}) => {
        const curentStyleItem = styles.filter(x => x.name = name);
        if (curentStyleItem.length) {
            for (let index = 0; index < styles.length; index++) {
                if (styles[index].name === name) {
                    styles[index].value = value;
                }
            }
        } else {
            styles = [...styles, {name, value}];
        }
    };

    if (values.length === 0) {
        values.push({type:'text', value:''});
        values.push({type:'textComponent', values: [], styles: []});
    }

</script>

{#if admin}
    <EditButton
        admin={admin}
        updateContent={updateContent}
        bind:edit={edit}
    />
{/if}

<Row>
    <Col>  
        <Modal isOpen={edit} {toggle}>
            <ModalHeader {toggle}>Editer le contenu de la Card</ModalHeader>
            <ModalBody>
              <Row>
                <Col>
                    <Input 
                        type='textarea' 
                        name='textarea' 
                        id='input-textarea' 
                        class='my-3' 
                        bind:value={values[0].value}
                    />
                    <Button on:click={() => updateStyle({name:'text-align', value:'text-start'})}><Icon name='text-left' /></Button>
                    <Button on:click={() => updateStyle({name:'text-align', value:'text-center'})}><Icon name='text-center' /></Button>
                    <Button on:click={() => updateStyle({name:'text-align', value:'text-end'})}><Icon name='text-right' /></Button>
                    <p class='my-3'><strong>Prévisualisation</strong></p>

                    <Row class={`${textAlign}`}>
                        <Col>
                            <SvelteMarkdown source={values[0] && values[0].value ? values[0].value : ''} />
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
        
        <Row class={`${textAlign}`}>
            <Col>
                <SvelteMarkdown source={values[0] && values[0].value ? values[0].value : ''} />
            </Col>
        </Row>

        <Row>
            <Col>
                <TextComponent
                    bind:values={values[1].values}
                    bind:styles={values[1].styles}
                    updateContent={updateContent}
                    admin={admin}
                    edit={false}
                />
            </Col>
        </Row>
    </Col>
</Row>