<script>
    import { Button, Col, Icon, Row } from "sveltestrap";

    export let admin = false;
    export let isAuthenticate = false;

    const modifyAdmin = () => {
        admin = !admin;
    }

</script>
{#if isAuthenticate}
    <Row class='text-end'>
        <Col>
            <Button 
                color='dark'
                on:click={() => modifyAdmin()}
            ><Icon name={admin ? 'arrow-counterclockwise' : 'box-arrow-up-left'}/></Button>
        </Col>
    </Row>
{/if}