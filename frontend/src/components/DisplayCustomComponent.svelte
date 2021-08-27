<script>
    import CustomCard from "./CustomCard.svelte";
    import CustomCarousel from "./CustomCarousel.svelte";
    import CustomEdito from "./CustomEdito.svelte";
    import CustomImage from "./CustomImage.svelte";
    import CustomText from "./CustomText.svelte";
    import CustomVideo from "./CustomVideo.svelte";

    export let type = '';
    export let updateContent = null;
    export let admin = false;
    export let value = "";
    export let styles = [];
    export let values = [];
    export let edit = false;
</script>

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