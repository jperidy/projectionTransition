<script>
    import { Button, Carousel, CarouselCaption, CarouselControl, CarouselIndicators, CarouselItem, Col, Input, Row } from "sveltestrap";
    import EditButton from "./EditButton.svelte";
    import { uploadImage } from '../actions/imagesActions';

    export let items=[];
    export let updateContent;
    export let admin = false;
    export let edit = false;

    let editContent = false;

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
        console.log('onChangeHandler start');
        const data = new FormData();

        console.log(e.target.files)
        data.append('file', e.target.files[0]);

        const imageToDelete = items[index].url.split('/');
        console.log(imageToDelete[imageToDelete.length - 1]);

        const result = await uploadImage(data, imageToDelete[imageToDelete.length - 1]);

        if (result.status === 'Ok') {
            //console.log('image uploaded', result.data);
            items[index].url = result.data;
            items = items;
        } else {
            console.log('error', result.data);
        }

        //dispatch(uploadConsultantWk(data));
    };

</script>

<Row class="my-5 text-center">
    <Col>
        {#if admin && updateContent}
            <EditButton
                admin={admin}
                updateContent={updateContent}
                bind:edit={editContent}
            />
        {/if}

        <Carousel items={items} bind:activeIndex ride interval={2000}>
            <CarouselIndicators bind:activeIndex items={items} />

            <div class="carousel-inner">
            {#each items as item, index}
                
                <CarouselItem bind:activeIndex itemIndex={index}>
                    {#if editContent}
                        <!-- <Input type='text' bind:value={item.url} placeholder="URL de l'image"/> -->
                        <Input type='file' name='image-carousel' on:change={(e) => onChangeHandler (index, e)} />
                        <Input type='text' bind:value={item.title} placeholder='Titre'/>
                        <Input type='text' bind:value={item.subTitle} placeholder='Sous-titre'/>
                        <Button on:click={() => addAnItem()}>Add an item</Button>
                        <Button on:click={() => removeAnItem(index)}>Delete</Button>
                        
                    {/if}
                    <img src={item.url} alt={item.title} />
                    <CarouselCaption
                        captionHeader={item.title}
                        captionText={item.subTitle}
                    />
                </CarouselItem>
            {/each}
            </div>
            <CarouselControl direction="prev" bind:activeIndex items={items} />
            <CarouselControl direction="next" bind:activeIndex items={items} />
        </Carousel>
    </Col>  
</Row>