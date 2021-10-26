<script context='module'>
    export const prerender = true;
    import { getSeo } from '../actions/seoActions';
    export async function load({page}) {
        //load default seo informations
        const { seo } = await getSeo();
        return {status:200, props: {defaultSeo: seo}};
    };
</script>

<script>
    import Nav from '../components/Nav.svelte';
    import Footer from '../components/Footer.svelte';
    import config from '../config.json';
    const API_URL = config.SVELTE_ENV === 'dev' ? config.API_URL_DEV : config.SVELTE_ENV === 'preprod' ? config.API_URL_PREPROD : config.SVELTE_ENV === 'production' ? config.API_URL_PROD : config.API_URL_DEV;

    export let defaultSeo;
    //$: console.log("defaultSeo _layout", defaultSeo);
</script>

<!-- <svelte:head>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css">
  	<link rel="stylesheet" href="/mains.min.css">
    <link rel="icon" type="image/png" href="{config.SHEETS.FAVICON._48_48.path}" sizes="48x48" />
    <link rel="icon" type="image/png" href={config.SHEETS.FAVICON._64_64.path} sizes="64x64" />
    <link rel="icon" type="image/png" href={config.SHEETS.FAVICON._48_48.path} sizes="96x96" />
    <link rel="icon" type="image/png" href={config.SHEETS.FAVICON._48_48.path} sizes="128x128" />
    <link rel="icon" type="image/png" href={config.SHEETS.FAVICON._48_48.path} sizes="196x196" />
</svelte:head> -->

<svelte:head>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css">
  	<link rel="stylesheet" href="/mains.min.css">
    <link rel="icon" type="image/png" href={API_URL + defaultSeo.FAVICON_48_48} sizes="48x48" />
    <link rel="icon" type="image/png" href={API_URL + defaultSeo.FAVICON_64_64} sizes="64x64" />
    <link rel="icon" type="image/png" href={API_URL + defaultSeo.FAVICON_48_48} sizes="96x96" />
    <link rel="icon" type="image/png" href={API_URL + defaultSeo.FAVICON_48_48} sizes="128x128" />
    <link rel="icon" type="image/png" href={API_URL + defaultSeo.FAVICON_48_48} sizes="196x196" />
</svelte:head>

<div id='up'></div>

<main>
    <Nav />
    <slot></slot>
</main>
<footer>
	<Footer />
</footer>