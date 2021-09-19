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
    <Collapse {isOpen} navbar expand={expand}>
        <Nav class="ms-auto align-items-center" navbar>
            <Dropdown nav inNavbar>
                <DropdownToggle class='text-dark' nav caret>LE FESTIVAL</DropdownToggle>
                <DropdownMenu end class='bg-white'>
                  <DropdownItem class='bg-white'><NavItem><NavLink on:click={() => navigateHandler('#/edito')}>Edito</NavLink></NavItem></DropdownItem>
                  <DropdownItem class='bg-white'><NavItem><NavLink on:click={() => navigateHandler('#/partenaires')}>Partenaires</NavLink></NavItem></DropdownItem>
                  <DropdownItem class='bg-white'><NavItem><NavLink on:click={() => navigateHandler('#/equipe')}>L'équipe</NavLink></NavItem></DropdownItem>
                  <DropdownItem class='bg-white'><NavItem><NavLink on:click={() => navigateHandler('#/publications')}>Publications</NavLink></NavItem></DropdownItem>
                </DropdownMenu>
            </Dropdown>       
            <Dropdown nav inNavbar>
                <DropdownToggle class='text-dark' nav caret>PROGRAMMATION</DropdownToggle>
                <DropdownMenu end class='bg-white'>
                  <DropdownItem class='bg-white'><NavItem><NavLink on:click={() => navigateHandler('#/programmation/paris')} >Paris</NavLink></NavItem></DropdownItem>
                  <DropdownItem class='bg-white'><NavItem><NavLink on:click={() => navigateHandler('#/programmation/nantes')} >Nantes</NavLink></NavItem></DropdownItem>
                  <DropdownItem class='bg-white'><NavItem><NavLink on:click={() => navigateHandler('#/programmation/toulouse')} >Toulouse</NavLink></NavItem></DropdownItem>
                </DropdownMenu>
            </Dropdown>
            <Dropdown nav inNavbar>
                <DropdownToggle class='text-dark' nav caret>PROJET PEDAGOGIQUE</DropdownToggle>
                <DropdownMenu end class='bg-white'>
                  <DropdownItem class='bg-white'><NavItem><NavLink on:click={() => navigateHandler('#/presentation')}>Présentation</NavLink></NavItem></DropdownItem>
                  <DropdownItem class='bg-white'><NavItem><NavLink on:click={() => navigateHandler('#/projesseurs')}>Mots des professeurs</NavLink></NavItem></DropdownItem>
                  <DropdownItem class='bg-white'><NavItem><NavLink on:click={() => navigateHandler('#/eleves')}>Elèves</NavLink></NavItem></DropdownItem>
                </DropdownMenu>
            </Dropdown>
            <Dropdown nav inNavbar>
                <NavItem><NavLink class='text-dark' on:click={() => navigateHandler('#/informationsPratiques')}>INFORMATIONS PRATIQUES</NavLink></NavItem>
            </Dropdown>
            <Dropdown nav inNavbar>
                <DropdownToggle class='text-dark' nav caret>(€) BILLETERIE</DropdownToggle>
                <DropdownMenu end class='bg-white'>
                  <DropdownItem class='bg-white'><NavItem><NavLink on:click={() => navigateHandler('#/billeterie/paris')}>Paris</NavLink></NavItem></DropdownItem>
                  <DropdownItem class='bg-white'><NavItem><NavLink on:click={() => navigateHandler('#/billeterie/nantes')}>Nantes</NavLink></NavItem></DropdownItem>
                  <DropdownItem class='bg-white'><NavItem><NavLink on:click={() => navigateHandler('#/billeterie/toulouse')}>Toulouse</NavLink></NavItem></DropdownItem>
                </DropdownMenu>
            </Dropdown>
      </Nav>
    </Collapse>
</Navbar>
  