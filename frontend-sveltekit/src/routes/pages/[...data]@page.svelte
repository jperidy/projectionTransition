<script context='module'>

    import { getContent } from '../../actions/pagesActions';
    import { getSeo } from '../../actions/seoActions';
    
    export async function load({ url, params }) {
        
        let [name, city] = params.data.split('/');

        name = name ? name : 'homeContent' ;
        city = city ? city : '';

        //verify if login is requested
        let redirection = url.pathname.split('/login');

        //load default seo informations
        const { seo } = await getSeo();

        let pageRequest = { content: { content: [], name: '' }, loading: true, message: '' };
        if (redirection.length === 1) {
            let pageName = params.data.replace('/','-');
            pageName = pageName === '' ? 'homeContent' : pageName;
            pageRequest = await getContent(pageName);
            
            if (pageRequest.content.content.length === 0) {
                console.log('here1');
                return { status: 308, redirect: `/page-not-found` }
            }

            if (!pageRequest.content.display) {
                console.log('here2');
                return { status: 308, redirect: `/page-not-found` }
            }
            
            return { status:200, props: {pageRequest, city, url, defaultSeo: seo} };
        } else {
            return { status: 307, redirect: `/login?redirection=${redirection[0]}` }
        }
    }

</script>

<script>
    
    export let city;
    export let pageRequest;
    export let url;
    export let defaultSeo;

    import config from '../../config.json';
    const SITE_URL = config.API_URL;
    
    import DisplayCustomComponent from '../../components/DisplayCustomComponent.svelte';
    import Message from '../../components/Message.svelte';
    import Loading from '../../components/Loading.svelte';
    import { goto } from '$app/navigation';
    import { browser } from '$app/env';
    import SeoComponent from '../../components/SeoComponent.svelte';
    

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
                        city={city}
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