<script>
    import ImageComponent from "./ImageComponent.svelte";
    import MovingContent from "./MovingContent.svelte";
    import TextComponent from "./TextComponent.svelte";

    export let values=[];
    export let styles=[];
    export let admin='false';
    export let edit='false';
    export let updateContent;

    styles;

$: {
    if (values.length < 2) {
        values.push({name:'category', values:[], styles:[]});
        values.push({name:'partenaires', values:[{ 
            name: {name:'Partenaire name', values:[], styles:[]},
            url: {name: 'Partenaire image', values:[], styles:[]}
        }]});
    }
}

const addPartnerHandler = () => {
    values[1].values.push({ 
        name: {name:'Partenaire name', values:[], styles:[]},
        url: {name: 'Partenaire image', values:[], styles:[]}
    });
    values = values;
};

const updateMovedArray = async(array) => {
    values[1].values = array;
    values = values;
    updateContent();
};

</script>



<!-- categorie de partenaire -->
<div class='row mt-5'>
    <div class="col">
        <TextComponent
            bind:values={values[0].values}
            bind:styles={values[0].styles}
            admin={admin}
            edit={edit}
            updateContent={updateContent}
        />
    </div>
</div>

<!-- affichage des partenaire -->
<div class='moving-container row pt-3 gx-3'>
    {#each values[1].values as partenaire, position}
        <div class='col-sm-6 col-md-3 text-center'>
            <MovingContent 
                array={values[1].values} 
                position={position} 
                admin={admin} 
                updateMovedArray={updateMovedArray}
            >
                <div class='my-2'>
                    <ImageComponent 
                        bind:values={partenaire.url.values}
                        bind:styles={partenaire.url.styles}
                        edit={edit}
                        admin={admin}
                        updateContent={updateContent}
                    />
                    <TextComponent
                        bind:values={partenaire.name.values}
                        bind:styles={partenaire.name.styles}
                        edit={edit}
                        admin={admin}
                        updateContent={updateContent}
                    />    
                </div>    
            </MovingContent>
        </div>   
    {/each}
    <!-- on admin mode -->
    {#if admin}
    <!-- <div class='row my-5'> -->
        <div class='edition add-partenaire col-sm-6 col-md-3 text-center border-light rounded-3 mt-3 mb-1 p-3 bg-lavande shadow-lg'>
            <button class='btn btn-primary py-auto' on:click={addPartnerHandler}>Add a partner</button>
        </div>
    <!-- </div> -->
    {/if}
</div>

<style>
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
        width: 25vh;
    }
</style>