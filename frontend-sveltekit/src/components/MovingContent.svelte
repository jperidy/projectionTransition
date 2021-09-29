<script>
    import { recursiveFilmDelete } from "../actions/filmActions";

    import { recursiveDeleteAction } from '../utils/imageFunctions'
    import AddElement from "./AddElement.svelte";
    
    export let array = [];
    export let position = 0;
    export let admin = false;
    export let updateMovedArray;
    export let addContent;

    let addUp = false;
    let addDown = false;

    const arrayMove = (arr, fromIndex, toIndex) => {
        var element = arr[fromIndex];
        arr.splice(fromIndex, 1);
        arr.splice(toIndex, 0, element);
        return arr;
    }

    const upAction = () => {
        if (position > 0) {
            array = arrayMove(array, position, position - 1);
        }
        updateMovedArray(array);
    };

    const downAction = () => {
        if (position < array.length - 1) {
            array = arrayMove(array, position, position + 1);
        }
        updateMovedArray(array); 
    };


    const deleteAction = async() => {

        // Delete any tied media (image and video)

        if (window.confirm('Attention cette action est irreversible !')) {
            const values = array[position];
            await recursiveDeleteAction(values);
    
            // Delete any film tied to object
            await recursiveFilmDelete(array[position]);
    
            array.splice(position, 1);
            updateMovedArray(array);
        }
    };

</script>

<style>
    .moving-container {
        -webkit-transform: scale(1);
	    transform: scale(1);
        transition: .5s ease;
        border: dashed 1px;
    }
    .moving-container:hover {
        -webkit-transform: scale(1.03);
	    transform: scale(1.03);
        transition: .5s ease;
    }
    .edition {
        -webkit-transform: scale(0);
	    transform: scale(0);
        transition: .5s ease;
        width: 0px;
    }
    .moving-container:hover .edition {
        -webkit-transform: scale(1);
	    transform: scale(1);
        transition: .5s ease;
        width: 5vh;
    }
</style>


{#if admin}

    {#if addContent}
        <AddElement 
            addContent={addContent}
            position={position}      
            bind:open={addUp}
            addToLayout={''}
            copyValues={array[position].values}
            copyStyles={array[position].styles}
            copyType={array[position].type}
        />
        <AddElement 
            addContent={addContent}
            position={position + 1}      
            bind:open={addDown}
            addToLayout={''}
            copyValues={array[position].values}
            copyStyles={array[position].styles}
            copyType={array[position].type}
        />
    {/if}

    <div class='moving-container border-light rounded-3 mt-3 mb-1 p-3 bg-lavande shadow-lg'>
        <div class='row align-items-center'>
            <div class="col">
                <slot></slot>
            </div>
            <div class='edition text-center'>
                <div class="d-grid gap-2">
                    {#if addContent}
                    <button class='btn btn-primary btn-sm' on:click={() => addUp = true}><i class="bi bi-plus-circle-dotted"></i></button>
                    {/if}
                    <button class='btn btn-secondary btn-sm' on:click={() => upAction()}><i class='bi bi-caret-up'/></button>
                    <button class='btn btn-danger btn-sm' on:click={async() => await deleteAction()}><i class='bi bi-trash'/></button>
                    <button class='btn btn-secondary btn-sm' on:click={() => downAction()}><i class='bi bi-caret-down'/></button>
                    {#if addContent}
                    <button class='btn btn-primary btn-sm' on:click={() => addDown = true}><i class="bi bi-plus-circle-dotted"></i></button>
                    {/if}
                </div>
            </div>
        </div>
    </div>
{:else}
    <span><slot></slot></span>
{/if}
