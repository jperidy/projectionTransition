<script>
import { recursiveFilmDelete } from "../actions/filmActions";

import { recursiveDeleteAction } from "../utils/imageFunctions";


    import AddContent from "./AddContent.svelte";
    import DisplayCustomComponent from "./DisplayCustomComponent.svelte";

    export let values=[];
    export let styles=[];
    export let admin='false';
    export let edit='false';
    export let updateContent;
    styles;
    edit;

    const addToLayer = async(item, position) => {
        values = [...values, {...item, top:0, left:0}];
    };

    
    const handleMove = (e, pos) => {
        if (e.buttons) {
            let layer = document.querySelector('.element_0');
            let maxWidth = layer.offsetWidth;
            let maxHeight = layer.offsetHeight;
            values[pos].left = values[pos].left + 100 * e.movementX / maxWidth ;
            values[pos].top = values[pos].top + 100 * e.movementY / maxHeight ;
            //console.log(values[pos].left, values[pos].top);
            values = values;
        }
    };

    const handleRemove = async (pos) => {
        if (window.confirm('Attention cette action est irreversible !')) {

            // check and delete image file from server if necessary
            await recursiveDeleteAction(values[pos]);
            // check and delete video file from server if necessary
            await recursiveFilmDelete(values[pos]);

            values.splice(pos, 1);
            values = values;
        }
    }

    let top = 0;
    let left = 0;
    
</script>

    <div class="layer" style="position: relative;">
        {#each values as element, posElement}
            {#if element.type}
                {#if posElement}
                    <div 
                        class="element_N" 
                        style={`position:absolute;top:${element.top || '0'}%;left:${element.left || '0'}%;max-width:${100-element.left}%;max-height:${100-element.top}%;`}
                    >            
                        <DisplayCustomComponent
                            bind:value={element.value}
                            bind:values={element.values}
                            bind:styles={element.styles}
                            type={element.type}
                            updateContent={updateContent}
                            admin={admin}
                            edit={false}
                        />
                        {#if admin}
                            <div class="tools" style="position: relative;">
                                <button class='btn-danger' on:click={() => handleRemove(posElement)}><i class="bi bi-trash-fill"></i></button>
                                <button class='btn-primary' on:mousemove={(e) => handleMove(e, posElement)}><i class="bi bi-hand-index-thumb"></i></button>
                            </div> 
                        {/if}
                    </div>
                {:else}
                    <div 
                        class="element_0" 
                        style={`position:relative;`}
                    >            
                        <DisplayCustomComponent
                            bind:value={element.value}
                            bind:values={element.values}
                            bind:styles={element.styles}
                            type={element.type}
                            updateContent={updateContent}
                            admin={admin}
                            edit={false}
                        />
                    </div>
                {/if}
                
            {/if}
        {/each}
    </div>
    {#if admin}
        <div class="moving-container border-light rounded-3 my-1 py-1 px-3 bg-transparent shadow-lg text-center">
            <AddContent
                admin={admin}
                position={0}
                addToLayout={addToLayer}
            />
        </div>
    {/if}
        

<style>
    
</style>