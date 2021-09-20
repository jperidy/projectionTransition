<script>
    import { push } from "svelte-spa-router";

    import { logout } from "../actions/userActions";

    export let admin = false;
    export let isAuthenticate = false;

    const modifyAdmin = () => {
        admin = !admin;
    }

    const logoutHandler = () => {
        logout();
        push('#/login');
    };

</script>

{#if isAuthenticate}
    <div class='alert alert-warning text-center py-2'>
        <div class="row align-items-center">
            <div class='col my-auto' sm={4} md={10}>You are in admin mode. Be careful!</div>
            <div class='col text-end' sm={4} md={1}>
                <button
                    class='btn btn-light'
                    on:click={() => modifyAdmin()}
                    block
                ><i class={admin ? 'bi bi-arrow-counterclockwise' : 'bi bi-box-arrow-up-left'}></i>
                {admin ? 'Sauvegarder' : 'Editer'}
                </button>
            </div>
            <div class='col text-start' sm={4} md={1}>
                <button
                    class='btn btn-light'
                    on:click={() => logoutHandler()}
                    block
                ><i class="bi bi-door-open"></i>Logout</button>
            </div>
        </div>
    </div>
{/if}