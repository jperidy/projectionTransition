<script>
    import AddElement from "../AddElement.svelte";
    import DisplayEditMenu from "./DisplayEditMenu.svelte";

    export let values=[];
    export let styles=[]; styles;
    export let selectedComponentPosition;

    const modalId = 'editMultiLayerComponentModal';

    const addALayer = async(item) => {
        values = [...values, {...item, top:0, left:0, width: ""}];
    };

    const handleMove = (e, pos) => {
        if (e.buttons) {
            if (!values[pos].left) values[pos].left = 0;
            if (!values[pos].top) values[pos].top = 0;

            let layer = document.querySelector('.element_0');
            let maxWidth = layer.offsetWidth;
            let maxHeight = layer.offsetHeight;
            values[pos].left = values[pos].left + 100 * e.movementX / maxWidth ;
            values[pos].top = values[pos].top + 100 * e.movementY / maxHeight ;
            values = values;
        }
    };

</script>

{#each values as element, posElement}
    {#if element.type}
        <div class="column-container border-top border-start border-2 rounded mt-3 pt-3 ps-1" on:mouseenter={() => selectedComponentPosition = posElement}>
            <div class="colum-index bg-dark text-light d-flex justify-content-center align-items-center">{posElement + 1}</div>
            <DisplayEditMenu
                type={element.type}
                bind:values={element.values}
                bind:styles={element.styles}
                bind:pageContent={values}
                position={posElement}
                displayInFrame={false}
            />
            {#if posElement > 0}
                <div >
                    <button class="btn btn-light shadow rounded-3 my-3" style="min-height: 5rem; width: 100%;"on:mousemove={(e) => handleMove(e, posElement)}><i class="bi bi-arrows-move" ></i></button>
                </div>
                <div class='d-flex align-items-center'>
                    <label class="mx-2" for="floating-width">Width (%) :</label>
                    <input type="number" class="form-control" style="width: auto;" id="floating-width" bind:value={element.width} min="0" max="100">
                </div>
            {/if}
        </div>
    {/if}
{/each}

<div class="moving-container border-light rounded-3 my-1 py-1 px-3 bg-transparent shadow-lg text-center">
    <div class='row my-1 py-1'>
        <div class='col'>
            <button 
            color="primary" 
            class='my-1 p-2' 
            data-bs-toggle="modal"
            data-bs-target={`#${modalId}`}
            >Add an element</button>
        </div>
    </div>
</div>

<AddElement
    position={0}      
    action={addALayer}
    modalId={modalId}
/>

<style>
    .column-container{
        position: relative;
        margin-top: 2rem;
    }
    .colum-index {
        position: absolute;
        top:-0.8rem;
        left:-0.8rem;
        width: 1.6rem;
        height: 1.6rem;
    }
</style>