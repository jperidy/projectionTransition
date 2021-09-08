<script>
    
    import TextComponent from "./TextComponent.svelte";
    import TestComponent from "./TestComponent.svelte";
    import ImageComponent from "./ImageComponent.svelte";
    import CarouselComponent from "./CarouselComponent.svelte";
    import VideoComponent from "./VideoComponent.svelte";
    import EditoComponent from "./EditoComponent.svelte";
    import ArticlesComponent from "./ArticlesComponent.svelte";
    import PartenairesComponent from "./PartenairesComponent.svelte";
    import LieuxComponent from "./LieuxComponent.svelte";
    import ProgrammationComponent from "./ProgrammationComponent.svelte";

    export let type = '';
    export let updateContent = null;
    export let admin = false;
    export let styles = [];
    export let values = [];
    export let edit = false;
    export let city = '';
</script>

{#if type === 'textComponent'}
    <TextComponent
        bind:values={values}
        bind:styles={styles}
        updateContent={updateContent}
        admin={admin}
        edit={edit}
    />
{/if}

{#if type === 'imageComponent'}
    <ImageComponent
        bind:values={values}
        bind:styles={styles}
        updateContent={updateContent}
        admin={admin}
        edit={edit}
    />
{/if}

{#if type === 'videoComponent'}
    <VideoComponent
        bind:values={values}
        bind:styles={styles}
        updateContent={updateContent}
        admin={admin}
        edit={edit}
    />
{/if}

{#if type === 'carouselComponent'}
    <CarouselComponent
        bind:values={values}
        bind:styles={styles}
        updateContent={updateContent}
        admin={admin}
        edit={edit}
    />
{/if}

{#if type === 'editoComponent'}
    <EditoComponent
        bind:values={values}
        bind:styles={styles}
        updateContent={updateContent}
        admin={admin}
        edit={edit}
    />
{/if}

{#if type === 'articlesComponent'}
    <ArticlesComponent
        bind:values={values}
        bind:styles={styles}
        updateContent={updateContent}
        admin={admin}
        edit={edit}
    />
{/if}

{#if type === 'partenairesComponent'}
    <PartenairesComponent
        bind:values={values}
        bind:styles={styles}
        updateContent={updateContent}
        admin={admin}
        edit={edit}
    />
{/if}

{#if type === 'infoComponent'}
    <LieuxComponent
        bind:values={values}
        bind:styles={styles}
        updateContent={updateContent}
        admin={admin}
        edit={edit}
    />
{/if}

{#if type === 'programmationComponent'}
    <ProgrammationComponent
        bind:values={values}
        bind:styles={styles}
        updateContent={updateContent}
        admin={admin}
        edit={edit}
        city={city}
    />
{/if}

{#if type === 'test'}
    <TestComponent 
        bind:values={values}
        bind:styles={styles}
        updateContent={updateContent}
        admin={admin}
        edit={edit}
    />
{/if}