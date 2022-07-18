<script>

    import { page } from '$app/stores'
    let redirection = $page.url.searchParams.get('redirection');
    if (!redirection) {
        redirection='/';
    }

    import CustomContainer from "../components/CustomContainer.svelte";
    import Message from '../components/Message.svelte';
    import { login } from '../actions/userActions';
    import { goto } from "$app/navigation";
    import { userInfo } from '../store';
    import { browser } from '$app/env';

    let email = '';
    let password = '';
    let message = {};

    $: {
        let isAuthenticate = $userInfo && $userInfo.profil === 'admin' ? true : false;
        //if (browser && isAuthenticate) { goto(redirection); }
        if (browser && isAuthenticate) { goto("/admin"); }
    }


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
                goto(redirection);
            } else {
                message = { color: 'danger', value: result.data};
            }
        }
    };

</script>

<svelte:head>
    <title>Login - Projection Transition</title>
	<meta name='description' content={`Retrouvez toutes les informations sur le festival Projection Transition Login`} />
	<meta name='keywords' content="écologie, transition, projection transition, cinéma, shiftProject, cine-debat" />
</svelte:head>

<CustomContainer size ={{ xs: 12, sm:6, md:6, lg:6 }}>
    <div class='row my-5'>
        <div class="col">
            <h3>Login</h3>
            <form on:submit={submitHandler}>
                <div class='mb-3'>
                    <label class='form-label' for='email-input'>Email :</label>
                    <input class='form-control' type='email' name='mail' id='email-input' bind:value={email} placeholder='Enter your email' />
                </div>
                <div class='mb-3'>
                    <label class='form-label' for='password-input'>Password :</label>
                    <input class='form-control' type='password' name="password" id='password-input' bind:value={password} placeholder='Enter your password'/>
                </div>
                <button type='submit' color='primary'>Submit</button>
            </form>
        </div>
    </div>
    
    {#if message.value}
        <div class='row'>
            <div class='col'>
                <Message color={message.color}>{message.value}</Message>
            </div>
        </div>
    {/if}
</CustomContainer>