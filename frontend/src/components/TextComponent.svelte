<script>
    import SvelteMarkdown from "svelte-markdown";

    import { Button, Col, Icon, Input, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "sveltestrap";

    import EditButton from "./EditButton.svelte";
    import ParagrapheMarkdown from "./markdown/ParagrapheMarkdown.svelte";
    import TableMarkdown from "./markdown/TableMarkdown.svelte";
    import TdMarkdown from "./markdown/TdMarkdown.svelte";
    import TextBgFillPrimaryMarkdown from "./markdown/TextBgFillPrimaryMarkdown.svelte";
    import TextMarkdown from "./markdown/TextMarkdown.svelte";

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

    $: bgPrimaryText = styles.filter(x => x.name === 'bgPrimaryText')[0] && styles.filter(x => x.name === 'bgPrimaryText')[0].value;
    $: padding = styles.filter(x => x.name === 'padding')[0] && styles.filter(x => x.name === 'padding')[0].value;
    
    $: rounded = styles.filter(x => x.name === 'rounded')[0] && styles.filter(x => x.name === 'rounded')[0].value;

    $: transformR = styles.filter(x => x.name === 'transformR')[0] ? styles.filter(x => x.name === 'transformR')[0].value : 0;
    $: transformX = styles.filter(x => x.name === 'transformX')[0] ? styles.filter(x => x.name === 'transformX')[0].value : 0;
    $: transformY = styles.filter(x => x.name === 'transformY')[0] ? styles.filter(x => x.name === 'transformY')[0].value : 0;

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
                    <Row class='py-1'>
                        <Col>
                            <Button class='px-1' on:click={() => updateStyle({name:'bgPrimaryText', value:true})}><span class='bg-primary'>Background</span></Button>
                            <Button class='px-1' on:click={() => updateStyle({name:'bgPrimaryText', value:false})}><span class='bg-transparent'>No Background</span></Button>
                        </Col>
                    </Row>
                    <Row class='py-1'>
                        <Col>
                            <Button class='p-1' on:click={() => updateStyle({name:'padding', value:'p-1'})}><span>p-1</span></Button>
                            <Button class='p-2' on:click={() => updateStyle({name:'padding', value:'p-2'})}><span>p-2</span></Button>
                            <Button class='p-3' on:click={() => updateStyle({name:'padding', value:'p-3'})}><span>p-3</span></Button>
                            <Button class='p-4' on:click={() => updateStyle({name:'padding', value:'p-4'})}><span>p-4</span></Button>
                            <Button class='p-5' on:click={() => updateStyle({name:'padding', value:'p-5'})}><span>p-5</span></Button>
                        </Col>
                    </Row>
                    <Row class='py-1'>
                        <Col>
                            <Button class='px-1 rounded-0' on:click={() => updateStyle({name:'rounded', value:'rounded-0'})}><span>r-0</span></Button>
                            <Button class='px-1 rounded-1' on:click={() => updateStyle({name:'rounded', value:'rounded-1'})}><span>r-1</span></Button>
                            <Button class='px-1 rounded-2' on:click={() => updateStyle({name:'rounded', value:'rounded-2'})}><span>r-2</span></Button>
                            <Button class='px-1 rounded-2' on:click={() => updateStyle({name:'rounded', value:'rounded-3'})}><span>r-3</span></Button>
                        </Col>
                    </Row>
                    <div class='row py-1 align-items-center'>
                        <div class='col-4'>Rotate : </div>
                        <div class='col-8'>
                            <Input type='number' class='px-1' value={transformR} on:change={(e) => updateStyle({name:'transformR', value:e.target.value})}>-</Input>
                        </div>
                    </div>
                    <div class='row py-1 align-items-center'>
                        <div class='col-4'>Translate X : </div>
                        <div class='col-8'>
                            <Input type='number' class='px-1' value={transformX} on:change={(e) => updateStyle({name:'transformX', value:e.target.value})}>-</Input>
                        </div>
                    </div>
                    <div class='row py-1 align-items-center'>
                        <div class='col-4'>Translate Y : </div>
                        <div class='col-8'>
                            <Input type='number' class='px-1' value={transformY} on:change={(e) => updateStyle({name:'transformY', value:e.target.value})}>-</Input>
                        </div>
                    </div>
                    <p class='my-3'><strong>Prévisualisation</strong></p>
                    <Row>
                        <Col>
                            <div class={`${textColor} ${bgColor} ${padding} ${rounded}`} style={`text-align: ${textAlign};font-weight: ${fontWeight};font-style: ${fontStyle};transform: rotate(${transformR}deg) translateX(${transformX}vh) translateY(${transformY}vh);`}>
                                <SvelteMarkdown source={values[0] && values[0].value ? values[0].value : ''} renderers={{
                                    paragraph: ParagrapheMarkdown, 
                                    table: TableMarkdown, 
                                    tablecell: TdMarkdown,
                                    text: bgPrimaryText ? TextBgFillPrimaryMarkdown : TextMarkdown,
                                    }}/>
                            </div>
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
        <div class={`${textColor} ${bgColor} ${padding} ${rounded}`} style={`text-align: ${textAlign};font-weight: ${fontWeight};font-style: ${fontStyle};transform: rotate(${transformR}deg) translateX(${transformX}vh) translateY(${transformY}vh);`}>
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