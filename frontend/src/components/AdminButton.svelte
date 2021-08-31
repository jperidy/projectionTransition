<script>
import { push } from "svelte-spa-router";

    import { Alert, Button, Col, Icon, Row } from "sveltestrap";
    import { logout } from "../actions/userActions";

    export let admin = false;
    export let isAuthenticate = false;

    const modifyAdmin = () => {
        admin = !admin;
    }

    const logoutHandler = () => {
        logout();
        push('#/login');
    };

</script>

{#if isAuthenticate}
    <Alert class='text-center py-2' color='warning'>
        <Row>
            <Col sm={4} md={10} class='my-auto'>You are in admin mode ! Be careful</Col>
            <Col sm={4} md={1}>
                <Button 
                    color='light'
                    on:click={() => modifyAdmin()}
                    block
                ><Icon name={admin ? 'arrow-counterclockwise' : 'box-arrow-up-left'}/>
                {admin ? 'Sauvegarder' : 'Editer'}
                </Button>
            </Col>
            <Col sm={4} md={1}>
                <Button
                    color='light'
                    on:click={() => logoutHandler()}
                    block
                ><Icon name='door-open' />Logout</Button>
            </Col>
        </Row>
    </Alert>
{/if}