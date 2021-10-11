<script context='module'>

    import { getFilm } from '../../actions/filmActions';
    
    export const prerender = true;

    export async function load({page, fetch, session, context}){

        //verify if login
        let redirection = page.path.split('/login');

        let filmRequest = {film:null, loading:true, message:''}
        const id = page.params.id ? page.params.id : null;
        
        filmRequest = await getFilm(id);

        if (redirection.length === 1) {
            return {status:200, props: {filmRequest, id, page}};
        } else {
            return {status:307, redirect: `/login?redirection=${redirection[0]}`}
        }
    }

</script>

<script>
    
    import { updateFilmRequest } from '../../actions/filmActions';
    import AdminButton from '../../components/AdminButton.svelte';
    import ImageComponent from '../../components/ImageComponent.svelte';
    import Message from '../../components/Message.svelte';
    import Loading from '../../components/Loading.svelte';
    import CustomContainer from '../../components/CustomContainer.svelte';
    import TextComponent from '../../components/TextComponent.svelte';
    import MovingContent from '../../components/MovingContent.svelte';

    import { userInfo, filmUpdateRequest } from '../../store';
    import { goto } from '$app/navigation';
    import { get } from 'svelte/store';

    import config from '../../config.json';
    import SeoComponent from '../../components/SeoComponent.svelte';
    import { logout, verifyLocalToken } from '../../actions/userActions';
    import { onMount } from 'svelte';
    const SITE_URL = config.SVELTE_ENV === 'dev' ? config.SITE_URL_DEV : config.SVELTE_ENV === 'preprod' ? config.SITE_URL_PREPROD : config.SVELTE_ENV === 'production' ? config.SITE_URL_PROD : config.SITE_URL_DEV;
    
    export let filmRequest;
    export let id;
    export let page;

    $: isAuthenticate = $userInfo && $userInfo.profil === 'admin' ? true : false;

    onMount(async() => {
        const userInfoStored = get(userInfo);
        
        if (userInfoStored && userInfoStored.token) {
            const tokenValid = await verifyLocalToken(userInfoStored.token);
            if (tokenValid.status === 'Error') {
                await logout();
            }
        }
    });

    let admin = false;
    let edit = false;

    const updateFilm = async () => {
        await updateFilmRequest(id, filmRequest.film);
    };

    const addActionHandler = () => {
        const tempFilmRequest = filmRequest;
        tempFilmRequest.film.actions = [ ...tempFilmRequest.film.actions, {
            heure: {values:[], styles:[]},
            titre: {values:[], styles:[]},
            description: {values:[], styles:[]},
            complement:{values:[], styles:[]}
        }];
        filmRequest = tempFilmRequest;
        updateFilm();
    };

    const updateMovedArray = (array) => {
        const tempFilmRequest = filmRequest;
        tempFilmRequest.film.actions = array;
        //filmRequest.set(tempFilmRequest);
        filmRequest = tempFilmRequest;
        updateFilm();
    };

    const bookAvailableHandler = (e) => {
        filmRequest.film.bookingAvailable = e.target.checked;
        updateFilm();
    };

</script>

{#if filmRequest.message}
    <Message color='warning'>{filmRequest.message}</Message>
{/if}

{#if filmRequest.film}

    {#if isAuthenticate}
        <AdminButton
            bind:admin={admin}
            isAuthenticate={isAuthenticate}
        />

        {#if filmRequest.message}
            <Message color='warning'>{filmRequest.message}</Message>
        {/if}
        
        {#if filmRequest.loading}
            <Loading color='secondary' number={3} />
        {/if}

        {#if $filmUpdateRequest.message}
            <Message color={$filmUpdateRequest.success ? 'success' : 'error'}>{$filmUpdateRequest.message}</Message>
        {/if}

        {#if $filmUpdateRequest.loading}
            <Loading color='secondary' number={3} />
        {/if}

    {/if}

    {#if filmRequest.film}

        <CustomContainer size={{xs: 12, sm:12, md:12, lg:12, xl:10}}>
            <div class='row mt-2 gx-3 gy-5'>
                <!-- contents for conference -->
                <div class='col-sm-12 col-md-4'>
                    <ImageComponent
                        bind:values={filmRequest.film.url.values}
                        bind:styles={filmRequest.film.url.styles}
                        admin={admin}
                        edit={edit}
                        updateContent={updateFilm}
                    />
                </div>

                <!-- content for film -->
                <div class='col-sm-12 col-md-8'>
                    <div class='row'>
                        <div class='col'>
                            <TextComponent
                                bind:values={filmRequest.film.title.values}
                                bind:styles={filmRequest.film.title.styles}
                                admin={admin}
                                edit={edit}
                                updateContent={updateFilm}
                            />
                        </div>
                    </div>
                    <div class='row mt-1'>
                        <div class='col-12'>
                            <TextComponent
                                bind:values={filmRequest.film.real.values}
                                bind:styles={filmRequest.film.real.styles}
                                admin={admin}
                                edit={edit}
                                updateContent={updateFilm}
                            />
                        </div>
                    </div>
                    <div class='row mt-3'>
                        <TextComponent
                            bind:values={filmRequest.film.summury.values}
                            bind:styles={filmRequest.film.summury.styles}
                            admin={admin}
                            edit={edit}
                            updateContent={updateFilm}
                        />
                    </div>
                </div>
            </div>

            <div class='row mt-4 align-items-center'>
                <div class='col-12'>
                    <TextComponent
                        bind:values={filmRequest.film.infosGenerales.values}
                        bind:styles={filmRequest.film.infosGenerales.styles}
                        admin={admin}
                        edit={edit}
                        updateContent={updateFilm}
                    />
                </div>
                <!-- {#each filmRequest.film.actions as action, position}
                    <MovingContent
                        array={filmRequest.film.actions} 
                        position={position} 
                        admin={admin} 
                        updateMovedArray={updateMovedArray}
                    >
                    <div class='row mt-3'>
                        <div class='col-2'>
                            <div class='text-center'>
                                <TextComponent
                                    bind:values={action.heure.values}
                                    bind:styles={action.heure.styles}
                                    admin={admin}
                                    edit={edit}
                                    updateContent={updateFilm}
                                />
                            </div>
                        </div>
                        <div class='col-10'>
                                    <TextComponent
                                        bind:values={action.titre.values}
                                        bind:styles={action.titre.styles}
                                        admin={admin}
                                        edit={edit}
                                        updateContent={updateFilm}
                                    />
                                    <TextComponent
                                        bind:values={action.description.values}
                                        bind:styles={action.description.styles}
                                        admin={admin}
                                        edit={edit}
                                        updateContent={updateFilm}
                                    />
                                    <TextComponent
                                        bind:values={action.complement.values}
                                        bind:styles={action.complement.styles}
                                        admin={admin}
                                        edit={edit}
                                        updateContent={updateFilm}
                                    />
                        </div>
                    </div>
                    </MovingContent>
                {/each}
                {#if admin}
                    <button class='btn btn-primary text-center' on:click={addActionHandler}>Add an action</button>
                {/if} -->
            </div>

            <div class='row mt-3'>
                <div class='col text-center'>

                    {#if filmRequest.film.bookingAvailable}
                        <a class='book-link text-primary' href={filmRequest.film.book} target="_blank" >
                            <button 
                                class="book btn btn-light border border-primary text-wrap text-break text-center text-primary bg-transparent"
                            >RESERVER MA PLACE</button>
                        </a>
                    {:else}
                        <button 
                            type='button'
                            class="btn btn-light mt-3 border border-primary text-wrap text-break text-center text-primary bg-transparent"
                            data-bs-toggle="tooltip" 
                            data-bs-placement="right" 
                            title={filmRequest.film.justification}
                        >Réservation non disponible</button>
                        <p>{filmRequest.film.justification ? filmRequest.film.justification : "La billeterie n'est pas encore ouverte"}</p>
                    {/if}
                    {#if admin}
                        <div class="text-start">
                            <CustomContainer size={{ xs: 12, sm:4, md:4, lg:4 }}>
                            <label for="book-url" class='mt-3'>Adresse de réservation</label>
                            <input id='book-url' class='form-control' placeholder="https://acheter-ma-place" bind:value={filmRequest.film.book} on:change={updateFilm} />
                            <div class="form-check form-switch mt-3">
                                <input class="form-check-input" type="checkbox" id="flexSwitchCheckDefault" checked={filmRequest.film.bookingAvailable} on:change={bookAvailableHandler}>
                                <label class="form-check-label" for="flexSwitchCheckDefault">Disponible à la vente</label>
                            </div>
                            {#if !filmRequest.film.bookingAvailable}
                                <label for="book-availability">Raison de la non disponibilité</label>
                                <textarea 
                                    class='form-control'
                                    id="book-availability"
                                    placeholder="Raison de la non disponibilité (Billetterie non ouverte, Tous les tickets sont vendus..)"
                                    bind:value={filmRequest.film.justification}
                                    on:change={updateFilm}
                                />  
                            {/if}
                            </CustomContainer>
                        </div>
                    {/if}
                </div>
            </div>
            <div class='row mt-5'>
                <div class='col text-center'>
                    <button class='btn btn-white border border-white' on:click={() => goto(`/programmation/${filmRequest.film.location}`)}>
                        <i class="bi bi-box-arrow-in-left"></i>
                        Retour à la programmation
                    </button>
                </div>
            </div>
            <SeoComponent
                pageContent={filmRequest.film}
                page={page}
                siteURL={SITE_URL}
                admin={admin}
                updateContent={updateFilm}
            />
        </CustomContainer>
    {/if}
{/if}

<style>
    .book:hover {
        -webkit-transform: scale(1.13);
	    transform: scale(1.13);
        transition: .5s ease;
    }
    .book {
        -webkit-transform: scale(1);
	    transform: scale(1);
        transition: .5s ease;
    }
</style>