<script context='module'>

    import { getContent } from '../actions/pagesActions';
    
    export const prerender = true;

    export async function load({page}){

        const params = { name: 'homeContent', city:'' }
        
        let [name, city] = page.params.data.split('/');
        params.name = name !== '' ? name : 'homeContent' ;
        params.city = city ? city : '';

        //verify if login is requested
        let redirection = page.path.split('/login');

        //const pageRequest = await getContent(params.name);
        let pageRequest = { content: { content: [], name: '' }, loading: true, message: '' };
        if (redirection.length === 1) {
            let pageName = page.path.substring(1).replace('/','-');
            pageName = pageName === '' ? 'homeContent' : pageName;
            pageRequest = await getContent(pageName);
            return {status:200, props: {pageRequest, params, page}};
        } else {
            return { status: 307, redirect: `/login?redirection=${redirection[0]}`}
        }
    }

</script>

<script>
    
    export let params;
    export let pageRequest;
    export let page;

    //$: console.log('params', params);

    import { updateOrCreateContent } from '../actions/pagesActions';

    import CustomContainer from '../components/CustomContainer.svelte';
    import { Col, Row } from 'sveltestrap';
    import AdminButton from '../components/AdminButton.svelte';
    import MovingContent from '../components/MovingContent.svelte';
    import AddContent from '../components/AddContent.svelte';

    import config from '../config.json';
    const SITE_URL = config.SVELTE_ENV === 'dev' ? config.SITE_URL_DEV : config.SVELTE_ENV === 'preprod' ? config.SITE_URL_PREPROD : config.SVELTE_ENV === 'production' ? config.SITE_URL_PROD : config.SITE_URL_DEV;


    import { userInfo } from '../store';
    
    import DisplayCustomComponent from '../components/DisplayCustomComponent.svelte';
    import Message from '../components/Message.svelte';
    import Loading from '../components/Loading.svelte';
    import { goto } from '$app/navigation';
    import { browser } from '$app/env';
    import SeoComponent from '../components/SeoComponent.svelte';
    import { onMount } from 'svelte';
    import { get } from 'svelte/store';
    import { logout, verifyLocalToken } from '../actions/userActions';

    onMount(async() => {
        const userInfoStored = get(userInfo);
        
        if (userInfoStored && userInfoStored.token) {
            const tokenValid = await verifyLocalToken(userInfoStored.token);
            if (tokenValid.status === 'Error') {
                await logout();
            }
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
        pageRequest = await updateOrCreateContent(pageRequest.content);
    }

    const updateMovedArray = async(array) => {
        const tempPageRequest = pageRequest
        tempPageRequest.content.content = array;
        pageRequest = await updateOrCreateContent(pageRequest.content);
    }

    const addContent = async(item, position) => {
        pageRequest.content.content.splice(position, 0, item);
        pageRequest = await updateOrCreateContent(pageRequest.content);
    };
</script>

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

            <SeoComponent 
                pageContent={pageRequest.content}
                page={page}
                siteURL={SITE_URL}
                admin={admin}
                updateContent={updateContent}
            />
            
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