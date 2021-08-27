<script>
import { onMount } from "svelte";

import SvelteMarkdown from "svelte-markdown";


    import { Col, Figure, Image, Input, Label, Row } from "sveltestrap";
    import { uploadImage } from "../actions/imagesActions";
    import CustomText from "./CustomText.svelte";
    import EditButton from "./EditButton.svelte";

    export let items = [{
                url:'', 
                caption: '', 
                substitution: '', 
                title: '', 
                text: '',
                text1: '',
                text2: '',
            }];
    export let styles = [];
    export let updateContent;
    export let admin = false;
    export let edit = false;

    styles;

    const onChangeHandler = async(index, e) => {
        const data = new FormData();

        data.append('file', e.target.files[0]);

        const imageToReplace = items[index].url;
        
        const result = await uploadImage(data, imageToReplace);

        if (result.status === 'Ok') {
            items[index].url = result.data;
            items = items;
        } else {
            console.log('error', result.data);
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
            <Label for='upload'>Télécharger l'image (250x250)</Label>
            <Input id='upload' type='file' on:change={(e) => onChangeHandler (0, e)} />
            <Input type='text' id='input-caption' class='my-3' bind:value={items[0].caption} placeholder='Caption'/>
            <Input type='text' id='input-alt' class='my-3' bind:value={items[0].substitution} placeholder='Substitution text'/>
            <Input type='textarea' id='input-text' class='my-3' bind:value={items[0].title} placeholder="Titre"/>
            <Input type='textarea' id='input-text' class='my-3' bind:value={items[0].text1} placeholder="Message introduction"/>
            <Input type='textarea' id='input-text' class='my-3' bind:value={items[0].text} placeholder="Contenu de l'édito"/>
            
            <p>Preview</p>
        {/if}
        
        <Row class='mt-5'>
            <Col>
                <Figure caption={items[0].caption} style="float:right;max-width:30vh;margin:5vh;">
                    <Image fluid alt={items[0].substitution} src={items[0].url} />
                </Figure>
                <div class='mt-5'>
                    <SvelteMarkdown source={items[0].title} />
                </div>
                <div class='ligne-titre border-top border-5 border-primary'></div>
            </Col>
        </Row>
        <Row>
            <Col class='text-primary'>
                <div class='m-5'>
                    <i><SvelteMarkdown source={items[0].text1} /></i>
                </div>
            </Col>
        </Row>
        <Row>
            <Col class='overflow-auto'>
                <SvelteMarkdown source={items[0].text} />     
            </Col>
        </Row>

    </Col>
</Row>

<style>
    .ligne-titre {
        max-width: 10vh;
    }
</style>