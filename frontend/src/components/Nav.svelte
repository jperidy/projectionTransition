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
  
    // function handleUpdate(event) {
    //     //console.log('updage event', event.detail)
    //     // isOpen = event.detail.isOpen;
    //     isOpen = event.detail;
    // }

    const navigateHandler = (url) => {
        isOpen = false;
        push(url);
    }

</script>
  
<Navbar 
    color="white"
    light
    expand={expand}
    class='mb-3 fixed-top py-3'
>
    <NavbarBrand on:click={() => navigateHandler('/')}><img class='img-fluid mx-3' style="max-width: 130px;" src='/images/logo-projection-transition.png' alt='logo'/>
        <!-- <spans>PROJECTION TRANSITION</spans> -->
    </NavbarBrand>
    <NavbarToggler on:click={() => (isOpen = !isOpen)} />

    <!-- <Collapse {isOpen} navbar expand="md" on:update={handleUpdate}> -->
    <Collapse {isOpen} navbar expand={expand}>
        <Nav class="ms-auto align-items-center" navbar>
            <Dropdown nav inNavbar class="mx-3">
                <DropdownToggle class='text-dark' nav caret>LE FESTIVAL</DropdownToggle>
                <DropdownMenu end class='bg-white'>
                  <DropdownItem class='bg-white'><NavItem><NavLink on:click={() => navigateHandler('#/edito')}>Edito</NavLink></NavItem></DropdownItem>
                  <DropdownItem class='bg-white'><NavItem><NavLink on:click={() => navigateHandler('#/partenaires')}>Partenaires</NavLink></NavItem></DropdownItem>
                  <DropdownItem class='bg-white'><NavItem><NavLink on:click={() => navigateHandler('#/equipe')}>L'équipe</NavLink></NavItem></DropdownItem>
                  <DropdownItem class='bg-white'><NavItem><NavLink on:click={() => navigateHandler('#/publications')}>Publications</NavLink></NavItem></DropdownItem>
                </DropdownMenu>
            </Dropdown>
            
            <Dropdown nav inNavbar class="mx-3">
                <DropdownToggle class='text-dark' nav caret>PROGRAMMATION</DropdownToggle>
                <DropdownMenu end class='bg-white'>
                  <DropdownItem class='bg-white'><NavItem><NavLink on:click={() => navigateHandler('#/programmation/paris')} >Paris</NavLink></NavItem></DropdownItem>
                  <DropdownItem class='bg-white'><NavItem><NavLink on:click={() => navigateHandler('#/programmation/nantes')} >Nantes</NavLink></NavItem></DropdownItem>
                  <DropdownItem class='bg-white'><NavItem><NavLink on:click={() => navigateHandler('#/programmation/toulouse')} >Toulouse</NavLink></NavItem></DropdownItem>
                </DropdownMenu>
            </Dropdown>

            <Dropdown nav inNavbar class="mx-3">
                <DropdownToggle class='text-dark' nav caret>PROJET PEDAGOGIQUE</DropdownToggle>
                <DropdownMenu end class='bg-white'>
                  <DropdownItem class='bg-white'><NavItem><NavLink on:click={() => navigateHandler('#/presentation')}>Présentation</NavLink></NavItem></DropdownItem>
                  <DropdownItem class='bg-white'><NavItem><NavLink on:click={() => navigateHandler('#/projesseurs')}>Mots des professeurs</NavLink></NavItem></DropdownItem>
                  <DropdownItem class='bg-white'><NavItem><NavLink on:click={() => navigateHandler('#/eleves')}>Elèves</NavLink></NavItem></DropdownItem>
                </DropdownMenu>
            </Dropdown>

            <Dropdown nav inNavbar class="mx-3">
                <NavItem><NavLink class='text-dark' on:click={() => navigateHandler('#/informationsPratiques')}>INFORMATIONS PRATIQUES</NavLink></NavItem>
            </Dropdown>

            <Dropdown nav inNavbar class="mx-3">
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
  