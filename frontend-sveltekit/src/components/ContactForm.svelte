<script>
    import Message from "./Message.svelte";
    import { sendContactEmail } from '../actions/emailsActions';
    import { emailSendRequest } from '../store';

    import TextComponent from "./TextComponent.svelte";
    import Loading from "./Loading.svelte";
    import CustomContainer from "./CustomContainer.svelte";
    export let values=[];
    export let styles=[];
    export let admin='false';
    export let edit='false';
    export let updateContent;

    styles;

    let subject = '';
    let email = '';
    let nom = '';
    let prenom = '';
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
            sendContactEmail({email, subject, body, prenom, nom});
        }
    }

</script>

<CustomContainer size={{xs: 12, sm:12, md:12, lg:8}}>
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
    
        <form id='contact' class="row contact-form" on:submit={sendEmailHandler}>
            
            <div class="row align-items-center mb-3">
                <div class="col-sm-12 col-md-6">
                    <label for="exampleInputNom" class="form-label">Votre nom</label>
                    <input type="text" class="form-control" id="exampleInputNom" aria-describedby="nomHelp" placeholder="Votre nom" required bind:value={nom}>
                    <!-- <div id="nomHelp" class="form-text">Nous ne partagerons pas votre adresse email.</div> -->
                </div>
                <div class="col-sm-12 col-md-6">
                    <label for="exampleInputPrenom" class="form-label">Votre prénom</label>
                    <input type="text" class="form-control" id="exampleInputPrenom" aria-describedby="emailHelp" placeholder="Votre prénom" required bind:value={prenom}>
                    <!-- <div id="emailHelp" class="form-text">Nous ne partagerons pas votre adresse email.</div> -->
                </div>
            </div>
            <div class="row align-items-center mb-3">
                <div class="col-sm-12 col-md-6">
                    <label for="exampleInputSujet" class="form-label">Sujet du message</label>
                    <input type="text" class="form-control" id="exampleInputSujet" aria-describedby="SujetHelp" placeholder="Votre sujet" required bind:value={subject}>
                    <!-- <div id="SujetHelp" class="form-text">Nous ne partagerons pas votre adresse email.</div> -->
                </div>
                <div class="col-sm-12 col-md-6">
                    <label for="exampleInputEmail1" class="form-label">Votre adresse e-mail</label>
                    <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Votre e-mail" required bind:value={email}>
                </div>
            </div>

            <div class="row mb-3">
                <div class='col'>
                    <label for="emailBody" class="form-label">Votre message</label>
                    <textarea class="form-control" id="emailBody" aria-describedby="bodyHelper" placeholder="Votre message" rows="6" required bind:value={body}></textarea>
                    <div id="bodyHelper" class="form-text">* champs obligatoires</div>
                </div>
            </div>
            <div class='row'>
                <div class='col text-start'>
                    <button type="submit" class="btn btn-primary">Envoyer</button>
                </div>
            </div>
        </form>
    
        {#if $emailSendRequest.message}
            {#if $emailSendRequest.success}
                <Message color='success'>{$emailSendRequest.message}</Message>
            {:else}
                <Message color='warning'>{$emailSendRequest.message}</Message>
            {/if}
        {/if}
        
        {#if $emailSendRequest.loading}
            <Loading color='secondary' number={3} />
        {/if}
    
    </div>
</CustomContainer>
