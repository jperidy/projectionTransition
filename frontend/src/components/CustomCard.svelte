<script>
    import { Button, Card, CardBody, CardFooter, CardHeader, CardSubtitle, CardText, CardTitle, Col, Icon, Row } from "sveltestrap";
    import CustomText from "./CustomText.svelte";
    import { fly, fade } from 'svelte/transition';
    import MovingContent from "./MovingContent.svelte";
    import EditButton from "./EditButton.svelte";

    export let cards = [];
    export let updateContent;
    export let admin = false;
    export let edit = false;

    let editCards = false;

    // if (cards.length === 1) {
    //     cards = [null, ...cards, null]
    // } else if (cards.length === 2) {
    //     cards = [cards[0], null, cards[1]];
    // }

    const updateMovedArray = (array) => {
        cards = array;
    }

    const addACard = () => {
        cards = [...cards, {
            title: '',
            subTitle: '',
            text: '',
            url: '',
            footer: '',
        }];
    }

    const removeACard = (index) => {
        cards.splice(index,1);
        cards = cards;
    }

</script>

<Row class='text-center'>
    {#if admin && updateContent}
        <EditButton
            admin={admin}
            updateContent={updateContent}
            bind:edit={editCards}
        />
    {/if}
    {#each cards as card, position}
        <Col sm={12} md={4} >
        <MovingContent array={cards} position={position} admin={admin} updateMovedArray={updateMovedArray}>
        <div in:fly="{{ y: 200, duration: 2000 }}" out:fade>        
            {#if card}
                {#if editCards}
                    <Button on:click={() => removeACard(position)}>Delete</Button>
                {/if}
                <Card class='my-3' color='dark' inverse>
                    <CardHeader>
                        <CardTitle>
                            <CustomText 
                                bind:text={card.title}
                                admin={admin}
                                updateContent={updateContent}
                                edit={edit}
                            />
                        </CardTitle>
                    </CardHeader>
                    <CardBody>
                        <Row class='text-start'>
                            <Col xs={3}>
                                {#if card.url}
                                    <img src={card.url} alt='illustration' />
                                {:else}
                                    <Icon name='card-image' />
                                {/if}
                            </Col>
                            <Col xs={9}>
                                <CardSubtitle>
                                    <CustomText 
                                        bind:text={card.subTitle}
                                        admin={admin}
                                        updateContent={updateContent}
                                        edit={edit}
                                    />
                                </CardSubtitle>
                                <CardText>
                                    <CustomText 
                                        bind:text={card.text}
                                        admin={admin}
                                        updateContent={updateContent}
                                        edit={edit}
                                    />
                                </CardText>
                            </Col>
                        </Row>
                    </CardBody>
                    <CardFooter class='text-start'>
                        <Row>
                            <Col xs={2} class='text-end'>
                                <Icon name='three-dots' />
                            </Col>
                            <Col xs={10} calss='text-start'>
                                <CustomText 
                                        bind:text={card.footer}
                                        admin={admin}
                                        updateContent={updateContent}
                                        edit={edit}
                                />
                            </Col>
                        </Row>
                    </CardFooter>
                </Card>                
            {/if}
        </div>
        </MovingContent>
        </Col>
    {/each}
    
    {#if editCards}
        <Button on:click={() => addACard()}>Add a card</Button>
    {/if}

</Row>