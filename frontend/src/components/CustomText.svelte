<script>
    import { Col, Row } from "sveltestrap";
    import SvelteMarkdown from 'svelte-markdown';
    import EditButton from "./EditButton.svelte";

    export let text = '';
    export let updateContent;
    export let admin = false;

    let edit = false;

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
        {#if edit}
            <textarea bind:value={text} />
        {:else}
            <SvelteMarkdown source={text} />
        {/if}
    </Col>
</Row>