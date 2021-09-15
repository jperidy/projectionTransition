<script>
    import Message from "./Message.svelte";
    import { sendContactEmail } from '../actions/emailsActions';
    import { emailSendRequest } from '../store';

    import TextComponent from "./TextComponent.svelte";
    import Loading from "./Loading.svelte";
    export let values=[];
    export let styles=[];
    export let admin='false';
    export let edit='false';
    export let updateContent;

    styles;

    let subject = '';
    let email = '';
    let body = '';

    $:{
        if (values.length === 0) {
            values.push({
                title: {name: 'title', values:[], styles: []}
            })
        }
    }

    const sendEmailHandler = (e) => {
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
        } else {
            e.preventDefault(); // to avoid page to refresh
            sendContactEmail({email, subject, body});
        }
    }

</script>

<div class='mt-5'>
    <div class='text-center my-3'>
        <TextComponent 
            bind:values={values[0].title.values}
            bind:styles={values[0].title.styles}
            edit={edit}
            admin={admin}
            updateContent={updateContent}
        />
    </div>

    <form class="row contact-form" on:submit={sendEmailHandler}>
        <div class="row mb-3 align-items-center">
            <div class="col-4">
                <label for="exampleInputEmail1" class="form-label">Adresse email pour vous joindre *</label>
            </div>
            <div class="col-5">
                <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Email" required bind:value={email}>
            </div>
            <div class="col-3">
                <div id="emailHelp" class="form-text">Nous ne partagerons pas votre adresse email.</div>
            </div>
        </div>
        <div class="row mb-3 align-items-center">
            <div class="col-4">
                <label for="emailObject" class="form-label">Objet de votre message *</label>
            </div>
            <div class="col-5">
                <input type="text" class="form-control" id="emailObject" aria-describedby="emailObjectHelper" placeholder="Objet de votre message" required bind:value={subject}>
            </div>
            <div class="col-3">
                <div id="emailObjectHelper" class="form-text">L'objet nous permet d'orienter le traitement de votre message.</div>
            </div>
        </div>
        <div class="row mb-3">
            <div class='col'>
                <label for="emailBody" class="form-label">Votre message *</label>
                <textarea class="form-control" id="emailBody" aria-describedby="bodyHelper" placeholder="Votre message" required bind:value={body}></textarea>
                <div id="bodyHelper" class="form-text" rows="4">Saisissez ici votre message.</div>
            </div>
        </div>
        <div class='row'>
            <div class='col text-start'>
                <button type="submit" class="btn btn-primary">Envoyer</button>
            </div>
        </div>
    </form>

    {#if $emailSendRequest.message}
        {#if $emailSendRequest.sucess}
            <Message color='success'>{$emailSendRequest.message}</Message>
        {:else}
            <Message color='warning'>{$emailSendRequest.message}</Message>
        {/if}
    {/if}
    
    {#if $emailSendRequest.loading}
        <Loading color='secondary' number={3} />
    {/if}

</div>