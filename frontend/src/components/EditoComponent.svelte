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

    if (values.length === 0) {
        values.push({name:'title', values:[], styles:[]});
        values.push({name:'image', values:[], styles:[]});
        values.push({name:'colonne-1', values:[], styles:[]});
        values.push({name:'colonne-2', values:[], styles:[]});
    }

</script>

<!-- section titre -->
<div class='row mt-5'>
    <div class='col'>
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

<!-- section contenu -->
<div class='row my-5'>
    <!-- illustration de l'édito -->
    <div class='col-sm-12 col-md-4'>
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

        <div class='col my-3'>
            <Col>
                <Row class='align-items-center'>
                    <!-- <Col sm={12} md={8}>
                        <TextComponent 
                            bind:values={values[0].values}
                            bind:styles={values[0].styles}
                            admin={admin}
                            edit={false}
                            updateContent={updateContent}
                        />
                        <div class='ligne-titre border-top border-5 border-primary'></div>
                    </Col> -->
                    <!-- <Col sm={12} md={4} class='px-5'>
                        <ImageComponent 
                            bind:values={values[1].values}
                            bind:styles={values[1].styles}
                            admin={admin}
                            edit={false}
                        />
                    </Col> -->
                </Row>
            </Col>
        </div>
        <!-- <Row class='px-5 text-primary font-italic'>
            <TextComponent 
                bind:values={values[2].values}
                bind:styles={values[2].styles}
                admin={admin}
                edit={false}
                updateContent={updateContent}
            />
        </Row> -->
        <!-- <Row class='my-3'>
            <TextComponent 
                bind:values={values[3].values}
                bind:styles={values[3].styles}
                admin={admin}
                edit={false}
                updateContent={updateContent}
            />
        </Row> -->

    
</div>

<style>
    .ligne-titre {
        max-width: 10vh;
    }
</style>