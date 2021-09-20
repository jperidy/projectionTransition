<script>
    import ImageComponent from "./ImageComponent.svelte";
    import MovingContent from "./MovingContent.svelte";
    import TextComponent from "./TextComponent.svelte";

    export let values = [];
    export let styles = [];
    export let updateContent;
    export let edit = false;
    export let admin = false;

    styles;
    edit;

    $:{
        if (values.length === 0 ) {
            values.push({
                intro: {name: 'intro', values: [], styles: []},
            });
        }
    }

    const updateMovedArray = async(array) => {
        values[1].values = array;
        values = values;
        updateContent();
    };

    const addPhotoHandler = () => {
        if (values.length === 1) {
            values.push({values: []});
        }

        values[1].values.push({ 
            url: {name: 'image', values:[], styles:[]},
            nomPrenom: {name: 'nomPrenom', values:[], styles:[]},
            role: {name: 'role', values:[], styles:[]}
        });
        //values = values;
        updateContent();
    }

</script>

<style>
    .event-container {
        -webkit-transform: scale(1);
	    transform: scale(1);
        transition: .5s ease;
    }
    .event-container:hover {
        -webkit-transform: scale(1.13);
	    transform: scale(1.13);
        transition: .5s ease;
    }
</style>

<!-- Nom de l'équipe -->
<div class='row'>
    <div class='col'>
        <TextComponent
            bind:values = {values[0].intro.values}
            bind:styles = {values[0].intro.styles}
            updateContent={updateContent}
            admin={admin}
            edit={false}
        />
    </div>
</div>

<!-- vignettes equipe -->
{#if values[1] && values[1].values}
<div class='row my-1'>
    {#each values[1].values as personne, position}
        <div class='col-sm-6 col-md-4 my-1'>
            <div class='event-container p-2 mb-2 text-center'>
            <MovingContent
                array={values[1].values} 
                position={position} 
                admin={admin} 
                updateMovedArray={updateMovedArray}
            >
                <ImageComponent
                    bind:values={personne.url.values}
                    bind:styles={personne.url.styles}
                    admin={admin}
                    edit={false}
                    updateContent={updateContent}
                />
                <TextComponent
                    bind:values={personne.nomPrenom.values}
                    bind:styles={personne.nomPrenom.styles}
                    admin={admin}
                    edit={false}
                    updateContent={updateContent}
                />
                <TextComponent
                    bind:values={personne.role.values}
                    bind:styles={personne.role.styles}
                    admin={admin}
                    edit={false}
                    updateContent={updateContent}
                />
            </MovingContent>
            </div>
        </div>
    {/each}
</div>
{/if}
{#if admin}
    <button class='btn btn-primary' on:click={addPhotoHandler}> + Add</button>
{/if}
