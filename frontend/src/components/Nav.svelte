<script>
    import { push } from 'svelte-spa-router';
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
    } from 'sveltestrap';
  
    const expand = 'xl';
    let isOpen = false;

    const navigateHandler = (url) => {
        isOpen = false;
        push(url);
    }

</script>

<!-- <div>
<nav class="navbar navbar-expand-lg navbar-light bg-light">
  <div class="container-fluid">
    <a class="navbar-brand" href="#/">Navbar</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <a class="nav-link active" aria-current="page" href="#/">Home</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#/">Link</a>
        </li>
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#/" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            Dropdown
          </a>
          <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
            <li><a class="dropdown-item" href="#/">Action</a></li>
            <li><a class="dropdown-item" href="#/">Another action</a></li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item" href="#/">Something else here</a></li>
          </ul>
        </li>
        <li class="nav-item">
          <a class="nav-link disabled" href="#/" tabindex="-1" aria-disabled="true">Disabled</a>
        </li>
      </ul>
      <form class="d-flex">
        <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
        <button class="btn btn-outline-success" type="submit">Search</button>
      </form>
    </div>
  </div>
</nav>
</div> -->
  
<Navbar 
    color="white"
    light
    expand={expand}
    class='mb-3 fixed-top'
>
    <NavbarBrand on:click={() => navigateHandler('/')}>
      <img class='img-fluid mx-3' style="max-width: 130px;" src='/images/logo-projection-transition.png' alt='logo'/>
    </NavbarBrand>
    <NavbarToggler on:click={() => (isOpen = !isOpen)} />
    <Collapse {isOpen} navbar expand={expand} style="margin-right:10vh;">
        <Nav class="ms-auto align-items-center" navbar>
            <Dropdown nav inNavbar>
                <DropdownToggle class='text-dark mx-2' nav caret><span class='titre'>LE FESTIVAL</span></DropdownToggle>
                <DropdownMenu end class='bg-white'>
                  <DropdownItem class='bg-white'><NavItem><NavLink on:click={() => navigateHandler('#/edito')}><span class='item'>Edito</span></NavLink></NavItem></DropdownItem>
                  <DropdownItem class='bg-white'><NavItem><NavLink on:click={() => navigateHandler('#/partenaires')}><span class='item'>Partenaires</span></NavLink></NavItem></DropdownItem>
                  <DropdownItem class='bg-white'><NavItem><NavLink on:click={() => navigateHandler('#/equipe')}><span class='item'>L'équipe</span></NavLink></NavItem></DropdownItem>
                  <DropdownItem class='bg-white'><NavItem><NavLink on:click={() => navigateHandler('#/publications')}><span class='item'>Publications</span></NavLink></NavItem></DropdownItem>
                </DropdownMenu>
            </Dropdown>       
            <Dropdown nav inNavbar>
                <DropdownToggle class='text-dark mx-2' nav caret><span class='titre'>LA PROGRAMMATION 2021</span></DropdownToggle>
                <DropdownMenu end class='bg-white'>
                  <DropdownItem class='bg-white'><NavItem><NavLink on:click={() => navigateHandler('#/programmation/paris')} ><span class='item'>Paris</span></NavLink></NavItem></DropdownItem>
                  <DropdownItem class='bg-white'><NavItem><NavLink on:click={() => navigateHandler('#/programmation/nantes')} ><span class='item'>Nantes</span></NavLink></NavItem></DropdownItem>
                  <DropdownItem class='bg-white'><NavItem><NavLink on:click={() => navigateHandler('#/programmation/toulouse')} ><span class='item'>Toulouse</span></NavLink></NavItem></DropdownItem>
                </DropdownMenu>
            </Dropdown>
            <Dropdown nav inNavbar>
                <DropdownToggle class='text-dark mx-2' nav caret><span class='titre'>PROJET PEDAGOGIQUE</span></DropdownToggle>
                <DropdownMenu end class='bg-white'>
                  <DropdownItem class='bg-white'><NavItem><NavLink on:click={() => navigateHandler('#/presentation')}><span class='item'>Présentation</span></NavLink></NavItem></DropdownItem>
                  <DropdownItem class='bg-white'><NavItem><NavLink on:click={() => navigateHandler('#/projesseurs')}><span class='item'>Mots des professeurs</span></NavLink></NavItem></DropdownItem>
                  <DropdownItem class='bg-white'><NavItem><NavLink on:click={() => navigateHandler('#/eleves')}><span class='item'>Elèves</span></NavLink></NavItem></DropdownItem>
                </DropdownMenu>
            </Dropdown>
            <Dropdown nav inNavbar>
                <NavItem><NavLink class='text-dark mx-2' on:click={() => navigateHandler('#/informationsPratiques')}><span class='titre'>INFORMATIONS PRATIQUES</span></NavLink></NavItem>
            </Dropdown>
            <Dropdown nav inNavbar>
                <DropdownToggle class='text-dark mx-2' nav caret><span class='titre'>BILLETERIE</span></DropdownToggle>
                <DropdownMenu end class='bg-white'>
                  <DropdownItem class='bg-white'><NavItem><NavLink on:click={() => navigateHandler('#/billeterie/paris')}><span class='item'>Paris</span></NavLink></NavItem></DropdownItem>
                  <DropdownItem class='bg-white'><NavItem><NavLink on:click={() => navigateHandler('#/billeterie/nantes')}><span class='item'>Nantes</span></NavLink></NavItem></DropdownItem>
                  <DropdownItem class='bg-white'><NavItem><NavLink on:click={() => navigateHandler('#/billeterie/toulouse')}><span class='item'>Toulouse</span></NavLink></NavItem></DropdownItem>
                </DropdownMenu>
            </Dropdown>
      </Nav>
    </Collapse>
</Navbar>

<style>
  .titre {
    font-family: 'omotenashi_2regular';
    font-size: 1.5rem;
  }
  .item {
    font-family: 'Roboto-Regular';
    font-size:1.1rem;
    font-weight: bold;
  }
</style>