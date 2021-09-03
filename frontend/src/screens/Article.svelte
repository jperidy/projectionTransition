<script>
    
    import AdminButton from '../components/AdminButton.svelte';
    import ImageComponent from '../components/ImageComponent.svelte';
    import TextComponent from '../components/TextComponent.svelte';
    import { getArticle, updateArticleRequest } from '../actions/articleActions'

    import { userInfo, articleRequest, articleUpdateRequest } from '../store';
    import Message from '../components/Message.svelte';
    import Loading from '../components/Loading.svelte';
    import CustomContainer from '../components/CustomContainer.svelte';
    import { Input } from 'sveltestrap';

    export let params = { category: 'actualite', id: null};
    $: category = params.category;
    $: id = params.id;
    $: isAuthenticate = $userInfo && $userInfo.profil === 'admin' ? true : false;
    
    let admin = false;
    let edit = false;

    $: {
        getArticle(id);
    }

    const updateArticle = () => {
        console.log('create here function to create or update the article');
        updateArticleRequest(id, $articleRequest.article);
    }

</script>

{#if isAuthenticate}
    <AdminButton
        bind:admin={admin}
        isAuthenticate={isAuthenticate}
    />

    {#if $articleRequest.message}
        <Message color='warning'>{$articleRequest.message}</Message>
    {/if}
    
    {#if $articleRequest.loading}
        <Loading color='secondary' number={3} />
    {/if}

    {#if $articleUpdateRequest.message}
        <Message color={$articleUpdateRequest.success ? 'success' : 'error'}>{$articleUpdateRequest.message}</Message>
    {/if}

    {#if $articleUpdateRequest.loading}
        <Loading color='secondary' number={3} />
    {/if}

{/if}

{#if $articleRequest.article}
    <CustomContainer>
        <div class='row align-items-center'>
            <div class='col-md-3 col-sm-12'>
                <ImageComponent
                    bind:values={$articleRequest.article.url.values}
                    bind:styles={$articleRequest.article.url.styles}
                    admin={admin}
                    edit={edit}
                    updateContent={updateArticle}
                />
            </div>

            <div class='col-md-9 col-sm-12'>
                <h1>
                    <TextComponent
                        bind:values={$articleRequest.article.title.values}
                        bind:styles={$articleRequest.article.title.styles}
                        admin={admin}
                        edit={edit}
                        updateContent={updateArticle}
                    />
                </h1>
                <div class='row'>
                    <div class='col text-end'>
                        Rédigé par : 
                    </div>
                    <div class='col text-start'>
                        <TextComponent
                            bind:values={$articleRequest.article.author.values}
                            bind:styles={$articleRequest.article.author.styles}
                            admin={admin}
                            edit={edit}
                            updateContent={updateArticle}
                        />
                    </div>
                    <div class='col text-end'>
                        Publié le : 
                    </div>
                    <div class='col text-start'>
                        {#if admin}
                            <Input type='date' bind:value={$articleRequest.article.createdAt} on:change={updateArticle} />
                        {:else}
                            <p>{$articleRequest.article.createdAt.toString().substring(0,10)}</p>
                        {/if}
                    </div>
                </div>
            </div>
        </div>

        <div class='row'>
            <div class='col mx-5'>
                <TextComponent 
                    bind:values={$articleRequest.article.subTitle.values}
                    bind:styles={$articleRequest.article.subTitle.styles}
                    admin={admin}
                    edit={edit}
                    updateContent={updateArticle}
                />
            </div>
        </div>

        <div class='row'>
            <div class='col'>
                <TextComponent 
                    bind:values={$articleRequest.article.content.values}
                    bind:styles={$articleRequest.article.content.styles}
                    admin={admin}
                    edit={edit}
                    updateContent={updateArticle}
                />
            </div>
        </div>
    </CustomContainer>
{/if}
