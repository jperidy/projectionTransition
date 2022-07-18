<script>
    import TextComponent from "./TextComponent.svelte";
    import ImageComponent from "./ImageComponent.svelte";
    import { createArticleRequest, deleteArticleRequest, getAllArticles } from "../actions/articleActions";
    import { articleAllRequest, articleCreateRequest, articleDeleteRequest } from "../store";
    import Loading from "./Loading.svelte";
    import Message from "./Message.svelte";
    import { recursiveDeleteAction } from '../utils/imageFunctions'
    import { goto } from "$app/navigation";

    export let values=[];
    export let styles=[];
    export let admin='false';
    export let edit='false';
    export let updateContent;

    edit;

    let keyword = "";

    $:{
        if (values.length === 0) {
            values.push({ category:'', label:[], maxSize:'' });
        }
    }
    $:{
        if (styles.length === 0) {
            styles.push([]);
        }
    }

    $: {
        getAllArticles(values[0].category, values[0].maxSize, '', keyword);
    }
    $: {
        if ($articleCreateRequest.success) {
            getAllArticles(values[0].category, values[0].maxSize, '', keyword);
        }
    }
    $: {
        if ($articleDeleteRequest.success) {
            getAllArticles(values[0].category, values[0].maxSize, '', keyword);
        }
    }

    const addArticle = () => {

        const newArticle = {
            title: {values:[], styles:[]},
            subTitle: {values:[], styles:[]},
            url: {values:[], styles:[]},
            content: {values:[], styles:[]},
            category: values[0].category,
            author: {values:[], styles:[]},
        }
        createArticleRequest(newArticle);
    };

</script>

<div>
    <div class='row'>
        <div class='col'>
            {#if $articleAllRequest.loading}
                <Loading color='secondary' number={3} />
            {/if}
            {#if $articleAllRequest.message}
                <Message color={$articleAllRequest.success ? 'success' : 'danger'}>{$articleAllRequest.message}</Message>
            {/if}
            {#if $articleCreateRequest.loading}
                <Loading color='secondary' number={3} />
            {/if}
            {#if $articleCreateRequest.message}
                <Message color={$articleCreateRequest.success ? 'success' : 'danger'}>{$articleCreateRequest.message}</Message>
            {/if}
            {#if $articleDeleteRequest.loading}
                <Loading color='secondary' number={3} />
            {/if}
            {#if $articleDeleteRequest.message}
                <Message color={$articleDeleteRequest.success ? 'success' : 'danger'}>{$articleDeleteRequest.message}</Message>
            {/if}

            {#if admin}

                <div class='row'>
                    <div class='col text-end'>
                        <button class='btn btn-primary m-3' on:click={updateContent}>Save</button>
                    </div>
                </div>

                <div class='row'>
                    <div class="row px-5">
                        <h3 class='pt-3'>Global configurations:</h3>
                        <div class='col'>
                            <label for="category">Category: </label>
                            <input 
                                type='text' 
                                name='category' 
                                id='category' 
                                class='my-3' 
                                bind:value={values[0].category}
                            />
                        </div>

                        <div class='col'>
                            <label for="maxSize">Max display articles </label>
                            <input 
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
                </div>

                <div class='row'>
                    <div class='col px-5'>
                        <h3>Manage the articles</h3>
                        <button class='btn btn-primary' variant='primary' on:click={addArticle}>New Article</button>
                    </div>
                </div> 

                <div class='row'>
                    <div class='col px-5'>
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
                    <input 
                        type='text' 
                        class='bg-secondary boder-none' 
                        placeholder="Rechercher un article"
                        bind:value={keyword}
                    >
                </div>
            </div>

            <div class='row mt-3'>

                {#if $articleAllRequest.articles}
                {#each $articleAllRequest.articles as article}
                    {#if article.title.values && article.url.values}
                        <div class='col-12 col-md-4 py-3'>
                            <div class="card bg-light border-light align-middle shadow-sm" style="border-radius: 10%;">
                                <div class="card-header border-0 bg-transparent" style="height: 5rem;">
                                    <h4 class='text-center text-primary my-auto'>
                                        <TextComponent 
                                            values={article.title.values}
                                            styles={article.title.styles}
                                            edit={false}
                                            admin={false}
                                            updateContent={null}

                                        />
                                    </h4>
                                </div>
                                <div class="card-body" style="height: 15rem">
                                    <ImageComponent
                                        values={article.url.values}
                                        styles={article.url.styles}
                                        edit={false}
                                        admin={false}
                                        updateContent={null}
                                    />
                                </div>

                                <p class='mx-auto'>Publié le : {article.createdAt.substring(0,10)} par {article.author && article.author.values.length && article.author.values[0].value}</p>

                                <div class="card-footer border-0 bg-transparent m-auto d-grid gap-1">
                                    <button 
                                        type='button' 
                                        class='btn btn-light text-secondary'
                                        on:click={() => goto(`/article/${values[0].category}/${article._id}`)}
                                    ><i class="bi bi-eyeglasses"></i>
                                        {admin ? 'Editer' : "Lire l'article"}
                                    </button> 
                                </div>
                            </div>
                            {#if admin}
                                <button class='btn btn-danger btn-block mt-3' on:click={() => {
                                    recursiveDeleteAction(article.url.values);
                                    deleteArticleRequest(article._id)
                                }}>Delete</button>
                            {/if}
                        </div>
                    {/if} 
                {/each}
                {/if}
            </div>
        </div>
    </div>
</div>