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

<div class='row mt-2 px-2'>
    {#if values[1] && values[1].values}
        {#each values[1].values as evenement, position }
            <div class='col-12 my-4'>
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
                            <div class=''>
                                <div class='horaire'>
                                    <TextComponent
                                    bind:values={evenement.horaire.values}
                                    bind:styles={evenement.horaire.styles}
                                    admin={admin}
                                    edit={edit}
                                    updateContent={updateContent}
                                    />
                                </div>
                                <div class='film px-5'>
                                    <TextComponent
                                    bind:values={evenement.film.values}
                                    bind:styles={evenement.film.styles}
                                    admin={admin}
                                    edit={edit}
                                    updateContent={updateContent}
                                    />
                                </div>
                                <div class='debat px-3'>
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
                                <button class='info btn btn-dark mx-auto text-center text-light p-0 m-0 rounded-0' on:click={() => goto(`/film/${evenement.filmId}`)}><strong>EN SAVOIR PLUS</strong></button>
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
        height: 100%;
        width: 100%;
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
    .horaire {
        position: absolute;
        top: 12%;
        left: 17%;
    }
    .film {
        position: absolute;
        top: 40%;
        width: 100%;
    }
    .debat {
        position: absolute;
        top: 55%;
        width: 100%;
    }
    .info {
        position: absolute;
        top: 88%;
        left: 5%;
        width: 90%;
        height: 10%;
    }
    
</style>