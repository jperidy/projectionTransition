<script>

    import { Button, Col, Icon, Row } from "sveltestrap";

    export let updateContent;
    export let admin = false;
    export let edit = false;

    const modifyEdit = () => {
        if (edit && updateContent) {
            updateContent();
        }
        edit = !edit;
    }

</script>

{#if admin}
    <Row class='text-end m-3'>
        <Col>
            <Button 
                color='dark'
                on:click={() => modifyEdit()}
            ><Icon name={edit ? 'arrow-counterclockwise' : 'box-arrow-up-left'}/>
                {edit ? 'Sauvegarder' : 'Modifier'}
            </Button>
        </Col>
    </Row>
{/if}