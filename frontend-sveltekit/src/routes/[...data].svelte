<script context='module'>

    import { getContent } from '../actions/pagesActions';
    
    export const prerender = true;

    export async function load({page, fetch, session, context}){

        const params = { name: 'homeContent', city:'' }
        
        //console.log('page.params: ',page.params);
        let [name, city] = page.params.data.split('/');
        //console.log('name: ', name, 'city: ', city);
        params.name = name !== '' ? name : 'homeContent' ;
        params.city = city ? city : '';
        //console.log('name: ', name, 'city: ', city);

        //verify if login
        let redirection = page.path.split('/login');
        
        //const pageRequest = await getContent(params.name);
        let pageRequest = { content: { content: [], name: '' }, loading: true, message: '' };
        if (redirection.length === 1) {
            let pageName = page.path.substring(1).replace('/','-');
            pageName = pageName === '' ? 'homeContent' : pageName;
            pageRequest = await getContent(pageName);
        }

        return {props: {pageRequest, params, redirection}};
    }

</script>

<script>
    
    export let params;
    export let pageRequest;
    export let redirection;

    import { updateOrCreateContent } from '../actions/pagesActions';

    import CustomContainer from '../components/CustomContainer.svelte';
    import { Col, Row } from 'sveltestrap';
    import AdminButton from '../components/AdminButton.svelte';
    import MovingContent from '../components/MovingContent.svelte';
    import AddContent from '../components/AddContent.svelte';

    import { 
        userInfo, 
        //pageName, 
    } from '../store';
    
    import DisplayCustomComponent from '../components/DisplayCustomComponent.svelte';
    import Message from '../components/Message.svelte';
    import Loading from '../components/Loading.svelte';
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    
    // redirect to login page if requested
    onMount(() => {
        if (redirection.length > 1) {
                goto(`/login?redirection=${redirection[0]}`);
        }
    });

    $: isAuthenticate = $userInfo && $userInfo.profil === 'admin' ? true : false;
    
    let admin = false;

    const updateContent = async() => {
        pageRequest = await updateOrCreateContent(pageRequest.content);
    }

    const updateMovedArray = async(array) => {
        const tempPageRequest = pageRequest
        tempPageRequest.content.content = array;
        pageRequest = await updateOrCreateContent(pageRequest.content);
    }

    const addContent = async(item) => {

        const tempPageRequest = pageRequest;
        tempPageRequest.content.content = [item, ...tempPageRequest.content.content];
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
                {#if admin}
                    <AddContent admin={admin} addContent={addContent}/>
                {/if}
                {#if pageRequest.content && pageRequest.content.content}
                    {#each pageRequest.content.content as section, position}
                        <MovingContent 
                            array={pageRequest.content.content} 
                            position={position} 
                            admin={admin} 
                            updateMovedArray={updateMovedArray}
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
            </Col>
        </Row>
    </CustomContainer>
{/if}