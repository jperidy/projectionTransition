<script context='module'>
  export const prerender = true;
</script>

<script>
  import { goto } from '$app/navigation';
  import { getNavBar } from '../actions/navActions';
  import { getSeo } from '../actions/seoActions';
  import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink, Dropdown } from 'sveltestrap';
  import { onMount } from 'svelte';
  import Message from './Message.svelte';
  import config from '../config.json';
  const API_URL = config.SVELTE_ENV === 'dev' ? config.API_URL_DEV : config.SVELTE_ENV === 'preprod' ? config.API_URL_PREPROD : config.SVELTE_ENV === 'production' ? config.API_URL_PROD : config.API_URL_DEV;
  
  let messageUpdateNav = '';
  let messageUpdateSeo = '';
    
  let isOpen = false;

  const navigateHandler = (url) => {
      isOpen = false;
      goto(url);
  };

  // DEFAULT navBar
  export let navBar = {
    name:"nav",
    "TITLE": [{"name": "MENU 1", "url": "", "SUBTITLE": []}],
    "BRAND": {"LOGO": {"path": "", "alt": "", "style": "max-width: 20vh; height:auto;"},"NAME": ""},
    "SOCIAL_NETWORKS": [{"name": "", "icon": "", "alt": "", "redirect": "", "target": "_blank"}],
    "STYLE": {"expand": "xl","color": "white","theme": "light","TITLE": { "bootstrapClass": "text-dark mx-2", "style": "font-family: omotenashi_2regular;font-size: 1.3rem;" },"SOCIAL_NETWORKS": { "bootstrapClass": "", "style": "max-width: 6vh;height: auto;"}}
  };

  // Default SEO
  let seo = {
    "name": "seo",
    "DEFAULT_TITLE": "",
    "DEFAULT_DESCRIPTION": "",
    "DEFAULT_OG_TITLE": "",
    "DEFAULT_OG_DESCRIPTION": "",
    "DEFAULT_OG_IMAGE": "",
    "FAVICON_48_48": "",
    "FAVICON_64_64": "",
    "FAVICON_96_96": "",
    "FAVICON_128_128": "",
    "FAVICON_196_196": ""
  }

  onMount(async () => {
    // load navBar
    let navRequest = await getNavBar();
    if (navRequest && navRequest.navBar) {
      for (let key in navRequest.navBar) {
        navBar[key] = navRequest.navBar[key];
      }
    }
    navBar = navBar;

    // load seo
    let seoRequest = await getSeo();
    if (seoRequest && seoRequest.seo) {
      for (let key in seoRequest.seo) {
        seo[key] = seoRequest.seo[key];
      }
    }
    seo = seo;
  });

  const expand = navBar.STYLE.expand;

</script>

{#if messageUpdateNav}
  <Message color='danger'>{messageUpdateNav}</Message>
{/if}
{#if messageUpdateSeo}
  <Message color='danger'>{messageUpdateSeo}</Message>
{/if}

<!-- NavBar to display -->
<Navbar 
color={navBar.STYLE.color}
light={navBar.STYLE.theme === "light"}
dark={navBar.STYLE.theme === "dark"}
expand={expand}
>
<NavbarBrand on:click={() => navigateHandler('/')}>
  <img class='img-fluid' style={navBar.BRAND.LOGO.style} src={API_URL + navBar.BRAND.LOGO.path} alt={navBar.BRAND.LOGO.alt}/>
</NavbarBrand>
<div class='mx-auto d-flex'>
  {#each navBar.SOCIAL_NETWORKS as item}
    <div class={`fw-bold ${navBar.STYLE.SOCIAL_NETWORKS.bootstrapClass}`}><a class="" target={item.target} href={item.redirect}><img class='icone-rs' style={navBar.STYLE.SOCIAL_NETWORKS.style} src={API_URL + item.icon} alt={item.alt} /></a></div>
  {/each}
</div>
<NavbarToggler on:click={() => (isOpen = !isOpen)} />
<Collapse {isOpen} navbar expand={expand}>
  <Nav class="ms-auto align-items-center" navbar>
    {#each navBar.TITLE as item}
      <Dropdown nav inNavbar>
        <NavItem><NavLink class={navBar.STYLE.TITLE.bootstrapClass} style={navBar.STYLE.TITLE.style} on:click={() => navigateHandler(item.url)}><span >{item.name.toString()}</span></NavLink></NavItem>
      </Dropdown>
    {/each}
  </Nav>
</Collapse>
</Navbar>