<script context='module'>
  export const prerender = true;
</script>
<script>
    //import { push } from 'svelte-spa-router';
    import { goto } from '$app/navigation';
    
    import {
        Collapse,
        Navbar,
        NavbarToggler,
        NavbarBrand,
        Nav,
        NavItem,
        NavLink,
        Dropdown,
        DropdownToggle,
        DropdownMenu,
        DropdownItem,
Row,
Col,
    } from 'sveltestrap';
  
    const expand = 'xl';
    let isOpen = false;

    const navigateHandler = (url) => {
        isOpen = false;
        //push(url);
        goto(url);
    }

</script>
  
<Navbar 
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
                  <!-- <Dropdown nav inNavbar>
                      <DropdownToggle class='text-dark mx-2' nav caret><span class='titre'>LE FESTIVAL</span></DropdownToggle>
                      <DropdownMenu end class='bg-white'>
                        <DropdownItem class='bg-white'><NavItem><NavLink on:click={() => navigateHandler('/edito')}><span class='item'>Edito</span></NavLink></NavItem></DropdownItem>
                        <DropdownItem class='bg-white'><NavItem><NavLink on:click={() => navigateHandler('/partenaires')}><span class='item'>Partenaires</span></NavLink></NavItem></DropdownItem>
                        <DropdownItem class='bg-white'><NavItem><NavLink on:click={() => navigateHandler('/equipe')}><span class='item'>L'équipe</span></NavLink></NavItem></DropdownItem>
                      </DropdownMenu>
                  </Dropdown> -->
                  <Dropdown nav inNavbar>
                    <NavItem><NavLink class='text-dark mx-2' on:click={() => navigateHandler('/edito')}><span class='titre'>LE FESTIVAL</span></NavLink></NavItem>
                  </Dropdown>
                  <Dropdown nav inNavbar>
                    <NavItem><NavLink class='text-dark mx-2' on:click={() => navigateHandler('/partenaires')}><span class='titre'>NOS PARTENAIRES</span></NavLink></NavItem>
                  </Dropdown>
                  <Dropdown nav inNavbar>
                    <NavItem><NavLink class='text-dark mx-2' on:click={() => navigateHandler('/equipe')}><span class='titre'>L'EQUIPE</span></NavLink></NavItem>
                  </Dropdown>
                  <Dropdown nav inNavbar>
                    <NavItem><NavLink class='text-dark mx-2' on:click={() => navigateHandler('/programmation2021')}><span class='titre'>PROGRAMMATION 2021</span></NavLink></NavItem>
                  </Dropdown>
                  <!-- <Dropdown nav inNavbar>
                      <DropdownToggle class='text-dark mx-2' nav caret><span class='titre'>LA PROGRAMMATION 2021</span></DropdownToggle>
                      <DropdownMenu end class='bg-white'>
                        <DropdownItem class='bg-white'><NavItem><NavLink on:click={() => navigateHandler('/programmation/nantes')} ><span class='item'>Nantes</span></NavLink></NavItem></DropdownItem>
                        <DropdownItem class='bg-white'><NavItem><NavLink on:click={() => navigateHandler('/programmation/paris')} ><span class='item'>Paris</span></NavLink></NavItem></DropdownItem>
                        <DropdownItem class='bg-white'><NavItem><NavLink on:click={() => navigateHandler('/programmation/toulouse')} ><span class='item'>Toulouse</span></NavLink></NavItem></DropdownItem>
                      </DropdownMenu>
                  </Dropdown> -->
                  
                  <!-- <Dropdown nav inNavbar>
                      <DropdownToggle class='text-dark mx-2' nav caret><span class='titre'>PROJET PEDAGOGIQUE</span></DropdownToggle>
                      <DropdownMenu end class='bg-white'>
                        <DropdownItem class='bg-white'><NavItem><NavLink on:click={() => navigateHandler('/presentation')}><span class='item'>Présentation</span></NavLink></NavItem></DropdownItem>
                        <DropdownItem class='bg-white'><NavItem><NavLink on:click={() => navigateHandler('/projesseurs')}><span class='item'>Mots des professeurs</span></NavLink></NavItem></DropdownItem>
                        <DropdownItem class='bg-white'><NavItem><NavLink on:click={() => navigateHandler('/eleves')}><span class='item'>Elèves</span></NavLink></NavItem></DropdownItem>
                      </DropdownMenu>
                  </Dropdown> -->
                  <Dropdown nav inNavbar>
                      <NavItem><NavLink class='text-dark mx-2' on:click={() => navigateHandler('/informationsPratiques')}><span class='titre'>INFORMATIONS PRATIQUES</span></NavLink></NavItem>
                  </Dropdown>
                  <Dropdown nav inNavbar>
                    <NavItem><NavLink class='text-dark mx-2' on:click={() => navigateHandler('/billetterie')}><span class='titre'>BILLETTERIE</span></NavLink></NavItem>
                  </Dropdown>
                  <!-- <Dropdown nav inNavbar>
                      <DropdownToggle class='text-dark ms-2 me-5' nav caret><span class='titre'>BILLETTERIE</span></DropdownToggle>
                      <DropdownMenu end class='bg-white'>
                        <DropdownItem class='bg-white'><NavItem><NavLink on:click={() => navigateHandler('/billetterie/nantes')}><span class='item'>Nantes</span></NavLink></NavItem></DropdownItem>
                        <DropdownItem class='bg-white'><NavItem><NavLink on:click={() => navigateHandler('/billetterie/paris')}><span class='item'>Paris</span></NavLink></NavItem></DropdownItem>
                        <DropdownItem class='bg-white'><NavItem><NavLink on:click={() => navigateHandler('/billetterie/toulouse')}><span class='item'>Toulouse</span></NavLink></NavItem></DropdownItem>
                      </DropdownMenu>
                  </Dropdown> -->
            </Nav>
          </Collapse>
</Navbar>

<style>
  .titre {
    font-family: 'omotenashi_2regular';
    font-size: 1.3rem;
  }
  /* .item {
    font-family: 'Roboto-Regular';
    font-size:1.1rem;
    font-weight: bold;
  } */
  .icone-rs {
        max-width: 6vh;
        height: auto;
    }
</style>