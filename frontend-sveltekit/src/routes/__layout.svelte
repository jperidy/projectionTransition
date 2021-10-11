<script context='module'>
    export const prerender = true; 
</script>

<script>
    import Nav from '../components/Nav.svelte';
    import Footer from '../components/Footer.svelte';
    import config from '../config.json';
</script>

<svelte:head>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css">
  	<link rel="stylesheet" href="/mains.min.css">
    <link rel="icon" type="image/png" href="{config.SHEETS.FAVICON._48_48.path}" sizes="48x48" />
    <link rel="icon" type="image/png" href={config.SHEETS.FAVICON._64_64.path} sizes="64x64" />
    <link rel="icon" type="image/png" href={config.SHEETS.FAVICON._48_48.path} sizes="96x96" />
    <link rel="icon" type="image/png" href={config.SHEETS.FAVICON._48_48.path} sizes="128x128" />
    <link rel="icon" type="image/png" href={config.SHEETS.FAVICON._48_48.path} sizes="196x196" />
</svelte:head>

<div id='up'></div>

<main>
    <Nav />
    <slot></slot>
</main>
<footer>
	<Footer />
</footer>