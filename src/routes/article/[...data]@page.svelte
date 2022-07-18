<script context='module'>
    
    import { getArticle } from '../../actions/articleActions';
    import { getSeo } from '../../actions/seoActions';
    
    export async function load({page, fetch, session, context}){
        
        const params = { id:null, category:null };
        let [category, id] = page.params.data.split('/');
        params.category = category ? category : '';
        params.id = id ? id : '';
        
        //verify if login
        let redirection = page.path.split('/login');
        
        //load default seo informations
        const { seo } = await getSeo();

        //const pageRequest = await getContent(params.name);
        let articleRequest = { content: { content: [], name: '' }, loading: true, message: '' };
        if (redirection.length === 1) {
            let pageName = page.path.substring(1).replace('/','-');
            articleRequest = await getArticle(id);
        }

        return {props: {articleRequest, params, redirection, defaultSeo: seo}};
    }

</script>

<script>
    
    import AdminButton from '../../components/AdminButton.svelte';
    import ImageComponent from '../../components/ImageComponent.svelte';
    import TextComponent from '../../components/TextComponent.svelte';
    import { updateArticleRequest } from '../../actions/articleActions';

    import { userInfo, articleUpdateRequest } from '../../store';
    import Message from '../../components/Message.svelte';
    import Loading from '../../components/Loading.svelte';
    import CustomContainer from '../../components/CustomContainer.svelte';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';

    //export let params = { category: 'actualite', id: null};
    export let params;
    export let articleRequest;
    export let redirection;
    export let defaultSeo;
    defaultSeo ; // to use with SeoComponent if used 

    // redirect to login page if requested
    onMount(() => {
        if (redirection.length > 1) {
                goto(`/login?redirection=${redirection[0]}`);
        }
    });


    $: category = params.category;
    $: id = params.id;
    $: isAuthenticate = $userInfo && $userInfo.profil === 'admin' ? true : false;
    
    let admin = false;
    let edit = false;

    // $: {
    //     getArticle(id);
    // }

    const updateArticle = () => {
        updateArticleRequest(id, articleRequest.article);
    }

</script>

{#if isAuthenticate}
    <AdminButton
        bind:admin={admin}
        isAuthenticate={isAuthenticate}
    />

    {#if articleRequest.message}
        <Message color='warning'>{articleRequest.message}</Message>
    {/if}
    
    {#if articleRequest.loading}
        <Loading color='secondary' number={3} />
    {/if}

    {#if $articleUpdateRequest.message}
        <Message color={$articleUpdateRequest.success ? 'success' : 'error'}>{$articleUpdateRequest.message}</Message>
    {/if}

    {#if $articleUpdateRequest.loading}
        <Loading color='secondary' number={3} />
    {/if}

{/if}

{#if articleRequest.article}
    <CustomContainer>
        <div class='row align-items-center'>
            <div class='col-md-3 col-sm-12'>
                <ImageComponent
                    bind:values={articleRequest.article.url.values}
                    bind:styles={articleRequest.article.url.styles}
                    admin={admin}
                    edit={edit}
                    updateContent={updateArticle}
                />
            </div>

            <div class='col-md-9 col-sm-12'>
                <h1>
                    <TextComponent
                        bind:values={articleRequest.article.title.values}
                        bind:styles={articleRequest.article.title.styles}
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
                            bind:values={articleRequest.article.author.values}
                            bind:styles={articleRequest.article.author.styles}
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
                            <input type='date' bind:value={articleRequest.article.createdAt} on:change={updateArticle} />
                        {:else}
                            <p>{articleRequest.article.createdAt.toString().substring(0,10)}</p>
                        {/if}
                    </div>
                </div>
            </div>
        </div>

        <div class='row'>
            <div class='col mx-5'>
                <TextComponent 
                    bind:values={articleRequest.article.subTitle.values}
                    bind:styles={articleRequest.article.subTitle.styles}
                    admin={admin}
                    edit={edit}
                    updateContent={updateArticle}
                />
            </div>
        </div>

        <div class='row'>
            <div class='col'>
                <TextComponent 
                    bind:values={articleRequest.article.content.values}
                    bind:styles={articleRequest.article.content.styles}
                    admin={admin}
                    edit={edit}
                    updateContent={updateArticle}
                />
            </div>
        </div>
        
    </CustomContainer>
{/if}
