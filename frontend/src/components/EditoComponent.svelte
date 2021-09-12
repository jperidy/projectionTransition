<script>
    import { Col, Row } from "sveltestrap";

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
        if (values.length < 4) {
            values.push({name:'title', values:[], styles:[]});
            values.push({name:'image', values:[], styles:[]});
            values.push({name:'colonne-1', values:[], styles:[]});
            values.push({name:'colonne-2', values:[], styles:[]});
        }
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
<div class='row my-5'>
    <!-- illustration de l'édito -->
    <div class='col-sm-12 col-md-4 text-center' style="margin-top:5vh;">
        <ImageComponent 
            bind:values={values[1].values}
            bind:styles={values[1].styles}
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