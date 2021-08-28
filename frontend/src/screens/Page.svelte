<script>
    import CustomContainer from '../components/CustomContainer.svelte';
    import { Col, Row } from 'sveltestrap';
    import AdminButton from '../components/AdminButton.svelte';
    import MovingContent from '../components/MovingContent.svelte';
    import AddContent from '../components/AddContent.svelte';

    import { userInfo } from '../store';
    
    import { getContent, updateOrCreateContent } from '../actions/pagesActions'
    import { onMount } from 'svelte';
    import DisplayCustomComponent from '../components/DisplayCustomComponent.svelte';
    import Message from '../components/Message.svelte';
    
    export let params = { name:'homeContent'};
    const pageName = params.name;

    // let isAuthenticate = false;
    $: isAuthenticate = $userInfo && $userInfo.profil === 'admin' ? true : false;
    let admin = false;

    let pageContent = {};
    let pageContentMessage = {};

    onMount( async() => {
        
        const pageContentResult = await getContent(pageName);

        if (pageContentResult.status === 'Ok') {
            pageContent = pageContentResult.data;
            pageContentMessage = {};
        } else {
            pageContent = {name: pageName, content: [] };
            pageContentMessage = { color: 'danger', value:pageContentResult.data };
        }

    });

    const updateContent = async() => {
        await updateOrCreateContent(pageContent);
    }

    const updateMovedArray = async(array) => {
        pageContent.content = array;
        await updateOrCreateContent(pageContent);
    }

    const addContent = async(item) => {
        pageContent.content = [item, ...pageContent.content];
        await updateOrCreateContent(pageContent);
    }

</script>

{#if isAuthenticate}
    <AdminButton 
        bind:admin={admin}
        isAuthenticate={isAuthenticate}
    />
{/if}

{#if pageContentMessage.value}
    <Message color={pageContentMessage.color}>{pageContentMessage.value}</Message>
{/if}


<CustomContainer>
    <Row>
        <Col>
            {#if admin}
                <AddContent admin={admin} addContent={addContent}/>
            {/if}
            {#if pageContent && pageContent.content}
                {#each pageContent.content as section, position}
                    <MovingContent 
                        array={pageContent.content} 
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
                        />                        
                        
                        <!-- {#if section.type === 'text'}
                            <CustomText 
                                bind:text={section.value} 
                                updateContent={updateContent}
                                admin={admin}
                            />
                        {/if}

                        {#if section.type === 'card'}
                            <CustomCard 
                                bind:cards={section.values}
                                updateContent={updateContent}
                                admin={admin}
                            />
                        {/if}
                        
                        {#if section.type === 'carousel'}
                            <CustomCarousel bind:items={section.values} />
                        {/if} -->
                    </MovingContent>
                {/each}
            {/if}
        </Col>
    </Row>
</CustomContainer>

<style>
   
</style>