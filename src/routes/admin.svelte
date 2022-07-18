<script context='module'>
    import { getSeo } from '../actions/seoActions';
    import { getFonts } from '../actions/fontsActions';
    import { getNavBar } from '../actions/navActions';
    import { getFooter } from '../actions/footerActions';
    import { getAllPagesList, getContent, updateOrCreateContent } from "../actions/pagesActions";

    export async function load({url}) {
        const currentPage = '/pages/homeContent'
        const { navBar } = await getNavBar();
        const { footer } = await getFooter();
        const { seo } = await getSeo();
        const { fonts } = await getFonts();
        const { list: pagesList} = await getAllPagesList();
        const pageRequest = await getContent(currentPage.split('/pages/')[1]);

        return {
            status:200, 
            props: {
                defaultSeo: seo, 
                navBar, 
                footer, 
                fonts, 
                url,
                pagesList,
                pageRequest,
                currentPage: currentPage
            }
        };
    };
</script>

<script>
    import DisplayCustomComponent from "../components/DisplayCustomComponent.svelte";
    import MenuPage from "../components/admin/MenuPage.svelte";
    import MenuEdit from "../components/admin/MenuEdit.svelte";
    import { userInfo } from "../store";
    import { logout } from "../actions/userActions";
    import { goto } from "$app/navigation";
    import { browser } from "$app/env";
    import EditSeoComponent from "../components/admin/EditSeoComponent.svelte";
    import MenuParamGlobal from "../components/admin/MenuParamGlobal.svelte";
    import EditNavigationNavBar from "../components/admin/EditNavigationNavBar.svelte";
    import EditFontsComponent from "../components/admin/EditFontsComponent.svelte";
    import EditDefaultSeoComponent from "../components/admin/EditDefaultSeoComponent.svelte";
    import EditFaviconComponent from "../components/admin/EditFaviconComponent.svelte";
    import EditFooter from "../components/admin/EditFooter.svelte";
    import config from '../config.json';
    import Footer from '../components/Footer.svelte';
    import Nav from '../components/Nav.svelte';
    import SeoComponent from '../components/SeoComponent.svelte';
    const SITE_URL = config.API_URL;

    export let defaultSeo;
    export let fonts;
    export let url;
    export let navBar;
    export let footer;
    export let pagesList;
    export let pageRequest;
    export let currentPage;

    const API_URL = config.API_URL;

    let selectedComponent = {id:"", position:null};
    let showMenuPage = true;
    let showNavigationBar = false;
    let showFooter = false;
    let showFonts = false;
    let showDefaultSeo = false;
    let showFavicon = false;
    
    let isAuthenticate = false;
    $: {
        isAuthenticate = $userInfo && $userInfo.profil === 'admin' ? true : false;
        if (browser && !isAuthenticate) { goto('/login'); }
    };

    const getPages = async () => {
        pagesList = (await getAllPagesList()).list;
    };

    const selectPageHandler = async (pageName) => {
        currentPage = pageName
        pageRequest = await getContent(currentPage.split('/pages/')[1]);
    };

    const updateContent = async() => {
        pageRequest = await updateOrCreateContent(pageRequest.content);
        currentPage = pageRequest.content.name;
        getPages();
    };

    const showPageHandler = () => {
        showNavigationBar = false;
        showFooter = false;
        showFonts = false;
        showDefaultSeo = false;
        showFavicon = false;
    }

</script>

<!-- header to be able to see any changes -->
<svelte:head>
    <!-- JavaScript Bundle with Popper -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/js/bootstrap.bundle.min.js" integrity="sha384-pprn3073KE6tl6bjs2QrFaJGz5/SUsLqktiwsUTF55Jfv3qYSDhgCecCxMW52nD2" crossorigin="anonymous"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css">
    <link rel="stylesheet" href="/mains.min.css">
    <link rel="icon" type="image/png" href={API_URL + defaultSeo.FAVICON_48_48} sizes="48x48" />
    <link rel="icon" type="image/png" href={API_URL + defaultSeo.FAVICON_64_64} sizes="64x64" />
    <link rel="icon" type="image/png" href={API_URL + defaultSeo.FAVICON_96_96} sizes="96x96" />
    <link rel="icon" type="image/png" href={API_URL + defaultSeo.FAVICON_128_128} sizes="128x128" />
    <link rel="icon" type="image/png" href={API_URL + defaultSeo.FAVICON_196_196} sizes="196x196" />
    
    {#if fonts && fonts.length > 0}
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        {#each fonts as font}
            <link href={`${font.href}`} rel="stylesheet">
        {/each}
    {/if}
</svelte:head>

<div id='up'></div>

<main>
    <Nav navBar={navBar} />
    {#if isAuthenticate}
        <div class="row">
            <!-- zone to list and select a page -->
            {#if showMenuPage}
                <div 
                    class="col-2 menu-page shadow-lg overflow-auto"
                    id='admin-nav'
                >
                    <div class="px-1 py-2">
                        <MenuParamGlobal 
                            bind:showNavigationBar={showNavigationBar}
                            bind:showFooter={showFooter}
                            bind:showFonts={showFonts}
                            bind:showDefaultSeo={showDefaultSeo}
                            bind:showFavicon={showFavicon}
                        />
                        <div on:click={showPageHandler}>
                            <MenuPage 
                                pagesList={pagesList} 
                                getPages={getPages} 
                                currentPage={currentPage} 
                                selectPageHandler={selectPageHandler} 
                            />
                        </div>
                    </div>
                </div>
            {/if}
        
            <!-- zone to edit components of selected page -->
            <div 
                class={`${showMenuPage ? "col-4" : "col-6"} shadow-lg position-relative px-0`}
                id='admin-edit-panel'
            >
                <div class="overflow-auto menu-edition">
                    <div class="py-1">
                        <MenuEdit 
                            bind:page={pageRequest.content}
                            bind:selectedComponent={selectedComponent}
                            updateContent={updateContent}
                        />
                    </div>
                    <div class="py-1">
                        <EditSeoComponent bind:pageContent={pageRequest.content} />
                    </div>
                </div>
                <button 
                    class="btn btn-dark btn-sm border border-3 rounded-circle position-absolute top-50 start-0 translate-middle"
                    on:click={() => showMenuPage = !showMenuPage}
                >
                    {#if showMenuPage}
                        <i class="bi bi-chevron-left"></i>
                    {:else}
                        <i class="bi bi-chevron-right"></i>
                    {/if}
                </button>
            </div>
        
            <!-- zone to preview your page -->
            <div class="col-6 p-0 preview ">
                <!-- select the screen size -->
                <div 
                    class="shadow px-3 py-auto d-flex align-items-center justify-content-center"
                    id="bandeau"
                >
                    <h3 class="my-0 mx-2">Previews </h3>
                    <button
                            class='btn btn-light'
                            style='margin-left:auto'
                            on:click={() => logout()}
                            block
                        ><i class="bi bi-door-open"></i>Logout</button>
                </div>

                <!-- preview -->    
                <div id="display-preview" class="display-preview overflow-auto">
                    {#if showNavigationBar}
                        <EditNavigationNavBar bind:navBar={navBar} />
                    {/if}
                    {#if showFonts}
                        <EditFontsComponent bind:fonts={fonts}/>
                    {/if}
                    {#if showDefaultSeo}
                        <EditDefaultSeoComponent bind:seo={defaultSeo} />
                    {/if}
                    {#if showFavicon}
                        <EditFaviconComponent bind:seo={defaultSeo} />
                    {/if}
                    {#if showFooter}
                        <EditFooter bind:footer={footer}/>
                    {/if}
                    {#if (!showNavigationBar && !showFooter && !showFonts && !showDefaultSeo && !showFavicon)}
                        {#if pageRequest.content && pageRequest.content.content}
                            {#each pageRequest.content.content as section, position}
                                <DisplayCustomComponent 
                                    bind:value={section.value}
                                    bind:values={section.values}
                                    bind:styles={section.styles}
                                    type={section.type}
                                    updateContent={null}
                                    admin={false}
                                    edit={false}
                                    city={"city"}
                                    isSelected={{select: section._id === selectedComponent.id, position: selectedComponent.position}}
                                />   
                            {/each}
                        {/if}
                    {/if}
                </div>
            </div>
        </div>
        <SeoComponent 
            pageContent={pageRequest.content}
            url={url}
            siteURL={SITE_URL}
            defaultSeo={defaultSeo}
        />  
    {/if} 
</main>

<footer>
	<Footer footer={footer} />
</footer>


<style>
    .menu-page {
        height: 90vh;
    }
    .menu-edition {
        height: 90vh;
    }
    .display-preview {
        height: 80vh;
    }
    #bandeau {
        height: 10vh;
        background-color: rgb(88, 88, 88);
    }
    #admin-nav {
        background-color: rgb(88, 88, 88);
        color:white;
    }
    #admin-edit-panel {
        background-color: rgb(190, 190, 190);
        color:rgb(88, 88, 88);
    }
</style>