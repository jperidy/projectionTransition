<script>
    import SvelteMarkdown from "svelte-markdown";

    import { Button, Col, Icon, Input, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "sveltestrap";

    import EditButton from "./EditButton.svelte";

    export let values=[];
    export let styles=[];
    export let admin='false';
    export let edit='false';
    export let updateContent;

    //components;

    const colors = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'];

    const toggle = () => {
        if (edit && updateContent) {
            updateContent();
        }
        edit = !edit;
    };

    //$: console.log('TextComponent', values);

    $: textAlign = styles.filter(x => x.name === 'text-align')[0] && styles.filter(x => x.name === 'text-align')[0].value;
    $: textColor = styles.filter(x => x.name === 'text-color')[0] && styles.filter(x => x.name === 'text-color')[0].value;
    $: bgColor = styles.filter(x => x.name === 'backgroud-color')[0] && styles.filter(x => x.name === 'backgroud-color')[0].value;
    $: fontWeight = styles.filter(x => x.name === 'font-weight')[0] && styles.filter(x => x.name === 'font-weight')[0].value;
    $: fontStyle = styles.filter(x => x.name === 'font-style')[0] && styles.filter(x => x.name === 'font-style')[0].value;

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
    };

    if (values.length === 0) {
        values.push({type:'text', value:'#Edit your text here'});
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

    <Row>
        <Col>  
            <Modal isOpen={edit} {toggle}>
                <ModalHeader {toggle}>Ajouter un contenu</ModalHeader>
                
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
                            <Row class='py-1'><Col>
                                <Button class='px-1' on:click={() => updateStyle({name:'text-align', value:'start'})}><Icon name='text-left' /></Button>
                                <Button class='px-1' on:click={() => updateStyle({name:'text-align', value:'center'})}><Icon name='text-center' /></Button>
                                <Button class='px-1' on:click={() => updateStyle({name:'text-align', value:'justify'})}><Icon name='justify-left' /></Button>
                                <Button class='px-1' on:click={() => updateStyle({name:'text-align', value:'end'})}><Icon name='text-right' /></Button>
                            </Col></Row>
                            
                            <Row class='py-1'><Col>
                                {#each colors as color}
                                    <Button class='px-1' on:click={() => updateStyle({name:'text-color', value:`text-${color}`})}><Icon name='fonts' class={`text-${color}`} /></Button>
                                {/each}
                            </Col></Row>
                            
                            <Row class='py-1'><Col>
                                {#each colors as color}
                                    <Button class='px-1' on:click={() => updateStyle({name:'backgroud-color', value:`bg-${color}`})}><Icon name='file-font-fill' class={`text-${color}`} /></Button>
                                {/each}
                                <Button class='px-1' on:click={() => updateStyle({name:'backgroud-color', value:``})}>Transparent</Button>
                            </Col></Row>

                            <Row class='py-1'><Col>
                                <Button class='px-1' on:click={() => updateStyle({name:'font-weight', value:'normal'})}>B</Button>
                                <Button class='px-1' on:click={() => updateStyle({name:'font-weight', value:'bold'})}><Icon name='type-bold' /></Button>
                                <Button class='px-1' on:click={() => updateStyle({name:'font-style', value:'normal'})}>I</Button>
                                <Button class='px-1' on:click={() => updateStyle({name:'font-style', value:'italic'})}><Icon name='type-italic' /></Button>
                            </Col></Row>
                            
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
        
            </Modal>
            <div class='content' >
                <Row>
                    <Col>
                        <p class={`${textColor} ${bgColor}`} style={`text-align: ${textAlign};font-weight: ${fontWeight};font-style: ${fontStyle};`}>
                            <SvelteMarkdown source={values[0] && values[0].value ? values[0].value : ''} />
                        </p>
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