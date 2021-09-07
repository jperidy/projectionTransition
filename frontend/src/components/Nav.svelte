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
  
    let isOpen = false;
  
    function handleUpdate(event) {
      isOpen = event.detail.isOpen;
    }

</script>

<style>
    
    /* .user-email{
        margin-right: 15px;
    } */
</style>
  
<Navbar 
    color="white"
    light
    expand="md" 
    class='mb-3 fixed-top py-3'
>
    <NavbarBrand href="#/"><img src='/images/50x50/logo_entete.png' alt='logo' />  PROJECTION TRANSITION</NavbarBrand>
    <NavbarToggler on:click={() => (isOpen = !isOpen)} />

    <Collapse {isOpen} navbar expand="md" on:update={handleUpdate}>
        <Nav class="ms-auto" navbar>
            
            <Dropdown nav inNavbar class="mx-3">
                <DropdownToggle class='text-dark' nav caret>LE FESTIVAL</DropdownToggle>
                <DropdownMenu end class='bg-white'>
                  <DropdownItem><NavItem><NavLink on:click={() => push('#/edito')}>Edito</NavLink></NavItem></DropdownItem>
                  <DropdownItem><NavItem><NavLink on:click={() => push('#/partenaires')}>Partenaires</NavLink></NavItem></DropdownItem>
                  <DropdownItem><NavItem><NavLink on:click={() => push('#/equipe')}>L'équipe</NavLink></NavItem></DropdownItem>
                  <DropdownItem><NavItem><NavLink on:click={() => push('#/publications')}>Publications</NavLink></NavItem></DropdownItem>
                </DropdownMenu>
            </Dropdown>
            
            <Dropdown nav inNavbar class="mx-3">
                <DropdownToggle class='text-dark' nav caret>PROGRAMMATION</DropdownToggle>
                <DropdownMenu end class='bg-white'>
                  <DropdownItem><NavItem><NavLink href="#/programmation/paris">Paris</NavLink></NavItem></DropdownItem>
                  <DropdownItem><NavItem><NavLink href="#/programmation/nantes">Nantes</NavLink></NavItem></DropdownItem>
                  <DropdownItem><NavItem><NavLink href="#/programmation/toulouse">Toulouse</NavLink></NavItem></DropdownItem>
                </DropdownMenu>
            </Dropdown>

            <Dropdown nav inNavbar class="mx-3">
                <DropdownToggle class='text-dark' nav caret>PROJET PEDAGOGIQUE</DropdownToggle>
                <DropdownMenu end class='bg-white'>
                  <DropdownItem><NavItem><NavLink href="#/presentation">Présentation</NavLink></NavItem></DropdownItem>
                  <DropdownItem><NavItem><NavLink href="#/projesseurs">Mots des professeurs</NavLink></NavItem></DropdownItem>
                  <DropdownItem><NavItem><NavLink href="#/eleves">Elèves</NavLink></NavItem></DropdownItem>
                </DropdownMenu>
            </Dropdown>

            <Dropdown nav inNavbar class="mx-3">
                <NavItem><NavLink class='text-dark' href="#/informationsPratiques">INFORMATIONS PRATIQUES</NavLink></NavItem>
            </Dropdown>

            <Dropdown nav inNavbar class="mx-3">
                <DropdownToggle class='text-dark' nav caret>(€) BILLETERIE</DropdownToggle>
                <DropdownMenu end class='bg-white'>
                  <DropdownItem><NavItem><NavLink href="#/billeterie/paris">Paris</NavLink></NavItem></DropdownItem>
                  <DropdownItem><NavItem><NavLink href="#/billeterie/nantes">Nantes</NavLink></NavItem></DropdownItem>
                  <DropdownItem><NavItem><NavLink href="#/billeterie/toulouse">Toulouse</NavLink></NavItem></DropdownItem>
                </DropdownMenu>
            </Dropdown>

            <!-- <NavItem>
                <NavLink href="/auth/Login/">Login</NavLink>
            </NavItem>
            <NavItem>
                <NavLink href="/auth/Register">Signup</NavLink>
            </NavItem> -->
      </Nav>
    </Collapse>
</Navbar>
  