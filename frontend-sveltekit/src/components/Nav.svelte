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
    <img class='img-fluid' style={config.NAV_BAR.BRAND.LOGO.style} src={config.NAV_BAR.BRAND.LOGO.path} alt={config.NAV_BAR.BRAND.LOGO.path}/>
  </NavbarBrand>
  <div class='mx-auto'>
    {#each config.NAV_BAR.SOCIAL_NETWORKS as item}
      <span class='fw-bold'><a class="" target={item.target} href={item.redirect}><img class='icone-rs' style={config.NAV_BAR.STYLE.SOCIAL_NETWORKS.style} src={item.icon} alt={item.alt} /></a></span>
      
    {/each}
  </div>
  <NavbarToggler on:click={() => (isOpen = !isOpen)} />
  <Collapse {isOpen} navbar expand={expand}>
    <Nav class="ms-auto align-items-center" navbar>
      {#each config.NAV_BAR.TITLE as item}
        <Dropdown nav inNavbar>
          <NavItem><NavLink class={config.NAV_BAR.STYLE.TITLE.bootstrapClass} style={config.NAV_BAR.STYLE.TITLE.style} on:click={() => navigateHandler(item.url)}><span >{item.name.toString()}</span></NavLink></NavItem>
        </Dropdown>
      {/each}
    </Nav>
  </Collapse>
</Navbar>