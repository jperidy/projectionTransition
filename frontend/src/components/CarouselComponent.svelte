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

    $:{
        if (values.length === 0) {
            // do something
            values.push({title: '', subTitle: '', component: {values: [], styles: []}});
        }
    }
    $:{
        if (values.length && !values[0].component) {
            values[0].component = {values: [], styles: []};
        }
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

<style>
    .content-container{
        position: relative;
    }
    .content {
        transition: .5s ease;
        opacity: 1;
        width: 100%;
        height: 100%;
        backface-visibility: hidden;
    }
    .middle {
        transition: .5s ease;
        opacity: 0.5;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        -ms-transform: translate(-50%, -50%);
        text-align: center;
    }
    .content-container:hover .middle {
        opacity: 1;
    }
    
</style>


<div class='content-container'>

<Row class='text-center my-5'>
    <Col>
        <div class='content'>
        <Carousel items={values} bind:activeIndex ride interval={2000}>
            <!-- <CarouselIndicators bind:activeIndex items={values} /> -->

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
                                updateContent={null}
                            />
                        </Col>
                    </Row>
                
                {:else}
                    <ImageComponent
                        bind:values={item.component.values}
                        bind:styles={item.component.styles}
                        admin={false}
                        edit={false}
                        updateContent={null}
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
        </div>
    </Col>
</Row>

{#if admin}
    <div class='middle'>
        <EditButton
            admin={admin}
            updateContent={updateContent}
            bind:edit={edit}
        />
    </div>
{/if}
</div>