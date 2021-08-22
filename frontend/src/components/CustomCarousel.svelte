<script>
    import { Carousel, CarouselCaption, CarouselControl, CarouselIndicators, CarouselItem, Col, Row } from "sveltestrap";

    export let items=[];

    let activeIndex = 0;
</script>

<Row class="my-5 text-center">
    <Col>
        <Carousel items={items} bind:activeIndex ride interval={2000}>
            <CarouselIndicators bind:activeIndex items={items} />

            <div class="carousel-inner">
            {#each items as item, index}
                <CarouselItem bind:activeIndex itemIndex={index}>
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