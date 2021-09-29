<script>
import { goto } from "$app/navigation";

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
            values.push({date: ''});
        }
    }

    const updateMovedArray = async(array) => {
        values[1].values = array;
        values = values;
        updateContent && updateContent();
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
            //date: {name:'date', values:[], styles:[]},
            url: {name: 'image', values:[], styles:[]},
            film: {name: 'film', values:[], styles:[]},
            debat: {name: 'debat', values:[], styles:[]},
            horaire: {name: 'horaire', values:[], styles:[]},
            filmId: filmCreatedId,
        });
        //values = values;
        updateContent && updateContent();
    };

</script>

<!-- <div class="row align-items-center">
    <div class='col text-start'>
        {#if admin}
            <input type='texte' bind:value={values[0].date} on:change={updateContent} placeholder="Date de l'événement"/>
        {:else}
            <h1><span class='text-white bg-primary text-center px-1'>
                {values[0].date ? values[0].date.toUpperCase() : 'Journée ?' }
            </span></h1>
        {/if}
    </div>
</div> -->
<div class='row mt-2'>
    {#if values[1] && values[1].values}
        {#each values[1].values as evenement, position }
            <div 
                class='col-12 my-4' 
                style="_height: 45vh; _width:auto;"
            >
                <MovingContent
                array={values[1].values} 
                position={position} 
                admin={admin} 
                updateMovedArray={updateMovedArray}
                >
                <div class='bg-white rounded-3 event-container'>
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
                        <div class={admin ? '' : 'middle'}>
                            <div class='p-3'>
                                <div class='horaire mb-5'>
                                    <TextComponent
                                    bind:values={evenement.horaire.values}
                                    bind:styles={evenement.horaire.styles}
                                    admin={admin}
                                    edit={edit}
                                    updateContent={updateContent}
                                    />
                                </div>
                                <div class='film mt-5'>
                                    <TextComponent
                                    bind:values={evenement.film.values}
                                    bind:styles={evenement.film.styles}
                                    admin={admin}
                                    edit={edit}
                                    updateContent={updateContent}
                                    />
                                </div>
                                <div class='debat my-1'>
                                    <TextComponent
                                    bind:values={evenement.debat.values}
                                    bind:styles={evenement.debat.styles}
                                    admin={admin}
                                    edit={edit}
                                    updateContent={updateContent}
                                    />
                                </div>
                            </div>
                            {#if !admin}
                                <button class='btn btn-light mt-5' style="width: 30vh; height:5vh;" on:click={() => goto(`/film/${evenement.filmId}`)}>En savoir plus</button>
                            {/if}
                        </div>
                    </div>
                </div>
                </MovingContent>
            </div>
        {/each}
    {/if}
    {#if admin && updateContent}
        <div class='row'>
            <div class='col text-center'>
                <button class='btn btn-primary text-center' on:click={addEventHandler}>Add Event</button>
            </div>
        </div>
    {/if}
</div>

<!-- <div class="row align-items-center">
    <div class='col text-start'>
        {#if admin}
            <input type='texte' bind:value={values[0].date} on:change={updateContent} placeholder="Date de l'événement"/>
        {:else}
            <h1><span class='text-white bg-primary text-center px-1'>
                {values[0].date ? values[0].date.toUpperCase() : 'Journée ?' }
            </span></h1>
        {/if}
    </div>
</div>
<div class='row mt-2'>
        {#if values[1] && values[1].values}
            {#each values[1].values as evenement, position }
                <div class='col-sm-12 col-md-6 my-4'>
                    <MovingContent
                    array={values[1].values} 
                    position={position} 
                    admin={admin} 
                    updateMovedArray={updateMovedArray}
                    >
                    <div class='p-3 bg-white rounded-3 event-container'>
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
                                    <button class='btn btn-secondary mt-3' on:click={() => goto(`/film/${evenement.filmId}`)}>Voir l'événement</button>
                                </div>
                            {/if}
                        </div>
                        <div class='film mt-1'>
                            <TextComponent
                                bind:values={evenement.film.values}
                                bind:styles={evenement.film.styles}
                                admin={admin}
                                edit={edit}
                                updateContent={updateContent}
                            />
                        </div>
                        <div class='debat my-1'>
                            <TextComponent
                                bind:values={evenement.debat.values}
                                bind:styles={evenement.debat.styles}
                                admin={admin}
                                edit={edit}
                                updateContent={updateContent}
                            />
                        </div>
                        <div class='horaire'>
                            <TextComponent
                                bind:values={evenement.horaire.values}
                                bind:styles={evenement.horaire.styles}
                                admin={admin}
                                edit={edit}
                                updateContent={updateContent}
                            />
                        </div>
                    </div>
                    </MovingContent>
                </div>
            {/each}
        {/if}
        {#if admin && updateContent}
            <div class='row'>
                <div class='col text-center'>
                    <button class='btn btn-primary text-center' on:click={addEventHandler}>Add Event</button>
                </div>
            </div>
        {/if}
</div> -->

<style>
    .image-container {
        position: relative;
        min-height: 30vh;
    }
    .image {
        opacity: 1;
        backface-visibility: hidden;
        max-width: 100%;
        height:auto;
    }
    .middle {
        transition: .5s ease;
        opacity: 1;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        -ms-transform: translate(-50%, -50%);
        text-align: center;
    }
    .event-container {
        -webkit-transform: scale(1);
	    transform: scale(1);
        transition: .5s ease;
    }
    .event-container:hover .middle {
        opacity: 1;
    }
    .event-container:hover {
        -webkit-transform: scale(1.13);
	    transform: scale(1.13);
        transition: .5s ease;
    }
    
</style>