<script>
    import { onMount } from "svelte";
    import { Button, Card, CardBody, CardFooter, CardHeader, CardSubtitle, CardText, CardTitle, Col, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "sveltestrap";
    import EditButton from "./EditButton.svelte";
    import TextComponent from "./TextComponent.svelte";
    import { articles } from '../store';
    import ImageComponent from "./ImageComponent.svelte";
    import { push } from "svelte-spa-router";

    export let values=[];
    export let styles=[];
    export let admin='false';
    export let edit='false';
    export let updateContent;

    let articlesToDisplay = [];
    let selectedArticle = 0;
    let write = false;

    //$: console.log('selectedArticle', selectedArticle);
    
    // onMount(() => {
    //     articlesToDisplay = $articles;
    //     console.log('articlesToDisplay', articlesToDisplay);
    // });

    if (articlesToDisplay.length === 0) {
        articlesToDisplay.push({
            title: {values:[], styles:[]},
            image: {values:[], styles:[]},
            contenu: {values:[], styles:[]},
            date: (new Date(Date.now())).toISOString().substring(0,10),
        });
    }

    //$:console.log('articles', $articles);

    if (values.length === 0) {
        values.push({ category:'', label:[], maxSize:'' });
    }
    if (styles.length === 0) {
        styles.push([]);
    }

    const toggle = () => {
        if (edit && updateContent) {
            updateContent();
        }
        edit = !edit;
    };

    const addArticle = () => {

        const newArticle = {
            title: {values:[], styles:[]},
            image: {values:[], styles:[]},
            contenu: {values:[], styles:[]},
            date: (new Date(Date.now())).toISOString().substring(0,10),
        }
        articlesToDisplay = [ ...articlesToDisplay, newArticle ];
        console.log('articlesToDisplay', articlesToDisplay)
    };

</script>

<div>
    <div class='row'>
        <div class='col'>

            <!-- {#if write}
                <TextComponent
                    bind:values={articlesToDisplay[selectedArticle].contenu.values}
                    bind:styles={articlesToDisplay[selectedArticle].contenu.styles}
                    edit={true}
                    admin={true}
                />
            {/if} -->

            {#if admin}
                <div class='row'>
                    <h3 class='pt-3'>Global configurations:</h3>
                    <div class='col'>
                        <Label for="category">Category: </Label>
                        <Input 
                            type='text' 
                            name='category' 
                            id='category' 
                            class='my-3' 
                            bind:value={values[0].category}
                        />
                    </div>

                    <div class='col'>
                        <Label for="maxSize">Max display articles </Label>
                        <Input 
                            type='number'
                            min={0}
                            step={1}
                            name='maxSize' 
                            id='maxSize' 
                            class='my-3' 
                            bind:value={values[0].maxSize}
                        />
                    </div>                        
                </div>

                <div class='row'>
                    <div class='col'>
                        <h3>Manage the articles</h3>
                        <button class='btn btn-primary' variant='primary' on:click={addArticle}>New Article</button>
                        <button class='btn btn-danger' variant='danger'>Remove Article</button>
                    </div>
                </div> 

                <div class='row'>
                    <div class='col'>
                        <h3 class='my-3'>Preview: </h3>
                    </div>
                </div>
            {/if}

            <div class='row mt-5 mb-3'>
                <div class='col'>
                    <TextComponent
                        bind:values={values[0].label}
                        bind:styles={styles[0]}
                        admin={admin}
                        edit={false}
                    />
                </div>

                <div class='col text-center'>
                    <input type='text' class='bg-secondary boder-none' placeholder="Rechercher un article">
                </div>
            </div>

            <div class='row mt-3'>
                {#each articlesToDisplay as article, index}
                    {#if article.title.values && article.image.values}
                        <div class='col-12 col-md-4 py-3'>
                            <div class="card bg-light border-light align-middle shadow-sm" style="border-radius: 10%;">
                                <div class="card-header border-0 bg-transparent" style="height: 5rem;">
                                    <h3 class='text-center text-primary'>
                                        <TextComponent 
                                            values={article.title.values}
                                            styles={article.title.styles}
                                            edit={false}
                                            admin={false}
                                        />
                                    </h3>
                                </div>
                                <div class="card-body text-center" style="height: 15rem">
                                    <p>Body</p>
                                    <ImageComponent
                                        values={article.image.values}
                                        styles={article.image.styles}
                                        edit={false}
                                        admin={false}
                                    />
                                </div>
                                <p class='mx-auto'>
                                    {article.date}
                                </p>

                                <div class="card-footer border-0 bg-transparent m-auto d-grid gap-1">
                                    <button 
                                        type='button' 
                                        class='btn btn-light text-secondary'
                                        on:click={() => push(`#/articles/${values[0].category}`)}
                                    ><i class="bi bi-eyeglasses"></i>
                                        {admin ? 'Editer' : "Lire l'article"}
                                    </button> 
                                </div>
                            </div>
                        </div>
                    {/if} 
                {/each}
            </div>

            {#if admin}                
                <EditButton
                    admin={admin}
                    updateContent={updateContent}
                    bind:edit={edit}
                />  
            {/if}
        </div>
    </div>
</div>