<script>
    import { recursiveDeleteAction, recursiveDeleteStyle } from "../../utils/imageFunctions";
    import { recursiveFilmDelete } from "../../actions/filmActions";

    import { arrayMove } from "../../utils/arrayFunction";
    import AddElement from "../AddElement.svelte";

    import EditLayoutComponent from "./EditLayoutComponent.svelte";
    import EditTextComponent from "./EditTextComponent.svelte";
    import EditImageComponent from "./EditImageComponent.svelte";
    import EditSousLigneComponent from "./EditSousLigneComponent.svelte";
    import EditMultiLayerComponent from "./EditMultiLayerComponent.svelte";

    export let type;
    export let values;
    export let styles;
    export let pageContent;
    export let selectedComponentPosition = null;
    export let position;
    export let displayInFrame = false;

    let visible = false;

    const upAction = () => {
        if (position > 0) {
            pageContent = arrayMove(pageContent, position, position - 1);
        }
    };
    const downAction = () => {
        if (position < pageContent.length - 1) {
            pageContent = arrayMove(pageContent, position, position + 1);
        }
    };

    let selectPosition = false;
    let addUp = false;
    let addDown = false;
    const addAction = (addPosition) => {
        if (addPosition === 'up') {
            addUp = true;
            addDown = false;
        }
        if (addPosition === 'down') {
            addUp = false;
            addDown = true;
        }
        selectPosition = false;
    };

    const addContent = (component, position) => {
        if (!displayInFrame) {
            pageContent.splice(position, 0, component);
        } else {
            // Modelisation of frame to optimize >> major impact on already production website
            pageContent.splice(position, 0, {
                type:'layout', 
                size: 4, 
                sizeTablette: 4, 
                sizeMobile: 12, 
                values:[component] 
            })
        }
        pageContent = pageContent;  
    };

    const deleteAction = async () => {
        if (window.confirm('Attention cette action est irreversible !')) {
            const values = pageContent[position];
            const copyValue = JSON.parse(JSON.stringify(values));

            // Delete any image tied to object
            await recursiveDeleteAction(values);
    
            // Delete any film tied to object
            await recursiveFilmDelete(values);

            // Delte any image tied to style
            await recursiveDeleteStyle(copyValue);
    
            pageContent.splice(position, 1);
            pageContent = pageContent;
            //updateMovedArray(array);
        }
    };

</script>

<div class="d-grid">
    <div class="d-flex justify-content-between">
        <button class="edit-component btn btn-md btn-transparent px-0 text-start text-dark" on:click={() => visible = !visible}>
            {#if visible}
                <i class="bi bi-dash-square"></i>
            {:else}
                <i class="bi bi-plus-square"></i>
            {/if}
            {type.toUpperCase()}
        </button>
        <span class="d-flex">
            <button class="btn btn-transparent m-0 p-0" on:click={upAction}>
                <i class="bi bi-chevron-up text-dark"></i>
            </button>
            <button class="btn btn-transparent m-0 p-0" on:click={downAction}>
                <i class="bi bi-chevron-down text-dark"></i>
            </button>
            <button class="btn btn-transparent m-0 p-0" >
                <i class="bi bi-files text-dark"></i>
            </button>
            <button class="btn btn-transparent m-0 p-0" on:click={deleteAction}>
                <i class="bi bi-trash text-danger"></i>
            </button>

            <div class="d-grid">
                {#if selectPosition}
                    <button class="btn btn-transparent m-0 p-0" on:click={() => addAction('up')}>
                        <i class="bi bi-caret-up text-dark"></i>
                    </button>
                {/if}
                <button class="btn btn-transparent m-0 p-0" on:click={() => selectPosition = !selectPosition}>
                    <i class="bi bi-plus-circle text-dark"></i>
                </button>
                {#if selectPosition}
                    <button class="btn btn-transparent m-0 p-0" on:click={() => addAction('down')}>
                        <i class="bi bi-caret-down text-dark">
                    </i></button>
                {/if}
            </div>

        </span>
    </div>
    {#if visible}
        <div class="px-3 my-1 border-start border-3">
            {#if type === 'layoutComponent'}
                <EditLayoutComponent
                    bind:values={values}
                    bind:styles={styles}
                    bind:selectedComponentPosition={selectedComponentPosition}
                />
            {/if}
            {#if type === 'multiLayerComponent'}
                <EditMultiLayerComponent
                    bind:values={values}
                    bind:styles={styles}
                    bind:selectedComponentPosition={selectedComponentPosition}
                />
            {/if}
            {#if type === 'textComponent'}
                <EditTextComponent
                    bind:values={values}
                    bind:styles={styles}
                />
            {/if}
            {#if type === 'imageComponent'}
                <EditImageComponent
                    bind:values={values}
                    bind:styles={styles}
                />
            {/if}
            {#if type === 'sousligneComponent'}
                <EditSousLigneComponent
                    bind:values={values}
                    bind:styles={styles}
                />
            {/if}
        </div>
    {/if}
</div>

<!-- open if addUp is true -->
<AddElement
    addContent={addContent}
    position={position}      
    bind:open={addUp}
    addToLayout={''}
    copyValues={null}
    copyStyles={null}
    copyType={null}
/>
<!-- open if addDown is true -->
<AddElement 
    addContent={addContent}
    position={position + 1}      
    bind:open={addDown}
    addToLayout={''}
    copyValues={null}
    copyStyles={null}
    copyType={null}
/>

<style>
    .edit-component:hover {
        font-weight: bold;
    }
</style>