<script>
    import CustomContainer from '../components/CustomContainer.svelte';
    import { homeContent } from '../dataDesign/homeContent';
    import CustomCarousel from '../components/CustomCarousel.svelte';
    import CustomCard from '../components/CustomCard.svelte';
    import CustomText from '../components/CustomText.svelte';
    import { Col, Row } from 'sveltestrap';
    import AdminButton from '../components/AdminButton.svelte';

    const updateContent = () => {
        console.log(homeContent);
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
                {#each homeContent as section}
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

                {/each}
            {/if}
        </Col>
    </Row>
</CustomContainer>

<style>
   
</style>