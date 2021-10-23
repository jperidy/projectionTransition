<script>
    import { copyComponent } from "../store";

    import { recursiveFilmDelete } from "../actions/filmActions";

    import { recursiveDeleteAction, recursiveDeleteStyle } from '../utils/imageFunctions'
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

        if (window.confirm('Attention cette action est irreversible !')) {
            const values = array[position];
            const copyValue = JSON.parse(JSON.stringify(values));
            console.log(values === copyValue);
            console.log(copyValue);

            // Delete any image tied to object
            await recursiveDeleteAction(values);
    
            // Delete any film tied to object
            await recursiveFilmDelete(array[position]);

            // Delte any image tied to style
            await recursiveDeleteStyle(copyValue);
    
            array.splice(position, 1);
            updateMovedArray(array);
        }
    };

    const copyAction = () => {
        localStorage.setItem('copyComponent', JSON.stringify(array[position]));
        copyComponent.set(array[position]);
        // localStorage.setItem('copyComponentValues', JSON.stringify(array[position].values));
        // localStorage.setItem('copyComponentStyles', JSON.stringify(array[position].styles));
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
        -webkit-transform: scale(1);
	    transform: scale(1);
        transition: .5s ease;
    }
    .edition {
        -webkit-transform: scale(0);
	    transform: scale(0);
        transition: .5s ease;
        width: 0px;
    }
    .moving-container:hover .edition {
        -webkit-transform: scale(.7);
	    transform: scale(.7) translateX(-3rem);
        transition: .5s ease;
        width: 5vh;
    }
</style>


{#if admin}

    {#if addContent}
        <!-- open if addUp is true -->
        <AddElement 
            addContent={addContent}
            position={position}      
            bind:open={addUp}
            addToLayout={''}
            copyValues={array[position].values}
            copyStyles={array[position].styles}
            copyType={array[position].type}
        />
        <!-- open if addDown is true -->
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

    <div class='moving-container border-light rounded-3 my-1 mx-1 p-1 bg-transparent shadow-lg'>
        <div class='row align-items-center'>
            <div class="col">
                <slot></slot>
            </div>
            <div class='edition text-center'>
                <div class="d-grid gap-2">
                    {#if addContent}
                    <button class='btn btn-primary btn-sm' on:click={() => addUp = true} data-bs-toggle="tooltip" data-bs-placement="left" title="Ajouter au dessus"><i class="bi bi-plus-circle-dotted"></i></button>
                    {/if}
                    <button class='btn btn-secondary btn-sm' on:click={() => upAction()} data-bs-toggle="tooltip" data-bs-placement="left" title="Déplacer vers le haut"><i class='bi bi-caret-up'/></button>
                    <span class='d-flex gap-2'>
                        <button class='btn btn-danger btn-sm' on:click={async() => await deleteAction()} data-bs-toggle="tooltip" data-bs-placement="left" title="Supprimer"><i class='bi bi-trash'/></button>
                        <button class='btn btn-info btn-sm' on:click={async() => copyAction()} data-bs-toggle="tooltip" data-bs-placement="left" title="Copier"><i class='bi bi-files'/></button>
                    </span>
                    <button class='btn btn-secondary btn-sm' on:click={() => downAction()} data-bs-toggle="tooltip" data-bs-placement="left" title="Déplacer vers le bas"><i class='bi bi-caret-down'/></button>
                    {#if addContent}
                    <button class='btn btn-primary btn-sm' on:click={() => addDown = true} data-bs-toggle="tooltip" data-bs-placement="left" title="Ajouter en dessous"><i class="bi bi-plus-circle-dotted"></i></button>
                    {/if}
                </div>
            </div>
        </div>
    </div>
{:else}
    <slot></slot>
{/if}
