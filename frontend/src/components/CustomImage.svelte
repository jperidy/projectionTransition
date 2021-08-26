<script>
import { Col, Figure, Image, Input, Row } from "sveltestrap";
import EditButton from "./EditButton.svelte";

    export let items = [{url:'', caption: '', substitution: ''}];
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
            <Input type='file' name='image-url' on:change={(e) => onChangeHandler (index, e)} />
            <Input type='text' name='text' id='input-url' class='my-3' bind:value={items[0].url}/>
            <Input type='text' name='text' id='input-caption' class='my-3' bind:value={items[0].caption} placeholder='Caption'/>
            <Input type='text' name='text' id='input-alt' class='my-3' bind:value={items[0].substitution} placeholder='Substitution text'/>
            
            <p>Preview</p>
        {/if}
        
        <Figure caption={items[0].caption}>
            <Image fluid alt={items[0].substitution} src={items[0].url} />
        </Figure>

    </Col>
</Row>

