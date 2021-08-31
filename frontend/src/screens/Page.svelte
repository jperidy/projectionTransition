<script>
    import CustomContainer from '../components/CustomContainer.svelte';
    import { Col, Row } from 'sveltestrap';
    import AdminButton from '../components/AdminButton.svelte';
    import MovingContent from '../components/MovingContent.svelte';
    import AddContent from '../components/AddContent.svelte';

    import { userInfo } from '../store';
    
    import { getContent, updateOrCreateContent } from '../actions/pagesActions'
    import DisplayCustomComponent from '../components/DisplayCustomComponent.svelte';
    import Message from '../components/Message.svelte';
    import Loading from '../components/Loading.svelte';
    
    export let params = { name: 'homeContent'};
    $: pageName = params.name;
    //$: console.log(pageName);

    // let isAuthenticate = false;
    $: isAuthenticate = $userInfo && $userInfo.profil === 'admin' ? true : false;
    let admin = false;

    //let pageContent = {};
    //let pageContentMessage = {};
    let pageResult = {};

    let update = false;

    const getPage = async (pageName) => {

        let pageContent, pageContentMessage = {};
        const pageContentResult = await getContent(pageName);

        if (pageContentResult.status === 'Ok') {
            pageContent = pageContentResult.data;
            pageContentMessage = {};
            
        } else {
            pageContent = {name: pageName, content: [] };
            pageContentMessage = { color: 'danger', value:pageContentResult.data };
        }

        return { pageContent, pageContentMessage }
    }

    $: {
        pageResult = getPage(pageName);
    }
    $: {
        if (update === true) {
            pageResult = getPage(pageName);
        }
    }

    const updateContent = async() => {
        pageResult.then( async (result) => {
            update = false;
            await updateOrCreateContent(result.pageContent);
            //await updateOrCreateContent(pageResult.pageContent);
            update = true;
        })
    }

    const updateMovedArray = async(array) => {
        pageResult.then(async(result) => {
            //result.pageContent.content = array;
            update = false;
            //await updateOrCreateContent(array);
            await updateOrCreateContent(result.pageContent);
            update = true;
        })
    }

    const addContent = async(item) => {
        pageResult.then(async(result) => {
            update = false;
            result.pageContent.content = [item, ...result.pageContent.content];
            await updateOrCreateContent(result.pageContent);
            update = true;
        })
    }

</script>

{#if isAuthenticate}
    <AdminButton 
        bind:admin={admin}
        isAuthenticate={isAuthenticate}
    />
{/if}


{#await pageResult then pageContentMessage}
    {#if pageContentMessage.pageContentMessage.value}
        <Message color={pageContentMessage.pageContentMessage.color}>{pageContentMessage.pageContentMessage.value}</Message>
    {/if}
{/await}


<CustomContainer>
    <Row>
        <Col>
            {#if admin}
                <AddContent admin={admin} addContent={addContent}/>
            {/if}

            {#await pageResult}
                <Row class='text-center'>
                    <Col>
                        <Loading color='primary' number={3} />
                    </Col>
                </Row>
            {:then pageContent} 
                {#if pageContent.pageContent && pageContent.pageContent.content}
                    {#each pageContent.pageContent.content as section, position}

                        <MovingContent 
                            array={pageContent.pageContent.content} 
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
                {/if}
                
            {/await}
        </Col>
    </Row>
</CustomContainer>

<style>
   
</style>