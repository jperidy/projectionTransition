<script>
    import Nav from '../components/Nav.svelte';
    import Footer from '../components/Footer.svelte';
</script>

<svelte:head>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css">
  	<link rel="stylesheet" href="/global.css">
  	<link rel="stylesheet" href="/mains.min.css">

    <title>Projection Transition</title>
    <meta name='description' content="Retrouvez toutes les informations sur le festival Projection Transition" />
    <meta name='keywords' content="écologie, transition, projection transition, cinéma, shiftProject, cine-debat" />
    <meta property="og:title" content="Projection Transition - Le festival ciné-débat pour la transition écologique" />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="https://dev.projtran.jprdev.ovh/images/og_logo.jpg" />
    <meta property="og:image:width" content="800" />
    <meta property="og:image:height" content="400" />
    <meta property="og:url" content="https://dev.projtran.jprdev.ovh/">
    <meta property="og:locale" content="fr_FR" />
    <meta name="twitter:image" content="https://dev.projtran.jprdev.ovh/images/og_logo.jpg" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:description" content="Retrouvez toutes les informations sur le festival Projection Transition" />

</svelte:head>


<Nav />
<main>
    <slot></slot>
</main>
<footer>
	<Footer />
</footer>