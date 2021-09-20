<script>
    import ImageComponent from "./ImageComponent.svelte";
    import TextComponent from "./TextComponent.svelte";

    export let values=[];
    export let styles=[];
    export let admin='false';
    export let edit='false';
    export let updateContent;

    styles;
    edit;

    $: {
        // if (values.length < 4) {
        //     values.push({name:'title', values:[], styles:[]});
        //     values.push({name:'image', values:[], styles:[]});
        //     values.push({name:'colonne-1', values:[], styles:[]});
        //     values.push({name:'colonne-2', values:[], styles:[]});
        // }
        if (values.length < 1) { values.push({name: 'titre', values:[], styles:[]});}
        if (values.length < 2) { values.push({name: 'image', values:[], styles:[]});}
        if (values.length < 3) { values.push({name: 'colonne-1', values:[], styles:[]});}
        if (values.length < 4) { values.push({name: 'colonne-2', values:[], styles:[]});}
        if (values.length < 5) { values.push({name: 'illustration', values:[], styles:[]});}
    }

</script>

<!-- section titre -->
<div class='row'>
    <div class='col'>
        <div style='padding-left: 5vh;'>
            <TextComponent 
                bind:values={values[0].values}
                bind:styles={values[0].styles}
                admin={admin}
                edit={false}
                updateContent={updateContent}
            />
            <div class='ligne-titre border-top border-5 border-primary'></div>
        </div>
    </div>
</div>

<!-- section contenu -->
<div class='row my-5 text-align-center'>
    <!-- illustration de l'édito -->
    <div class='col-sm-12 col-md-4 text-center pt-3'>
            <ImageComponent 
                bind:values={values[1].values}
                bind:styles={values[1].styles}
                admin={admin}
                edit={false}
                updateContent={updateContent}
            />
            <TextComponent 
                bind:values={values[4].values}
                bind:styles={values[4].styles}
                admin={admin}
                edit={false}
                updateContent={updateContent}
            />
    </div>

    <!-- première colonne -->
    <div class='col-sm-12 col-md-4'> 
        <TextComponent 
            bind:values={values[2].values}
            bind:styles={values[2].styles}
            admin={admin}
            edit={false}
            updateContent={updateContent}
        />
    </div>

    <!-- deuxième colonne -->
    <div class='col-sm-12 col-md-4'> 
        <TextComponent 
            bind:values={values[3].values}
            bind:styles={values[3].styles}
            admin={admin}
            edit={false}
            updateContent={updateContent}
        />
    </div>
    
</div>

<style>
    .ligne-titre {
        max-width: 10vh;
    }
</style>