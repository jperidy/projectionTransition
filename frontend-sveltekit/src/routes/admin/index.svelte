<script context='module'>
    export const prerender = true;
    import { getSeo } from '../../actions/seoActions';
    import { getFonts } from '../../actions/fontsActions';
    export async function load({page}) {
        // load default seo informations
        const { seo } = await getSeo();
        // load default fonts
        const { fonts } = await getFonts();
        return {status:200, props: {defaultSeo: seo, fonts: fonts, page}};
    };
</script>

<script>
    import { getAllPagesList, getContent, updateOrCreateContent } from "../../actions/pagesActions";
    import { onMount } from "svelte";
    import DisplayCustomComponent from "../../components/DisplayCustomComponent.svelte";
    import MenuPage from "../../components/admin/MenuPage.svelte";
    import MenuEdit from "../../components/admin/MenuEdit.svelte";
    import { userInfo } from "../../store";
    import { logout } from "../../actions/userActions";
    import { goto } from "$app/navigation";
    import { browser } from "$app/env";
    import EditSeoComponent from "../../components/admin/EditSeoComponent.svelte";
    import MenuParamGlobal from "../../components/admin/MenuParamGlobal.svelte";
    import EditNavigationNavBar from "../../components/admin/EditNavigationNavBar.svelte";
    import EditFontsComponent from "../../components/admin/EditFontsComponent.svelte";
    import EditDefaultSeoComponent from "../../components/admin/EditDefaultSeoComponent.svelte";
    import EditFaviconComponent from "../../components/admin/EditFaviconComponent.svelte";
    import EditFooter from "../../components/admin/EditFooter.svelte";
    import config from '../../config.json';
    import Footer from '../../components/Footer.svelte';
    import Nav from '../../components/Nav.svelte';
    import SeoComponent from '../../components/SeoComponent.svelte';
    const SITE_URL = config.SVELTE_ENV === 'dev' ? config.SITE_URL_DEV : config.SVELTE_ENV === 'preprod' ? config.SITE_URL_PREPROD : config.SVELTE_ENV === 'production' ? config.SITE_URL_PROD : config.SITE_URL_DEV;

    export let defaultSeo;
    export let fonts;
    export let page;

    const API_URL = config.SVELTE_ENV === 'dev' ? config.API_URL_DEV : config.SVELTE_ENV === 'preprod' ? config.API_URL_PREPROD : config.SVELTE_ENV === 'production' ? config.API_URL_PROD : config.API_URL_DEV;

    let pageRequest = { content: { content: [], name: '' }, loading: true, message: '' };
    let selectedComponent = {id:"", position:null};
    let currentPage = "";
    let showMenuPage = true;
    let showNavigationBar = false;
    let showFooter = false;
    let showFonts = false;
    let showDefaultSeo = false;
    let showFavicon = false;

    let navBar;
    let footer;
    
    let isAuthenticate = false;
    $: {
        isAuthenticate = $userInfo && $userInfo.profil === 'admin' ? true : false;
        if (browser && !isAuthenticate) { goto('/login'); }
    };

    let pagesList = [];
    const getPages = async () => {
        const pagesListRequest = await getAllPagesList();
        pagesList = pagesListRequest.list;
    };

    onMount(async() => {
        getPages();
        currentPage = 'homeContent'
        pageRequest = await getContent(currentPage);
    });

    const selectPageHandler = async (pageName) => {
        currentPage = pageName
        pageRequest = await getContent(currentPage);
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
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css">
    <link rel="stylesheet" href="/mains.min.css">
    <link rel="icon" type="image/png" href={API_URL + defaultSeo.FAVICON_48_48} sizes="48x48" />
    <link rel="icon" type="image/png" href={API_URL + defaultSeo.FAVICON_64_64} sizes="64x64" />
    <link rel="icon" type="image/png" href={API_URL + defaultSeo.FAVICON_48_48} sizes="96x96" />
    <link rel="icon" type="image/png" href={API_URL + defaultSeo.FAVICON_48_48} sizes="128x128" />
    <link rel="icon" type="image/png" href={API_URL + defaultSeo.FAVICON_48_48} sizes="196x196" />
    
    <!-- work in progress to add fonts from googleapis -->
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
                <div class="col-2 menu-page bg-dark shadow-lg overflow-auto">
                    <div class="px-1 py-2">
                        <MenuParamGlobal 
                            bind:showNavigationBar={showNavigationBar}
                            bind:showFooter={showFooter}
                            bind:showFonts={showFonts}
                            bind:showDefaultSeo={showDefaultSeo}
                            bind:showFavicon={showFavicon}
                        />
                        <div on:click={showPageHandler}>
                            <MenuPage pagesList={pagesList} getPages={getPages} currentPage={currentPage} selectPageHandler={selectPageHandler} />
                        </div>
                    </div>
                </div>
            {/if}
        
            <!-- zone to edit components of selected page -->
            <div class={`${showMenuPage ? "col-3" : "col-5"} bg-light shadow-lg text-dark position-relative px-0`}>
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
            <div class="col-7 p-0 preview ">
                <!-- select the screen size -->
                <div class="bandeau bg-dark border-light shadow px-3 py-auto d-flex align-items-center justify-content-center">
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
            page={page}
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
    .bandeau {
        height: 10vh;
    }
</style>