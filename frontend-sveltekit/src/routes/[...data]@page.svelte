<script context='module'>

    import { getContent } from '../actions/pagesActions';
    import { getSeo } from '../actions/seoActions';
    
    export const prerender = true;

    export async function load({url, params}) {
        const parameters = { name: 'homeContent', city:'' }
        
        let [name, city] = params.data.split('/');

        parameters.name = name !== '' ? name : 'homeContent' ;
        parameters.city = city ? city : '';

        //verify if login is requested
        let redirection = url.pathname.split('/login');

        //load default seo informations
        const { seo } = await getSeo();

        let pageRequest = { content: { content: [], name: '' }, loading: true, message: '' };
        if (redirection.length === 1) {
            let pageName = url.pathname.substring(1).replace('/','-');
            pageName = pageName === '' ? 'homeContent' : pageName;
            pageRequest = await getContent(pageName);
            
            if (pageRequest.content.content.length === 0) {
                return { status: 308, redirect: `/`}
            }

            if (!pageRequest.content.display) {
                return { status: 308, redirect: `/`}
            }
            
            return {status:200, props: {pageRequest, params: parameters, url, defaultSeo: seo}};
        } else {
            return { status: 307, redirect: `/login?redirection=${redirection[0]}`}
        }
    }

</script>

<script>
    
    export let params;
    export let pageRequest;
    export let url;
    export let defaultSeo;

    import config from '../config.json';
    const SITE_URL = config.SVELTE_ENV === 'dev' ? config.SITE_URL_DEV : config.SVELTE_ENV === 'preprod' ? config.SITE_URL_PREPROD : config.SVELTE_ENV === 'production' ? config.SITE_URL_PROD : config.SITE_URL_DEV;
    
    import DisplayCustomComponent from '../components/DisplayCustomComponent.svelte';
    import Message from '../components/Message.svelte';
    import Loading from '../components/Loading.svelte';
    import { goto } from '$app/navigation';
    import { browser } from '$app/env';
    import SeoComponent from '../components/SeoComponent.svelte';
    

    $: {
        if (browser && pageRequest.message) {
            goto('/');
        }
    }

</script>

{#if pageRequest.message}
    <Message color='warning'>{pageRequest.message}</Message>
{/if}

{#if pageRequest.loading}
    <Loading color='secondary' number={3} />
{:else}
    <div class="row">
        <div class="col">
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
                        city={params.city}
                    />
                {/each}
            {/if}
        </div>
        <SeoComponent 
            pageContent={pageRequest.content}
            url={url}
            siteURL={SITE_URL}
            defaultSeo={defaultSeo}
        />  
    </div>
{/if}