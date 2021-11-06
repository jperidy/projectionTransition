<script>
    
    import TextComponent from "./TextComponent.svelte";
    import ImageComponent from "./ImageComponent.svelte";
    import CarouselComponent from "./CarouselComponent.svelte";
    import VideoComponent from "./VideoComponent.svelte";
    import EditoComponent from "./EditoComponent.svelte";
    import ArticlesComponent from "./ArticlesComponent.svelte";
    import PartenairesComponent from "./PartenairesComponent.svelte";
    import LieuxComponent from "./LieuxComponent.svelte";
    import ProgrammationComponent from "./ProgrammationComponent.svelte";
    import EquipeComponent from "./EquipeComponent.svelte";
    import ContactForm from "./ContactForm.svelte";
    import LayoutComponent from "./LayoutComponent.svelte";
    import SouslligneComponent from "./SouslligneComponent.svelte";
    import CompressFileComponent from "./CompressFileComponent.svelte";
    import MultiLayerComponent from "./MultiLayerComponent.svelte";
    import { scrollingToElement } from "../utils/scrollingFunctin";

    export let type = '';
    export let updateContent = null;
    export let admin = false;
    export let styles = [];
    export let values = [];
    export let edit = false;
    export let city = '';
    export let isSelected = {select: false, position: null};


    // function to automaticly scroll to element to be editing
    const uniqueId = 'component_' + new Date().valueOf().toString();
    $: if (isSelected.select) scrollingToElement(uniqueId);

</script>

<div id={uniqueId}>

    <!-- Unit components -->
    {#if type === 'layoutComponent'}
        <LayoutComponent
            bind:values={values}
            bind:styles={styles}
            isSelected={isSelected}
            city={city}
        />
    {/if}

    {#if type === 'multiLayerComponent'}
        <MultiLayerComponent
            bind:values={values}
            bind:styles={styles}
            isSelected={isSelected}
        />
    {/if}

    {#if type === 'textComponent'}
        <TextComponent
            bind:values={values}
            bind:styles={styles}
            isSelected={isSelected}
        />
    {/if}

    {#if type === 'imageComponent'}
        <ImageComponent
            bind:values={values}
            bind:styles={styles}
            isSelected={isSelected}
        />
    {/if}

    {#if type === 'sousligneComponent'}
        <SouslligneComponent
            bind:values={values}
            bind:styles={styles}
            isSelected={isSelected}
        />
    {/if}

    {#if type === 'compressComponent'}
        <CompressFileComponent
            bind:values={values}
            bind:styles={styles}
            isSelected={isSelected}
        />
    {/if}

    {#if type === 'videoComponent'}
        <VideoComponent
            bind:values={values}
            bind:styles={styles}
            isSelected={isSelected}
        />
    {/if}

    {#if type === 'contactComponent'}
        <ContactForm
            bind:values={values}
            bind:styles={styles}
            isSelected={isSelected}
        />
    {/if}

    <!-- extract unit component Map and Dropdown -->
    {#if type === 'infoComponent'}
        <LieuxComponent
            bind:values={values}
            bind:styles={styles}
            updateContent={updateContent}
            admin={admin}
            edit={edit}
        />
    {/if}

    <!-- Extrat unit component switch -->
    {#if type === 'carouselComponent'}
        <CarouselComponent
            bind:values={values}
            bind:styles={styles}
            updateContent={updateContent}
            admin={admin}
            edit={edit}
        />
    {/if}

    <!-- custom components with automatics process -->
    {#if type === 'articlesComponent'}
        <ArticlesComponent
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



    <!-- Do not use this component >> combien Layout and unit components -->
    {#if type === 'editoComponent'}
        <EditoComponent
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
    {#if type === 'equipeComponent'}
        <EquipeComponent
            bind:values={values}
            bind:styles={styles}
            updateContent={updateContent}
            admin={admin}
            edit={edit}
        />
    {/if}

</div>