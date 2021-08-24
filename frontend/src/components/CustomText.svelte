<script>
    import { Col, Input, Row } from "sveltestrap";
    import SvelteMarkdown from 'svelte-markdown';
    import EditButton from "./EditButton.svelte";

    export let text = '';
    export let updateContent;
    export let admin = false;
    export let edit = false;

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
            <Input type='textarea' name='textarea' id='input-textarea' bind:value={text}/>
            <!-- <textarea bind:value={text} /> -->
        {:else}
        <SvelteMarkdown source={text} />
        {/if}
    </Col>
</Row>