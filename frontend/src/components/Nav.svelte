<script>
    import {
      Collapse,
      Navbar,
      NavbarToggler,
      NavbarBrand,
      Nav,
      NavItem,
      NavLink
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
    class='mb-3 fixed-top py-5'
>
    <NavbarBrand href="/" class='color-light'>Projection Transition</NavbarBrand>
    <NavbarToggler on:click={() => (isOpen = !isOpen)} />
    <Collapse {isOpen} navbar expand="md" on:update={handleUpdate}>
        <Nav class="ms-auto" navbar>
                <NavItem>
                    <NavLink href="/#/programmation/">Programmation</NavLink>
                </NavItem>
                <NavItem>
                    <NavLink href="/auth/Login/">Login</NavLink>
                </NavItem>
                <NavItem>
                    <NavLink href="/auth/Register">Signup</NavLink>
                </NavItem>
      </Nav>
    </Collapse>
</Navbar>
  