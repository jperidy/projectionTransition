<script>
    import { Button, Col, Form, FormGroup, Input, Label, Row } from "sveltestrap";
    import CustomContainer from "../components/CustomContainer.svelte";
    import Message from '../components/Message.svelte';
    import { login } from '../actions/userActions';
    import { push } from 'svelte-spa-router';
    import { userInfo } from '../store';

    let email = '';
    let password = '';
    let message = {};
    //let userInfo = {};

    const submitHandler = async(e) => {
        const form = e.currentTarget;
        // Verification of validity of data
        if (form.checkValidity() === false) {
            message = { color: 'danger', value: 'Please check your information'};
        } else {
            e.preventDefault(); // to avoid page to refresh
            const result = await login({email, password});
            if (result.status === 'Ok') {
                $userInfo = result.data;
                message = { color: 'success', value: 'Success'};
                push('/');
            } else {
                message = { color: 'danger', value: result.data};
            }
        }
    };

</script>

<CustomContainer>
    <Row class='my-5'>
        <Col>
            <h3>Login</h3>
            <Form on:submit={submitHandler}>
                <FormGroup>
                    <Label for='email-input'>Email :</Label>
                    <Input type='email' name='mail' id='email-input' bind:value={email} placeholder='Enter your email' />
                </FormGroup>
                <FormGroup>
                    <Label for='password-input'>Password :</Label>
                    <Input type='password' name="password" id='password-input' bind:value={password} placeholder='Enter your password'/>
                </FormGroup>
                <Button type='submit' color='primary'>Submit</Button>
            </Form>
        </Col>
    </Row>
    
    {#if message.value}
        <Row>
            <Col>
                <Message color={message.color}>{message.value}</Message>
            </Col>
        </Row>
    {/if}
</CustomContainer>