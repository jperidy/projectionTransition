<script>
    export let navBar;
    export let updateOrCreateNavBar;

    import config from '../config.json';
    import Message from './Message.svelte';
    const API_URL = config.SVELTE_ENV === 'dev' ? config.API_URL_DEV : config.SVELTE_ENV === 'preprod' ? config.API_URL_PREPROD : config.SVELTE_ENV === 'production' ? config.API_URL_PROD : config.API_URL_DEV;

    // Manage Social Network
    let snName = '';
    let snIcon = '';
    let snAlt = '';
    let snRedirect = '';
    let newTarget = true;

    let messageUpdateNav = "";

    const arrayMove = (arr, fromIndex, toIndex) => {
        var element = arr[fromIndex];
        arr.splice(fromIndex, 1);
        arr.splice(toIndex, 0, element);
        return arr;
    };

    const addSocialNetwork = (e) => {
        e.preventDefault();
        navBar.SOCIAL_NETWORKS = [ ...navBar.SOCIAL_NETWORKS, {"name": snName, "icon": snIcon, "alt": snAlt, "redirect": snRedirect, "target": newTarget ? '_blank' : ''}];
        navBar = navBar;
        snName = "";
        snIcon = "";
        snAlt = "";
        snRedirect = "";
        newTarget = true;
        updateOrCreateNavBar(navBar)
        .then((result) => navBar = result.navBar)
        .catch((error) => messageUpdateNav = error);
    };
    const deleteSocialNetwork = (index) => {
        navBar.SOCIAL_NETWORKS.splice(index, 1);
        navBar = navBar;
        updateOrCreateNavBar(navBar)
        .then((result) => navBar = result.navBar)
        .catch((error) => messageUpdateNav = error);
    };
    const upSocialNetwork = (index) => {
        if (index > 0) {
        navBar.SOCIAL_NETWORKS = arrayMove(navBar.SOCIAL_NETWORKS, index, index - 1);
        }
    };
    const downSocialNetwork = (index) => {
        if (index < navBar.SOCIAL_NETWORKS.length - 1) {
        navBar.SOCIAL_NETWORKS = arrayMove(navBar.SOCIAL_NETWORKS, index, index + 1);
        }
    };
    const onSelectAnImageSocialNetwork = async(index, e) => {
        const data = new FormData();
        data.append('file', e.target.files[0]);
        const result = await uploadImage(data, index === -1 ? '' : navBar.SOCIAL_NETWORKS[index].icon);
        if (result.status === 'Ok') {
        if (index === -1) { // create
            snIcon = result.data;
        } else { // update
            navBar.SOCIAL_NETWORKS[index].icon = result.data;
            navBar = navBar;
            updateOrCreateNavBar(navBar)
            .then((result) => navBar = result.navBar)
            .catch((error) => messageUpdateNav = error);
        }
            messageUploadImage = '';
        } else {
            messageUploadImage = result.data;
        }
    };
</script>

<h3>Edition des pictos réseaux sociaux</h3>

{#if messageUpdateNav}
  <Message color='danger'>{messageUpdateNav}</Message>
{/if}

<div class="col">
    <form on:submit={addSocialNetwork}>
      <div class="row align-items-end">
        <div class="col">
          <label for="nameSN">Name</label>
          <input type="text" class="form-control" id="nameSN" bind:value={snName} placeholder="Ex. Facebook"/>
        </div>
        <div class="col">
          <label for="iconSN">Icon </label>
          <input type="file" class="form-control" id="iconSN" on:change={(e) => onSelectAnImageSocialNetwork(-1, e)}/>
        </div>
        <div class="col bg-light">
          <img class='img-fluid' src={API_URL + snIcon} alt={snAlt} />
        </div>
        <div class="col">
          <label for="altSN">Texte alternatif</label>
          <input type="text" class="form-control" id="altSN" bind:value={snAlt} placeholder="Ex. Lien vers Facebook"/>
        </div>
        <div class="col">
          <label for="redirectSN">Redirection vers </label>
          <input type="text" class="form-control" id="redirectSN" bind:value={snRedirect} placeholder="Ex. https://facebook.com"/>
        </div>
        <div class="col">
          <div class="form-check form-switch align-items-center">
            <label for="targetSN">Nouvel onglet </label>
            <input type="checkbox" class="form-check-input" id="targetSN" bind:checked={newTarget} />
          </div>
        </div>
        <div class="col">
          <button type='submit' class="btn btn-primary">+</button>
        </div>
      </div>
    </form>

    <!-- {"name": "", "icon": "", "alt": "", "redirect": "", "target": ""}, -->
    {#each navBar.SOCIAL_NETWORKS as item, ind}
      <div class='row mt-1'>
        <div class="col my-auto">
          <input type="text" class="form-control" bind:value={item.name} >
        </div>
        <div class="col my-auto">
          <input type="file" class="form-control" on:change={(e) => onSelectAnImageSocialNetwork(ind, e)}>
        </div>
        <div class="col my-auto bg-light">
          <img class='img-fluid' src={API_URL + item.icon} alt={snAlt} />
        </div>
        <div class="col my-auto">
          <input type="text" class="form-control" bind:value={item.alt} >
        </div>
        <div class="col my-auto">
          <input type="text" class="form-control" bind:value={item.redirect} >
        </div>
        <div class="col my-auto">
          <input type="text" class="form-control" bind:value={item.target} >
        </div>
        <div class="col my-auto">
          <button class="btn btn-danger btn-sm" on:click={() => deleteSocialNetwork(ind)}>x</button>
          <button class="btn btn-secondary btn-sm" on:click={() => upSocialNetwork(ind)}>Up</button>
          <button class="btn btn-secondary btn-sm" on:click={() => downSocialNetwork(ind)}>Down</button>
        </div>
      </div>
    {/each}

</div>