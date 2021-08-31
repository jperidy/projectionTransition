<script>
    import CustomContainer from '../components/CustomContainer.svelte';
    import { Col, Row } from 'sveltestrap';
    import AdminButton from '../components/AdminButton.svelte';
    import MovingContent from '../components/MovingContent.svelte';
    import AddContent from '../components/AddContent.svelte';

    import { userInfo, pageName, pageContent, pageContentMessage } from '../store';
    
    import { getContent, updateOrCreateContent } from '../actions/pagesActions'
    import DisplayCustomComponent from '../components/DisplayCustomComponent.svelte';
    import Message from '../components/Message.svelte';
    import Loading from '../components/Loading.svelte';
    
    export let params = { name: 'homeContent'};
    $: pageName.set(params.name);
    // $: console.log($pageName);
    // $: console.log($pageContent);
    // $: console.log($pageContentMessage);

    // let isAuthenticate = false;
    $: isAuthenticate = $userInfo && $userInfo.profil === 'admin' ? true : false;

    let admin = false;

    $: {
        getContent($pageName);
    }

    const updateContent = async() => {
        await updateOrCreateContent($pageContent);


        // pageResult.then( async (result) => {
        //     update = false;
        //     await updateOrCreateContent(result.pageContent);
        //     //await updateOrCreateContent(pageResult.pageContent);
        //     update = true;
        // })
    }

    const updateMovedArray = async(array) => {
        const tempPageContent = $pageContent;
        tempPageContent.content = array;
        pageContent.set(tempPageContent);
        await updateOrCreateContent($pageContent);
    }

    const addContent = async(item) => {
        const tempPageContent = $pageContent;
        tempPageContent.content = [item, ...tempPageContent.content]
        pageContent.set(tempPageContent);
        await updateOrCreateContent($pageContent);
    }

</script>

{#if isAuthenticate}
    <AdminButton 
        bind:admin={admin}
        isAuthenticate={isAuthenticate}
    />
{/if}

{#if $pageContentMessage && $pageContentMessage.value}
    <Message color={$pageContentMessage.color}>{$pageContentMessage.value}</Message>
{/if}


<CustomContainer>
    <Row>
        <Col>
            {#if admin}
                <AddContent admin={admin} addContent={addContent}/>
            {/if}

            {#if $pageContent && $pageContent.content}
                {#each $pageContent.content as section, position}
                    <MovingContent 
                        array={$pageContent.content} 
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
                    </MovingContent>
                {/each}
            {:else}
                {#if !pageContentMessage}
                    <Row class='text-center'>
                        <Col>
                            <Loading color='primary' number={3} />
                        </Col>
                    </Row>
                {/if}
            {/if}
        </Col>
    </Row>
</CustomContainer>

<style>
   
</style>