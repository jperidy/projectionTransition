<script>
    import CustomContainer from '../components/CustomContainer.svelte';
    import { Col, Row } from 'sveltestrap';
    import AdminButton from '../components/AdminButton.svelte';
    import MovingContent from '../components/MovingContent.svelte';
    import AddContent from '../components/AddContent.svelte';

    import { userInfo, pageName, pageRequest } from '../store';
    
    import { getContent, updateOrCreateContent } from '../actions/pagesActions'
    import DisplayCustomComponent from '../components/DisplayCustomComponent.svelte';
    import Message from '../components/Message.svelte';
    import Loading from '../components/Loading.svelte';
    import { push } from 'svelte-spa-router';
    
    export let params = { name: 'homeContent', city:''};
    
    $: {
        if (params.city) {
            pageName.set(`${params.name}-${params.city}`);
        } else {
            pageName.set(`${params.name}`);
        }
    } 
    
    // let isAuthenticate = false;
    $: isAuthenticate = $userInfo && $userInfo.profil === 'admin' ? true : false;
    $: {
        if ($pageRequest.message && !isAuthenticate) {
            push('/');
        }
    }
    
    let admin = false;

    $: {
        getContent($pageName);
    }

    const updateContent = async() => {
        await updateOrCreateContent($pageRequest.content);
    }

    const updateMovedArray = async(array) => {
        const tempPageRequest = $pageRequest
        tempPageRequest.content.content = array;
        pageRequest.set(tempPageRequest);
        await updateOrCreateContent($pageRequest.content);
    }

    const addContent = async(item) => {

        const tempPageRequest = $pageRequest;
        tempPageRequest.content.content = [item, ...tempPageRequest.content.content];
        pageRequest.set(tempPageRequest);
        await updateOrCreateContent($pageRequest.content);
    };

    //$: console.log('request', $pageRequest);

</script>


{#if isAuthenticate}
<AdminButton 
bind:admin={admin}
isAuthenticate={isAuthenticate}
/>
{/if}

{#if $pageRequest.message}
    <Message color='warning'>{$pageRequest.message}</Message>
{/if}

{#if $pageRequest.loading}
    <Loading color='secondary' number={3} />
{:else}
    <CustomContainer>
        <Row class='mt-3'>
            <Col>
                {#if admin}
                <AddContent admin={admin} addContent={addContent}/>
                {/if}
                {#if $pageRequest.content && $pageRequest.content.content}
                    {#each $pageRequest.content.content as section, position}
                        <MovingContent 
                            array={$pageRequest.content.content} 
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

<style>
   
</style>