<script>
import { push } from "svelte-spa-router";

import { createFilmRequest } from "../actions/filmActions";

    import ImageComponent from "./ImageComponent.svelte";
    import MovingContent from "./MovingContent.svelte";
    import TextComponent from "./TextComponent.svelte";
    export let values=[];
    export let styles=[];
    export let admin='false';
    export let edit='false';
    export let updateContent;
    export let city='';

    styles;

    $:{
        if (values.length === 0 ) {
            values.push({title: {values:[], styles:[]}});
        }
    }

    const updateMovedArray = async(array) => {
        values[1].values = array;
        values = values;
        updateContent();
    };

    const addEventHandler = async () => {
        if (values.length === 1) {
            values.push({values: []});
        }
        if (!values[1].values) {
            console.log(values);
        }
        const filmCreatedId = await createFilmRequest(city);

        values[1].values.push({ 
            date: {name:'date', values:[], styles:[]},
            url: {name: 'image', values:[], styles:[]},
            description: {name: 'description', values:[], styles:[]},
            filmId: filmCreatedId,
        });
        values = values;
        updateContent();
    };

</script>

<div class="row align-items-center">
    <div class="col-8">
        <TextComponent
            bind:values={values[0].title.values}
            bind:styles={values[0].title.styles}
            admin={admin}
            edit={edit}
            updateContent={updateContent}
        />
    </div>
    <div class="col-4 text-end">
        <h3><span class="bg-primary text-white px-2">{city.toUpperCase()}</span></h3>
    </div>
</div>
<div class='row mt-5'>
    {#if values[1] && values[1].values}
        {#each values[1].values as evenement, position }
            <div class='col-sm-12 col-md-4 mt-1'>
                <MovingContent
                    array={values[1].values} 
                    position={position} 
                    admin={admin} 
                    updateMovedArray={updateMovedArray}
                >
                    <div class='mb-3'>
                        <TextComponent
                            bind:values={evenement.date.values}
                            bind:styles={evenement.date.styles}
                            admin={admin}
                            edit={edit}
                            updateContent={updateContent}
                        />
                    </div>
                    <div class='image-container'>
                        <div class="image my-auto">
                            <ImageComponent
                                bind:values={evenement.url.values}
                                bind:styles={evenement.url.styles}
                                admin={admin}
                                edit={edit}
                                updateContent={updateContent}
                            />
                        </div>
                        {#if !admin}
                            <div class="middle">
                                <button class='btn btn-secondary mt-3' on:click={() => push(`#/film/${evenement.filmId}`)}>Voir l'événement</button>
                            </div>
                        {/if}
                    </div>

                    <div class='ligne-titre border-top border-2 border-primary my-2'></div>
                    <TextComponent
                        bind:values={evenement.description.values}
                        bind:styles={evenement.description.styles}
                        admin={admin}
                        edit={edit}
                        updateContent={updateContent}
                    />
                    <div class="text-center">
                    </div>
                </MovingContent>
            </div>
        {/each}
    {/if}
    {#if admin}
        <div class='row'>
            <div class='col text-center'>
                <button class='btn btn-primary text-center' on:click={addEventHandler}>Add Event</button>
            </div>
        </div>
    {/if}
</div>

<style>
    .image-container{
        position: relative;
    }
    .image {
        transition: .5s ease;
        opacity: 1;
        backface-visibility: hidden;
    }
    .middle {
        transition: .5s ease;
        opacity: 0;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        -ms-transform: translate(-50%, -50%);
        text-align: center;
    }
    .image-container:hover .image {
        -webkit-transform: scale(1.2);
	    transform: scale(1.2);
    }
    .image-container:hover .middle {
        opacity: 1;
    }
    
</style>