<script>
    import { Button, Col, Icon, Input, Row } from "sveltestrap";
    import SvelteMarkdown from 'svelte-markdown';
    import EditButton from "./EditButton.svelte";

    export let text = '';
    export let updateContent;
    export let admin = false;
    export let edit = false;
    export let styles = [];

    $: textAlign = styles.filter(x => x.name === 'text-align')[0] && styles.filter(x => x.name === 'text-align')[0].value;

    //const textAlign = styles.filter(x => x.name === 'text-align').value;

    const updateStyle = ({name, value}) => {
        const curentStyleItem = styles.filter(x => x.name = name);
        //console.log(styles, curentStyleItem)
        if (curentStyleItem.length) {
            for (let index = 0; index < styles.length; index++) {
                if (styles[index].name === name) {
                    styles[index].value = value;
                }
            }
        } else {
            //styles.push({name, value});
            styles = [...styles, {name, value}];
        }
    };

</script>

{#if admin && updateContent}
    <EditButton
        admin={admin}
        updateContent={updateContent}
        bind:edit={edit}
    />
{/if}

<Row>
    <Col>  
        {#if edit}
            
            <Input type='textarea' name='textarea' id='input-textarea' class='my-3' bind:value={text}/>
        
            <Button on:click={() => updateStyle({name:'text-align', value:'text-start'})}><Icon name='text-left' /></Button>
            <Button on:click={() => updateStyle({name:'text-align', value:'text-center'})}><Icon name='text-center' /></Button>
            <Button on:click={() => updateStyle({name:'text-align', value:'text-end'})}><Icon name='text-right' /></Button>
            
            <!-- <textarea bind:value={text} /> -->
            
            <p class='my-3'><strong>Prévisualisation</strong></p>
            <Row class={`${textAlign}`}>
                <Col>
                    <SvelteMarkdown source={text} />
                </Col>
            </Row>

        {:else}
        <Row class={`${textAlign}`}>
            <Col>
                <SvelteMarkdown source={text} />
            </Col>
        </Row>
        {/if}
    </Col>
</Row>