<script>
    import CardComponent from "./TestComponent.svelte";

    import CustomCard from "./CustomCard.svelte";
    import CustomCarousel from "./CustomCarousel.svelte";
    import CustomEdito from "./CustomEdito.svelte";
    import CustomImage from "./CustomImage.svelte";
    import CustomText from "./CustomText.svelte";
    import CustomVideo from "./CustomVideo.svelte";
    
    import TextComponent from "./TextComponent.svelte";
    import TestComponent from "./TestComponent.svelte";
    import ImageComponent from "./ImageComponent.svelte";
    import CarouselComponent from "./CarouselComponent.svelte";
import VideoComponent from "./VideoComponent.svelte";

    export let type = '';
    export let updateContent = null;
    export let admin = false;
    export let value = "";
    export let styles = [];
    export let values = [];
    export let edit = false;
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

{#if type === 'test'}
    <TestComponent 
        bind:values={values}
        bind:styles={styles}
        updateContent={updateContent}
        admin={admin}
        edit={edit}
    />
{/if}

{#if type === 'text'}
    <CustomText 
        bind:text={value}
        bind:styles={styles}
        updateContent={updateContent}
        admin={admin}
        edit={edit}
    />
{/if}

{#if type === 'video'}
    <CustomVideo 
        bind:url={value}
        updateContent={updateContent}
        admin={admin}
        edit={edit}
    />
{/if}

{#if type === 'image'}
    <CustomImage
        bind:items={values}
        bind:styles={styles}
        updateContent={updateContent}
        admin={admin}
        edit={edit}
    />
{/if}

{#if type === 'edito'}
    <CustomEdito
        bind:items={values}
        bind:styles={styles}
        updateContent={updateContent}
        admin={admin}
        edit={edit}
    />
{/if}

{#if type === 'carousel'}
    <CustomCarousel 
        bind:items={values}
        updateContent={updateContent}
        admin={admin}
        edit={edit}
    />
{/if}

{#if type === 'card'}
    <CustomCard 
        bind:cards={values}
        updateContent={updateContent}
        admin={admin}
        edit={edit}
    />
{/if}