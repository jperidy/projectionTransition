<script>
import { Button, Carousel, CarouselCaption, CarouselControl, CarouselIndicators, CarouselItem, Col, Image, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, NavItem, Row } from "sveltestrap";
import { deleteImage } from "../actions/imagesActions";
import EditButton from "./EditButton.svelte";
import ImageComponent from "./ImageComponent.svelte";

    export let values=[];
    export let styles=[];
    export let admin='false';
    export let edit='false';
    export let updateContent;

    styles

    let activeIndex = 0;

    if (values.length === 0) {
        // do something
        values.push({title: '', subTitle: '', component: {values: [], styles: []}});
    }

    const addAnItem = () => {
        values = [ ...values, {
            title: '',
            subTitle: '',
            component: {values: [], styles: []}
        }];
    };

    const removeAnItem = async (index) => {
        // delete Image in database
        const imageToDelete = values[index].component.values[0] && values[index].component.values[0].url;
        
        if (imageToDelete && imageToDelete.length) {
            await deleteImage(values[index].component.values[0].url);
        }

        values.splice(index,1);
        values = values;
    };

</script>

{#if admin}
    <EditButton
        admin={admin}
        updateContent={updateContent}
        bind:edit={edit}
    />
{/if}

<Row>
    <Col>  
        <Carousel items={values} bind:activeIndex ride interval={2000}>
            <CarouselIndicators bind:activeIndex items={values} />

            <div class="carousel-inner">
            {#each values as item, index}

            
                <CarouselItem bind:activeIndex itemIndex={index}>
                
                {#if edit}
                    <Row class='mt-3'>
                        <Col><Input type='text' bind:value={item.title} placeholder='Titre'/></Col>
                        <Col><Input type='text' bind:value={item.subTitle} placeholder='Sous-titre'/></Col>
                    </Row>
    
                    <Row class='my-3'>
                        <Col><Button block on:click={() => addAnItem()}>Add an item</Button></Col>
                        <Col><Button block on:click={() => removeAnItem(index)}>Delete</Button></Col>
                    </Row> 
                    <Row>
                        <Col>
                            <Label>Image</Label>
                            <ImageComponent
                                bind:values={item.component.values}
                                bind:styles={item.component.styles}
                                admin={admin}
                                edit={false}
                            />
                        </Col>
                    </Row>
                
                {:else}
                    <ImageComponent
                        bind:values={item.component.values}
                        bind:styles={item.component.styles}
                        admin={false}
                        edit={false}
                    />
                    <CarouselCaption
                        captionHeader={item.title}
                        captionText={item.subTitle}
                    />
                {/if}

                </CarouselItem>
            {/each}
            </div>
            {#if !edit}
                <CarouselControl direction="prev" bind:activeIndex items={values} />
                <CarouselControl direction="next" bind:activeIndex items={values} />
            {/if}
        </Carousel>
    </Col>
</Row>