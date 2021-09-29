<script context='module'>
    export const prerender = true; 
</script>
<script>
    import Nav from '../components/Nav.svelte';
    import Footer from '../components/Footer.svelte';
</script>

<svelte:head>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css">
  	<link rel="stylesheet" href="/global.css">
  	<link rel="stylesheet" href="/mains.min.css">
</svelte:head>

<div id='up'></div>

<main>
    <Nav />
    <slot></slot>
</main>
<footer>
	<Footer />
</footer>