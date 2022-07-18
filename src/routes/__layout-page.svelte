<script context='module'>
    
    import { getSeo } from '../actions/seoActions';
    import { getFonts } from '../actions/fontsActions';
    import { getNavBar } from '../actions/navActions';
    import { getFooter } from "../actions/footerActions";
    
    export async function load({}) {

        const { navBar } = await getNavBar();
        const { footer } = await getFooter();
        const { seo } = await getSeo();
        const { fonts } = await getFonts();
        return { 
            status: 200, 
            props: {
                seo, 
                fonts,
                navBar,
                footer
            }
        };
    };
</script>

<script>
    import Nav from '../components/Nav.svelte';
    import Footer from '../components/Footer.svelte';

    export let seo;
    export let fonts;
    export let navBar;
    export let footer;

</script>

<svelte:head>
    <!-- JavaScript Bundle with Popper -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/js/bootstrap.bundle.min.js" integrity="sha384-pprn3073KE6tl6bjs2QrFaJGz5/SUsLqktiwsUTF55Jfv3qYSDhgCecCxMW52nD2" crossorigin="anonymous"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css">
    <link rel="stylesheet" href="/mains.min.css">
    <link rel="icon" type="image/png" href={seo.FAVICON_48_48} sizes="48x48" />
    <link rel="icon" type="image/png" href={seo.FAVICON_64_64} sizes="64x64" />
    <link rel="icon" type="image/png" href={seo.FAVICON_96_96} sizes="96x96" />
    <link rel="icon" type="image/png" href={seo.FAVICON_128_128} sizes="128x128" />
    <link rel="icon" type="image/png" href={seo.FAVICON_196_196} sizes="196x196" />
    
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
    <Nav navBar={navBar}/>
    <slot></slot>
</main>

<footer>
	<Footer footer={footer} />
</footer>