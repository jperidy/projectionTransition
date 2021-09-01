<script>
	export let name = 'ProjectionTransition';
	name;
	
	import Router from 'svelte-spa-router';
	import { wrap } from 'svelte-spa-router/wrap';
	import Footer from './components/Footer.svelte';

	import Nav from "./components/Nav.svelte";
	import Article from './screens/Article.svelte';
	import Login from './screens/Login.svelte';

	import Page from "./screens/Page.svelte";

	const routes = {
		'/article/:category/:id': wrap({ component: Article}),
		'/login': wrap({ component: Login}),
		'/:name': wrap({ component: Page}),
		'/': wrap({ component: Page}),
	}

</script>

<svelte:head>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css">
</svelte:head>

<header>
	<Nav />
</header>

<main>
	<Router { routes }/>
</main>

<footer>
	<Footer />
</footer>


<style>
	:global(body) {
		/* this will apply to <body> */
		padding: 0;
	}
	main {
		margin-top: 15vh;
		min-height: 80vh;
	}
	footer {
		margin-top: 10vh;
	}
</style>