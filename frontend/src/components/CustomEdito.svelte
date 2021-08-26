<script>

    import { Col, Figure, Image, Input, Label, Row } from "sveltestrap";
    import { uploadImage } from "../actions/imagesActions";
    import CustomText from "./CustomText.svelte";
    import EditButton from "./EditButton.svelte";

    export let items = [{
        url:'', 
        caption: '', 
        substitution: '', 
        title: '', 
        text: ''
    }];
    export let styles = [];
    export let updateContent;
    export let admin = false;
    export let edit = false;

    styles

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
            <Input id='upload' type='file' name='image-url' on:change={(e) => onChangeHandler (0, e)} />
            <Input type='text' name='text' id='input-caption' class='my-3' bind:value={items[0].caption} placeholder='Caption'/>
            <Input type='text' name='text' id='input-alt' class='my-3' bind:value={items[0].substitution} placeholder='Substitution text'/>
            <Input type='text' name='text' id='input-title' class='my-3' bind:value={items[0].title} placeholder="Titre de l'édito"/>
            <Input type='text' name='text' id='input-text' class='my-3' bind:value={items[0].text} placeholder="Contenu de l'édito"/>
            
            <p>Preview</p>
        {/if}
        
        <h1>{items[0].title}</h1>
        <Figure caption={items[0].caption}>
            <Image fluid alt={items[0].substitution} src={items[0].url} />
        </Figure>
        <p>
            {items[0].text}
        </p>
        

    </Col>
</Row>