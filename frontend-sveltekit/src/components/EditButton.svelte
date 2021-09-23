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
                color='ambre'
                on:click={() => modifyEdit()}
            ><Icon name={edit ? 'arrow-counterclockwise' : 'box-arrow-up-left'}/>
                {edit ? 'Save' : 'Edit'}
            </Button>
        </Col>
    </Row>
{/if}