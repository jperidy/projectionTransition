<script context="module">
    export const prerender = true;
</script>
<script>
    import CustomContainer from "./CustomContainer.svelte";
    import config from '../config.json'
    const API_URL = config.SVELTE_ENV === 'dev' ? config.API_URL_DEV : config.SVELTE_ENV === 'preprod' ? config.API_URL_PREPROD : config.SVELTE_ENV === 'production' ? config.API_URL_PROD : config.API_URL_DEV;

    export let pageContent;
    export let page;
    export let siteURL;
    export let defaultSeo;


</script>

<svelte:head>
    <title>{`${pageContent && pageContent.titleSeo ? pageContent.titleSeo : defaultSeo.DEFAULT_TITLE}`}</title>
	<meta name='description' content={`${pageContent && pageContent.descriptionSeo ? pageContent.descriptionSeo : defaultSeo.DEFAULT_DESCRIPTION}`} />
	<meta property="og:title" content={`${pageContent && pageContent.titleOG ? pageContent.titleOG : defaultSeo.DEFAULT_OG_TITLE}`} />
	<meta property="og:description" content={`${pageContent && pageContent.descriptionOG ? pageContent.descriptionOG : defaultSeo.DEFAULT_OG_DESCRIPTION}`} />
	<meta property="og:type" content="website" />
	<meta property="og:image" content={API_URL + defaultSeo.DEFAULT_OG_IMAGE} />
	<meta property="og:image:width" content="800" />
	<meta property="og:image:height" content="400" />
	<meta property="og:url" content={`${siteURL}${page.path}`} />
	<meta property="og:locale" content="fr_FR" />
	<meta name="twitter:image" content={API_URL + defaultSeo.DEFAULT_OG_IMAGE} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:description" content={`${pageContent && pageContent.descriptionOG ? pageContent.descriptionOG : defaultSeo.DEFAULT_OG_DESCRIPTION}`} />
</svelte:head>