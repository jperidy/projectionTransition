<script>
    import CustomContainer from '../components/CustomContainer.svelte';
    //import { homeContent as input } from '../dataDesign/homeContent';
    import CustomCarousel from '../components/CustomCarousel.svelte';
    import CustomCard from '../components/CustomCard.svelte';
    import CustomText from '../components/CustomText.svelte';
    import { Col, Row } from 'sveltestrap';
    import AdminButton from '../components/AdminButton.svelte';
    import MovingContent from '../components/MovingContent.svelte';
    import AddContent from '../components/AddContent.svelte';

    import { getContent, updateOrCreateContent } from '../actions/pagesActions'
    import { onMount } from 'svelte';
    import DisplayCustomComponent from '../components/DisplayCustomComponent.svelte';

    //let homeContent = input;

    const pageName = 'homeContent';
    let pageContent = {};
    let pageContentMessage = '';

    onMount( async() => {

        const pageContentResult = await getContent(pageName);
        //console.log(pageContentResult);

        if (pageContentResult.status === 'Ok') {
            pageContent = pageContentResult.data;
            pageContentMessage = '';
        } else {
            pageContent = {};
            pageContentMessage = pageContentResult.data;
        }

    });

    const updateContent = async() => {
        //console.log('updateContent', pageContent);
        await updateOrCreateContent(pageContent);
    }

    const updateMovedArray = async(array) => {
        console.log('updateMovedArray', pageContent);
        pageContent.content = array;
        await updateOrCreateContent(pageContent);
    }

    const addContent = async(item) => {
        pageContent.content = [item, ...pageContent.content];
        await updateOrCreateContent(pageContent);
    }

    let isAuthenticate = true;
    let admin = false;

</script>

<CustomContainer>
    <AdminButton 
        bind:admin={admin}
        isAuthenticate={isAuthenticate}
    />
    <Row class='text-center'>
        <Col>
            {#if admin}
                <AddContent admin={admin} addContent={addContent}/>
            {/if}
            {#if pageContent && pageContent.content}
                {#each pageContent.content as section, position}
                    <MovingContent array={pageContent.content} position={position} admin={admin} updateMovedArray={updateMovedArray}>
                        
                        <DisplayCustomComponent 
                            bind:value={section.value}
                            bind:values={section.values}
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