<script>
    import { Button, Col, Icon, Row } from "sveltestrap";

    export let updateContent;
    export let admin = false;
    export let edit = false;

    const modifyEdit = () => {
        if (edit) {
            updateContent();
        }
        edit = !edit;
    }

</script>

{#if admin}
    <Row class='text-end'>
        <Col class='border-top border-secondary'>
            <Button 
                color='dark'
                on:click={() => modifyEdit()}
            ><Icon name={edit ? 'arrow-counterclockwise' : 'box-arrow-up-left'}/></Button>
        </Col>
    </Row>
{/if}