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
        let city = params.city;
        let name = params.name;
        if (city) {
            pageName.set(`${name}-${city}`);
        } else {
            pageName.set(`${name}`);
        }
    } 

    // $: console.log('pageRequest', $pageRequest.content);
    // $: console.log($pageContent);
    // $: console.log($pageContentMessage);
    
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

        //const tempPageContent = $pageContent;
        //tempPageContent.content = array;
        //pageContent.set(tempPageContent);
        //await updateOrCreateContent($pageContent);
    }

    const addContent = async(item) => {

        const tempPageRequest = $pageRequest;
        tempPageRequest.content.content = [item, ...tempPageRequest.content.content];
        pageRequest.set(tempPageRequest);
        await updateOrCreateContent($pageRequest.content);

        // const tempPageContent = $pageContent;
        // tempPageContent.content = [item, ...tempPageContent.content]
        // pageContent.set(tempPageContent);
        // await updateOrCreateContent($pageContent);
    }

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
{/if}

<!-- {#if $pageContentMessage && $pageContentMessage.value}
<Message color={$pageContentMessage.color}>{$pageContentMessage.value}</Message>
{/if} -->


<CustomContainer>
    <Row>
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
                            updateContent={updateContent && updateContent}
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

<style>
   
</style>