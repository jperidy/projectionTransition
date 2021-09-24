<script context='module'>

    import { getFilm } from '../../actions/filmActions';
    
    export const prerender = true;

    export async function load({page, fetch, session, context}){

        //verify if login
        let redirection = page.path.split('/login');

        let filmRequest = {film:null, loading:true, message:''}
        const id = page.params.id ? page.params.id : null;
        
        filmRequest = await getFilm(id);

        //console.log(page)

        return {props: {filmRequest, id, redirection, page}};
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
    import { onMount } from 'svelte';

    import config from '../../config.json';
    const SITE_URL = config.SVELTE_ENV === 'dev' ? config.SITE_URL_DEV : config.SVELTE_ENV === 'preprod' ? config.SITE_URL_PREPROD : config.SVELTE_ENV === 'production' ? config.SITE_URL_PROD : config.SITE_URL_DEV;
    
    export let filmRequest;
    export let id;
    export let redirection;
    export let page;
    
    // redirect to login page if requested
    onMount(() => {
        if (redirection.length > 1) {
            goto(`/login?redirection=${redirection[0]}`);
        }
    });

    $: isAuthenticate = $userInfo && $userInfo.profil === 'admin' ? true : false;


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

</script>

<svelte:head>
    <title>Projection Transition {filmRequest.film.title.values.length ? filmRequest.film.title.values[0].value.replaceAll(/[#|*|_]/g, '') : ''}</title>
	<meta name='description' content={`Retrouvez toutes les informations sur le festival Projection Transition ${filmRequest.film.title.values.length ? filmRequest.film.title.values[0].value.replaceAll(/[#|*|_]/g, '') : ''}`} />
	<meta name='keywords' content="écologie, transition, projection transition, cinéma, shiftProject, cine-debat" />
	<meta property="og:title" content={`Projection Transition - Participez à la projection de ${filmRequest.film.title.values.length ? filmRequest.film.title.values[0].value.replaceAll(/[#|*|_]/g, '') : ''}`} />
	<meta property="og:type" content="website" />
	<meta property="og:image" content={`${SITE_URL}/images/og_logo.jpg`} />
	<meta property="og:image:width" content="800" />
	<meta property="og:image:height" content="400" />
	<meta property="og:url" content={`${page.host}${page.path}`} />
	<meta property="og:locale" content="fr_FR" />
	<meta name="twitter:image" content={`${SITE_URL}/images/og_logo.jpg`} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:description" content={`Projection Transition - Participez à la projection de ${filmRequest.film.title.values.length ? filmRequest.film.title.values[0].value.replaceAll(/[#|*|_]/g, '') : ''}`} />
</svelte:head>

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
    <CustomContainer size={{xs: 12, sm:12, md:12, lg:12}}>
        <div class='row mt-5'>
            <!-- contents for conference -->
            <div class='col-sm-12 col-md-5'>
                <div class='row align-items-center'>
                    <div class='col-2'>
                    </div>
                    <div class='col-10'>
                        <h3 class='mb-3'><span class='text-white bg-primary'>PROGRAMME</span></h3>
                        <TextComponent
                            bind:values={filmRequest.film.infosGenerales.values}
                            bind:styles={filmRequest.film.infosGenerales.styles}
                            admin={admin}
                            edit={edit}
                            updateContent={updateFilm}
                        />
                    </div>
                </div>
                {#each filmRequest.film.actions as action, position}
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
                            <!-- <div class='row'>
                                <div class='col-sm-12 col-md-8'> -->
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
                                <!-- </div> -->
                                <!-- <div class='col-sm-12 col-md-4'>
                                </div> -->
                            <!-- </div> -->
                        </div>
                    </div>
                    </MovingContent>
                {/each}
                {#if admin}
                    <button class='btn btn-primary text-center' on:click={addActionHandler}>Add an action</button>
                {/if}
            </div>

            <!-- content for film -->
            <div class='col-sm-12 col-md-7'>
                <div class='row'>
                    <div class='col-sm-12 col-md-6 text-center mt-5'>
                        <ImageComponent
                            bind:values={filmRequest.film.url.values}
                            bind:styles={filmRequest.film.url.styles}
                            admin={admin}
                            edit={edit}
                            updateContent={updateFilm}
                        />
                    </div>
                    <div class='col-sm-12 col-md-6 mt-5'>
                        <div class='row'>
                            <div class='col'>
                                <TextComponent
                                    bind:values={filmRequest.film.title.values}
                                    bind:styles={filmRequest.film.title.styles}
                                    admin={admin}
                                    edit={edit}
                                    updateContent={updateFilm}
                                />
                                <div class='ligne-titre border-top border-5 border-primary' style="max-width: 10vh;"></div>
                            </div>
                        </div>
                        <div class='row mt-3'>
                            <div class='col-4 border-end border-primary my-auto'>
                                <strong>Réalisation</strong>
                            </div>
                            <div class='col-8'>
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
            </div>
        </div>
        <div class='row mt-3'>
            <div class='col text-center'>
                <!-- <span class='p-2 border border-primary text-wrap text-break text-center text-primary'> -->
                    <button class="btn btn-light border border-primary text-wrap text-break text-center text-primary bg-transparent">RESERVER MA PLACE</button>
                <!-- </span> -->
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
    </CustomContainer>
{/if}
