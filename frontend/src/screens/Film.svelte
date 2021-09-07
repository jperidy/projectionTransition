<script>
    
    import AdminButton from '../components/AdminButton.svelte';
    import ImageComponent from '../components/ImageComponent.svelte';
    import { getFilm, updateFilmRequest } from '../actions/filmAction'

    import { userInfo, filmRequest, filmUpdateRequest } from '../store';
    import Message from '../components/Message.svelte';
    import Loading from '../components/Loading.svelte';
    import CustomContainer from '../components/CustomContainer.svelte';

    export let params = { id: null};
    $: id = params.id;
    $: isAuthenticate = $userInfo && $userInfo.profil === 'admin' ? true : false;
    
    let admin = false;
    let edit = false;

    $: {
        getFilm(id);
    }

    const updateFilm = () => {
        console.log('create here function to create or update the film');
        updateFilmRequest(id, $filmRequest.film);
    }

</script>

{#if isAuthenticate}
    <AdminButton
        bind:admin={admin}
        isAuthenticate={isAuthenticate}
    />

    {#if $filmRequest.message}
        <Message color='warning'>{$filmRequest.message}</Message>
    {/if}
    
    {#if $filmRequest.loading}
        <Loading color='secondary' number={3} />
    {/if}

    {#if $filmUpdateRequest.message}
        <Message color={$filmUpdateRequest.success ? 'success' : 'error'}>{$filmUpdateRequest.message}</Message>
    {/if}

    {#if $filmUpdateRequest.loading}
        <Loading color='secondary' number={3} />
    {/if}

{/if}

{#if $filmRequest.film}
    <CustomContainer>
        <div class='row align-items-center'>
            <div class='col-md-3 col-sm-12'>
                <ImageComponent
                    bind:values={$filmRequest.film.url.values}
                    bind:styles={$filmRequest.film.url.styles}
                    admin={admin}
                    edit={edit}
                    updateContent={updateFilm}
                />
            </div>
        </div>
    </CustomContainer>
{/if}
