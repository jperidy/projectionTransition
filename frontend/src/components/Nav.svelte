<script>
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
Icon
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
    color="dark"
    dark
    expand="md" 
    class='mb-3 fixed-top py-3'
>
    <NavbarBrand href="/" class='color-light'><img src='/images/50x50/logo_entete.png' alt='logo' />  PROJECTION TRANSITION</NavbarBrand>
    <NavbarToggler on:click={() => (isOpen = !isOpen)} />

    <Collapse {isOpen} navbar expand="md" on:update={handleUpdate}>
        <Nav class="ms-auto" navbar>
            
            <Dropdown nav inNavbar class="mx-3">
                <DropdownToggle nav caret><Icon name='camera-reels'></Icon>  LE FESTIVAL</DropdownToggle>
                <DropdownMenu end>
                  <DropdownItem>Edito</DropdownItem>
                  <DropdownItem>Partenaires</DropdownItem>
                  <DropdownItem>Publications</DropdownItem>
                </DropdownMenu>
            </Dropdown>
            
            <Dropdown nav inNavbar class="mx-3">
                <DropdownToggle nav caret><Icon name='calendar-date'></Icon>  PROGRAMMATION</DropdownToggle>
                <DropdownMenu end>
                  <DropdownItem>Paris</DropdownItem>
                  <DropdownItem>Nantes</DropdownItem>
                  <DropdownItem>Toulouse</DropdownItem>
                </DropdownMenu>
            </Dropdown>

            <Dropdown nav inNavbar class="mx-3">
                <DropdownToggle nav caret><Icon name='bounding-box'></Icon>  PROJET PEDAGOGIQUE</DropdownToggle>
                <DropdownMenu end>
                  <DropdownItem>Présentation</DropdownItem>
                  <DropdownItem>Mots de professeurs</DropdownItem>
                  <DropdownItem>Elèves</DropdownItem>
                </DropdownMenu>
            </Dropdown>

            <Dropdown nav inNavbar class="mx-3">
                <DropdownToggle nav caret><Icon name='card-list'></Icon>  INFORMATIONS PRATIQUES</DropdownToggle>
                <DropdownMenu end>
                  <DropdownItem>Les lieux</DropdownItem>
                  <DropdownItem>Tarif</DropdownItem>
                  <DropdownItem>Situation sanitaire</DropdownItem>
                  <DropdownItem>Formulaire de contact</DropdownItem>
                </DropdownMenu>
            </Dropdown>

            <Dropdown nav inNavbar class="mx-3">
                <DropdownToggle nav caret>(€) BILLETERIE</DropdownToggle>
                <DropdownMenu end>
                  <DropdownItem><NavItem><NavLink href="/#/billeterie/paris">Paris</NavLink></NavItem></DropdownItem>
                  <DropdownItem>Nantes</DropdownItem>
                  <DropdownItem>Toulouse</DropdownItem>
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
  