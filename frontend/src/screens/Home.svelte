<script>
    import CustomContainer from '../components/CustomContainer.svelte';
    import { homeContent as input } from '../dataDesign/homeContent';
    import CustomCarousel from '../components/CustomCarousel.svelte';
    import CustomCard from '../components/CustomCard.svelte';
    import CustomText from '../components/CustomText.svelte';
    import { Col, Row } from 'sveltestrap';
    import AdminButton from '../components/AdminButton.svelte';
    import MovingContent from '../components/MovingContent.svelte';

    let homeContent = input;
    const updateContent = () => {
        console.log(homeContent);
    }

    const updateMovedArray = (array) => {
        homeContent = array;
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
            {#if homeContent}
                {#each homeContent as section, position}
                    <MovingContent array={homeContent} position={position} admin={admin} updateMovedArray={updateMovedArray}>
                        {#if section.type === 'text'}
                            <CustomText 
                                bind:text={section.value} 
                                updateContent={updateContent}
                                admin={admin}
                            />
                        {/if}

                        {#if section.type === 'card'}
                            <CustomCard 
                                bind:cards={section.value}
                                updateContent={updateContent}
                                admin={admin}
                            />
                        {/if}
                        
                        {#if section.type === 'carousel'}
                            <CustomCarousel bind:items={section.value} />
                        {/if}
                    </MovingContent>
                {/each}
            {/if}
        </Col>
    </Row>
</CustomContainer>

<style>
   
</style>