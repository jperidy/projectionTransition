<script context='module'>

    import { getContent } from '../actions/pagesActions';
    
    export const prerender = true;

    export async function load({page, fetch, session, context}){

        const params = { name: 'homeContent', city:'' }
        
        let [name, city] = page.params.data.split('/');
        params.name = name !== '' ? name : 'homeContent' ;
        params.city = city ? city : '';

        //verify if login
        let redirection = page.path.split('/login');
        
        //const pageRequest = await getContent(params.name);
        let pageRequest = { content: { content: [], name: '' }, loading: true, message: '' };
        if (redirection.length === 1) {
            let pageName = page.path.substring(1).replace('/','-');
            pageName = pageName === '' ? 'homeContent' : pageName;
            pageRequest = await getContent(pageName);
        }

        return {props: {pageRequest, params, redirection, page}};
    }

</script>

<script>
    
    export let params;
    export let pageRequest;
    export let redirection;
    export let page;

    import { updateOrCreateContent } from '../actions/pagesActions';

    import CustomContainer from '../components/CustomContainer.svelte';
    import { Col, Row } from 'sveltestrap';
    import AdminButton from '../components/AdminButton.svelte';
    import MovingContent from '../components/MovingContent.svelte';
    import AddContent from '../components/AddContent.svelte';

    import config from '../config.json';
    const SITE_URL = config.SVELTE_ENV === 'dev' ? config.SITE_URL_DEV : config.SVELTE_ENV === 'preprod' ? config.SITE_URL_PREPROD : config.SVELTE_ENV === 'production' ? config.SITE_URL_PROD : config.SITE_URL_DEV;


    import { 
        userInfo, 
        //pageName, 
    } from '../store';
    
    import DisplayCustomComponent from '../components/DisplayCustomComponent.svelte';
    import Message from '../components/Message.svelte';
    import Loading from '../components/Loading.svelte';
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import { browser } from '$app/env';
    
    // redirect to login page if requested
    onMount(() => {
        if (redirection.length > 1) {
                goto(`/login?redirection=${redirection[0]}`);
        }
    });

    $: isAuthenticate = $userInfo && $userInfo.profil === 'admin' ? true : false;
    $: {
        if (browser && pageRequest.message && !isAuthenticate) {
            goto('/');
        }
    }

    let admin = false;

    const updateContent = async() => {
        //console.log(pageRequest.content)
        pageRequest = await updateOrCreateContent(pageRequest.content);
    }

    const updateMovedArray = async(array) => {
        const tempPageRequest = pageRequest
        tempPageRequest.content.content = array;
        pageRequest = await updateOrCreateContent(pageRequest.content);
    }

    const addContent = async(item, position) => {

        // const tempPageRequest = pageRequest;
        // tempPageRequest.content.content = [...tempPageRequest.content.content, item];

        //const tempPageRequest = pageRequest;
        pageRequest.content.content.splice(position, 0, item);

        pageRequest = await updateOrCreateContent(pageRequest.content);
    };

    //$: console.log(page);

</script>

<svelte:head>
    <title>Projection Transition {params.name}</title>
	<meta name='description' content={`Retrouvez toutes les informations sur le festival Projection Transition`} />
	<meta name='keywords' content="écologie, transition, projection transition, cinéma, shiftProject, cine-debat" />
	<meta property="og:title" content={`Projection Transition - Le festival ciné-débat pour la transition écologique`} />
	<meta property="og:type" content="website" />
	<meta property="og:image" content={`${SITE_URL}/images/og_logo.jpg`} />
	<meta property="og:image:width" content="800" />
	<meta property="og:image:height" content="400" />
	<meta property="og:url" content={`${SITE_URL}${page.path}`} />
	<meta property="og:locale" content="fr_FR" />
	<meta name="twitter:image" content={`${SITE_URL}/images/og_logo.jpg`} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:description" content="Retrouvez toutes les informations sur le festival Projection Transition" />
</svelte:head>

{#if isAuthenticate}
    <AdminButton 
        bind:admin={admin}
        isAuthenticate={isAuthenticate}
    />
{/if}

{#if pageRequest.message}
    <Message color='warning'>{pageRequest.message}</Message>
{/if}

{#if pageRequest.loading}
    <Loading color='secondary' number={3} />
{:else}
    <CustomContainer>
        <Row class='mt-3'>
            <Col>
                {#if pageRequest.content && pageRequest.content.content}
                    {#each pageRequest.content.content as section, position}
                        <MovingContent 
                            array={pageRequest.content.content} 
                            position={position} 
                            admin={admin} 
                            updateMovedArray={updateMovedArray}
                            addContent={addContent}
                        >
                            <DisplayCustomComponent 
                                bind:value={section.value}
                                bind:values={section.values}
                                bind:styles={section.styles}
                                type={section.type}
                                updateContent={updateContent}
                                admin={admin}
                                edit={false}
                                city={params.city}
                            />   
                        </MovingContent>
                    {/each}
                {/if}
                {#if admin && pageRequest.content && !pageRequest.content.content.length}
                    <div class="moving-container border-light rounded-3 mt-3 mb-1 p-3 bg-lavande shadow-lg text-center">
                        <AddContent admin={admin} addContent={addContent}/>
                    </div>
                {/if}
            </Col>
        </Row>
    </CustomContainer>
{/if}

<style>
    .moving-container {
        -webkit-transform: scale(1);
	    transform: scale(1);
        transition: .5s ease;
        border: dashed 1px;
    }
    .moving-container:hover {
        -webkit-transform: scale(1.03);
	    transform: scale(1.03);
        transition: .5s ease;
    }
</style>