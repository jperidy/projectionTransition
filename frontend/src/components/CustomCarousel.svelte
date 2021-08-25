<script>
    import { Button, Carousel, CarouselCaption, CarouselControl, CarouselIndicators, CarouselItem, Col, Input, Row } from "sveltestrap";
    import EditButton from "./EditButton.svelte";
    import { uploadImage } from '../actions/imagesActions';

    export let items=[];
    export let updateContent;
    export let admin = false;
    export let edit = false;

    let activeIndex = 0;

    const addAnItem = () => {
        items = [ ...items, {
            url: '',
            title: '',
            subTitle: ''
        }];
    };

    const removeAnItem = (index) => {
        items.splice(index,1);
        items = items;
    };

    const onChangeHandler = async(index, e) => {
        const data = new FormData();

        data.append('file', e.target.files[0]);

        const imageToDelete = items[index].url.split('/');

        const result = await uploadImage(data, imageToDelete[imageToDelete.length - 1]);

        if (result.status === 'Ok') {
            items[index].url = result.data;
            items = items;
        } else {
            console.log('error', result.data);
        }
    };

</script>

<Row class="my-5 text-center">
    <Col>
        {#if admin && updateContent}
            <EditButton
                admin={admin}
                updateContent={updateContent}
                bind:edit={edit}
            />
        {/if}

        <Carousel items={items} bind:activeIndex ride interval={2000}>
            <CarouselIndicators bind:activeIndex items={items} />

            <div class="carousel-inner">
            {#each items as item, index}
                
                <CarouselItem bind:activeIndex itemIndex={index}>
                    {#if edit}
                        <!-- <Input type='text' bind:value={item.url} placeholder="URL de l'image"/> -->
                        <Row class='mt-3'>
                            <Col><Input type='file' name='image-carousel' on:change={(e) => onChangeHandler (index, e)} /></Col>
                        </Row>
                        <Row class='mt-3'>
                            <Col><Input type='text' bind:value={item.title} placeholder='Titre'/></Col>
                            <Col><Input type='text' bind:value={item.subTitle} placeholder='Sous-titre'/></Col>
                        </Row>
                        <Row class='my-3'>
                            <Col><Button block on:click={() => addAnItem()}>Add an item</Button></Col>
                            <Col><Button block on:click={() => removeAnItem(index)}>Delete</Button></Col>
                        </Row>  
                    {/if}
                    <Row>
                    <img src={item.url} alt={item.title} />
                    <CarouselCaption
                        captionHeader={item.title}
                        captionText={item.subTitle}
                    />
                    </Row>
                </CarouselItem>
            {/each}
            </div>
            <CarouselControl direction="prev" bind:activeIndex items={items} />
            <CarouselControl direction="next" bind:activeIndex items={items} />
        </Carousel>
    </Col>  
</Row>