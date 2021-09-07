<script>
    
    import AdminButton from '../components/AdminButton.svelte';
    import ImageComponent from '../components/ImageComponent.svelte';
    import { getFilm, updateFilmRequest } from '../actions/filmActions'

    import { userInfo, filmRequest, filmUpdateRequest } from '../store';
    import Message from '../components/Message.svelte';
    import Loading from '../components/Loading.svelte';
    import CustomContainer from '../components/CustomContainer.svelte';
import TextComponent from '../components/TextComponent.svelte';

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
    <CustomContainer size={{xs: 12, sm:12, md:12, lg:12}}>
        <div class='row mt-5'>
            <!-- contents for conference -->
            <div class='col-sm-12 col-md-6'>
                <div class='row align-items-center'>
                    <div class='col-3'>
                        <div class='border border-primary text-wrap text-break text-center text-primary'>RESERVER</div>
                    </div>
                    <div class='col-6'>
                        <h3 ><span class='text-white bg-primary'>PROGRAMME</span></h3>
                        <h5 class='text-secondary'>A l'hotel de ville !</h5>
                    </div>
                    <div class='col-3'></div>
                </div>
                <div class='row mt-3'>
                    <div class='col-3'>
                        <div class='text-center'>8h30</div>
                    </div>
                    <div class='col-6'>
                        <h5>Ouverture de la salle</h5>
                        <p>Nous vous demandons d'arriver avec 15 minutes d'avance, etc.</p>
                    </div>
                    <div class='col-3'>
                        <p>Animateur 1 (chercheur en XXX)</p>
                    </div>
                </div>
                <div class='row mt-3'>
                    <div class='col-3'>
                        <div class='text-center'>8h30</div>
                    </div>
                    <div class='col-6'>
                        <h5>Ouverture de la salle</h5>
                        <p>Nous vous demandons d'arriver avec 15 minutes d'avance, etc.</p>
                    </div>
                    <div class='col-3'>
                        <p>Animateur 1 (chercheur en XXX)</p>
                    </div>
                </div>
            </div>

            <!-- content for film -->
            <div class='col-sm-12 col-md-6 border-start border-secondary'>
                <div class='row'>
                    <div class='col-6'>
                        <ImageComponent
                            bind:values={$filmRequest.film.url.values}
                            bind:styles={$filmRequest.film.url.styles}
                            admin={admin}
                            edit={edit}
                            updateContent={updateFilm}
                        />
                    </div>
                    <div class='col-6'>
                        <div class='row'>
                            <div class='col'>
                                <TextComponent
                                    bind:values={$filmRequest.film.title.values}
                                    bind:styles={$filmRequest.film.title.styles}
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
                                    bind:values={$filmRequest.film.real.values}
                                    bind:styles={$filmRequest.film.real.styles}
                                    admin={admin}
                                    edit={edit}
                                    updateContent={updateFilm}
                                />
                            </div>
                        </div>
                        <div class='row mt-3'>
                            <TextComponent
                                bind:values={$filmRequest.film.summury.values}
                                bind:styles={$filmRequest.film.summury.styles}
                                admin={admin}
                                edit={edit}
                                updateContent={updateFilm}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </CustomContainer>
{/if}
