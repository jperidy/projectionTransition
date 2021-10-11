<script context='module'>
  export const prerender = true;
</script>
<script>
  import { goto } from '$app/navigation';
  
  import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    Dropdown
    } from 'sveltestrap';

    import config from '../config.json';
  
    //const expand = 'xl';
    const expand = config.NAV_BAR.STYLE.expand;
    
    let isOpen = false;

    const navigateHandler = (url) => {
        isOpen = false;
        goto(url);
    }

</script>

<Navbar 
color={config.NAV_BAR.STYLE.color}
light={config.NAV_BAR.STYLE.theme === "light"}
dark={config.NAV_BAR.STYLE.theme === "dark"}
expand={expand}
>
  <NavbarBrand on:click={() => navigateHandler('/')}>
    <img class='img-fluid' style={`max-width: ${config.NAV_BAR.STYLE.brandLogoWidth}; height:auto;`} src={config.NAV_BAR.BRAND.LOGO.path} alt={config.NAV_BAR.BRAND.LOGO.path}/>
  </NavbarBrand>
  <div class='mx-auto'>
    {#each config.NAV_BAR.SOCIAL_NETWORKS as item}
      <span class='fw-bold'><a class="" target={item.target} href={item.redirect}><img class='icone-rs' style={`max-width: ${config.NAV_BAR.STYLE.socialNetworkMaxWidth};height: auto;`} src={item.icon} alt={item.alt} /></a></span>
      
    {/each}
  </div>
  <NavbarToggler on:click={() => (isOpen = !isOpen)} />
  <Collapse {isOpen} navbar expand={expand}>
    <Nav class="ms-auto align-items-center" navbar>
      {#each config.NAV_BAR.TITLE as item}
        <Dropdown nav inNavbar>
          <NavItem><NavLink class={config.NAV_BAR.STYLE.titleClass} on:click={() => navigateHandler(item.url)}><span class='titre' style={`font-family: ${config.NAV_BAR.STYLE.titleFont.family};font-size: ${config.NAV_BAR.STYLE.titleFont.size}`}>{item.name.toString()}</span></NavLink></NavItem>
        </Dropdown>
      {/each}
    </Nav>
  </Collapse>
</Navbar>
  
<!-- <Navbar 
color="white"
light
expand={expand}
>
  <NavbarBrand on:click={() => navigateHandler('/')}>
    <img class='img-fluid' style="max-width: 20vh; height:auto;" src='/images/Logo_Principal.jpg' alt='logo'/>
  </NavbarBrand>
  <div class='mx-auto'>
    <span class='fw-bold'><a class="" target="_self" href="/informationsPratiques#contact"><img class='icone-rs' src="/icones/MAIL.004.png" alt="icone envoyer mail" /></a></span>
    <span class='fw-bold'><a class="" target="_blank" href="https://www.facebook.com/FestivalProjectionTransition/"><img class='icone-rs' src="/icones/FB.004.png" alt="icone lien Facebook" /></a></span>
    <span class='fw-bold'><a class="" target="_blank" href="https://www.instagram.com/projectiontransition/"><img class='icone-rs' src="/icones/INSTA.004.png" alt="icone lien Instagram" /></a></span>
    <span class='fw-bold'><a class="" target="_blank" href="https://www.youtube.com/channel/UCgSSefHpeDC42nXZcOy97aA"><img class='icone-rs' src="/icones/YT.004.png" alt="icone lien Youtube" /></a></span>
  </div>
  <NavbarToggler on:click={() => (isOpen = !isOpen)} />
  <Collapse {isOpen} navbar expand={expand}>
      <Nav class="ms-auto align-items-center" navbar>
          <Dropdown nav inNavbar>
            <NavItem><NavLink class='text-dark mx-2' on:click={() => navigateHandler('/edito')}><span class='titre'>LE FESTIVAL</span></NavLink></NavItem>
          </Dropdown>
          <Dropdown nav inNavbar>
            <NavItem><NavLink class='text-dark mx-2' on:click={() => navigateHandler('/partenaires')}><span class='titre'>NOS PARTENAIRES</span></NavLink></NavItem>
          </Dropdown>
          <Dropdown nav inNavbar>
            <NavItem><NavLink class='text-dark mx-2' on:click={() => navigateHandler('/equipe')}><span class='titre'>L'&Eacute;QUIPE</span></NavLink></NavItem>
          </Dropdown>
          <Dropdown nav inNavbar>
            <NavItem><NavLink class='text-dark mx-2' on:click={() => navigateHandler('/programmation2021')}><span class='titre'>PROGRAMMATION 2021</span></NavLink></NavItem>
          </Dropdown>
          <Dropdown nav inNavbar>
              <NavItem><NavLink class='text-dark mx-2' on:click={() => navigateHandler('/informationsPratiques')}><span class='titre'>INFORMATIONS PRATIQUES</span></NavLink></NavItem>
          </Dropdown>
          <Dropdown nav inNavbar>
            <NavItem><NavLink class='text-dark mx-2' on:click={() => navigateHandler('/billetterie')}><span class='titre'>BILLETTERIE</span></NavLink></NavItem>
          </Dropdown>
    </Nav>
  </Collapse>
</Navbar> -->

<style>
  /* .titre {
    font-family: 'omotenashi_2regular';
    font-size: 1.3rem;
  } */
  /* .icone-rs {
        max-width: 6vh;
        height: auto;
    } */
</style>