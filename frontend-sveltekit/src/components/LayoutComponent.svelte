<script>

    import { onMount } from "svelte";
    import AddContent from "./AddContent.svelte";
    import DisplayCustomComponent from "./DisplayCustomComponent.svelte";
    import EditButton from "./EditButton.svelte";
    import MovingContent from "./MovingContent.svelte";
    export let values=[];
    export let styles=[];
    export let admin='false';
    export let edit='false';
    export let updateContent;

    styles;

    let columnNumber = 1;

    $:{
        if (values.length === 0) {
            values.push({type:'layout', values:[]});
        }
    };

    onMount(() => {
        columnNumber = values.length;
    });

    $: columnChangeHandler = (number) => {

        if (number > values.length && number >=1) {
            values.push({type:'layout', values:[]})
        } else {
            values.pop();
        }
        values = values;
        updateContent && updateContent();

    };

    const addToLayout = async(item, position) => {
        //values[position] = item;
        values[position].values.push(item);
        updateContent && await updateContent();
    };

    const updateMovedArray = async(array) => {
        values = array;
        columnNumber = values.length;
        updateContent && await updateContent();
    }

</script>

<style>
    .content-container{
        position: relative;
    }
    .content {
        opacity: 1;
        width: 100%;
        height: 100%;
        backface-visibility: hidden;
    }
    .middle {
        transition: .5s ease;
        opacity: 0.5;
        position: absolute;
        top: 10%;
        left: 50%;
        transform: translate(-50%, -50%);
        -ms-transform: translate(-50%, -50%);
        text-align: center;
        z-index: 1000;
    }
    .content-container:hover .middle {
        opacity: 1;
    }
    
</style>

<div class='content-container'>

    {#if admin}
        <div class='middle'>
        <EditButton
            admin={admin}
            updateContent={updateContent}
            bind:edit={edit}
        />
        </div>
    {/if}

    {#if edit}
        <div class="row align-items-center">
            <div class="col">
                
                <label for="input-columns" class="form-label">Nombre de colonnes *</label>
                <input type="number" class="form-control" id="input-columns" 
                    aria-describedby="nombre de colonnes" 
                    placeholder="Nombre de colonnes"
                    min={1}
                    max={6}
                    required
                    bind:value={columnNumber}
                    on:change={(e) => columnChangeHandler(e.target.value)}
                />

            </div>
        </div>
    {/if}
    
    <div class="row content">
        {#each values as column, position}
            <div class="col" style="min-height: 5vh;">
                <MovingContent 
                    array={values} 
                    position={position} 
                    admin={admin} 
                    updateMovedArray={updateMovedArray}
                >
                
                {#each column.values as content, pos}
                    <MovingContent 
                        array={column.values} 
                        position={pos} 
                        admin={admin} 
                        updateMovedArray={async (array) => {
                            values[position].values = array;
                            updateContent && await updateContent();
                        }}
                    >
                        <DisplayCustomComponent 
                            bind:value={content.value}
                            bind:values={content.values}
                            bind:styles={content.styles}
                            type={content.type}
                            updateContent={updateContent}
                            admin={admin}
                            edit={false}
                            city={""}
                        />
                    </MovingContent>
                {/each}

                {#if edit}
                    <!-- <AddContent admin={admin} addContent={addContent}/> -->
                    <AddContent admin={admin} position={position} addToLayout={addToLayout} />
                {/if}
                    
                </MovingContent>
            </div>
        {/each}
    </div>

</div>