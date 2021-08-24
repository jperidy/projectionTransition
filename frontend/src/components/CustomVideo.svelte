<script>
    import { Col, Input, Row } from "sveltestrap";
    import EditButton from "./EditButton.svelte";

    export let updateContent;
    export let admin = false;
    export let edit = false;
    export let url = '';

</script>

{#if admin && updateContent}
    <EditButton
        admin={admin}
        updateContent={updateContent}
        bind:edit={edit}
    />
{/if}


<Row class='text-center py-5'>
    <Col>
        {#if edit}
            <Input type='text' name='text' id='input-text' bind:value={url} placeholder='url'/>
            {#if url}
                <div class="video-container">
                    <iframe 
                        width="424" 
                        height="238" 
                        src={url} 
                        title="YouTube video player" 
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen>
                    </iframe>
                </div>
            {/if}
        {:else}
            <div class='video-dimension'>
            <div class="video-container">
                <iframe 
                    width="1280"
                    height="720"
                    src={url} 
                    title="YouTube video player" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen>
                </iframe>
            </div>
            </div>
        {/if}
    </Col>
</Row>

<style>
    .video-container {
        position: relative;
        padding-bottom: 56.25%; /* 16:9 */
        height: 0;
    }
    .video-container iframe {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
    .video-dimension {
        max-width: 500px;
        margin-left: auto;
        margin-right: auto;
    }
</style>