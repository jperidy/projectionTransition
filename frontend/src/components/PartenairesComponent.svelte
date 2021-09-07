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

<!-- on admin mode -->
{#if admin}
    <div class='row my-5'>
        <div class='col text-center'>
            <button class='btn btn-primary' on:click={addPartnerHandler}>Add a partner</button>
        </div>
    </div>
{/if}

<!-- categorie de partenaire -->
<div class='row mt-5'>
    <TextComponent
        bind:values={values[0].values}
        bind:styles={values[0].styles}
        admin={admin}
        edit={edit}
        updateContent={updateContent}
    />
</div>

<!-- affichage des partenaire -->
<div class='row pt-3'>
    {#each values[1].values as partenaire, position}
        <div class='col-sm-6 col-md-3'>
            <MovingContent 
                array={values[1].values} 
                position={position} 
                admin={admin} 
                updateMovedArray={updateMovedArray}
            > 
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
            </MovingContent>
        </div>   
    {/each}
</div>