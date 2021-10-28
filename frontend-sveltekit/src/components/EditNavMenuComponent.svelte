<script>

    export let navBar;
    export let updateOrCreateNavBar;

    // Manage navigation
    const arrayMove = (arr, fromIndex, toIndex) => {
        var element = arr[fromIndex];
        arr.splice(fromIndex, 1);
        arr.splice(toIndex, 0, element);
        return arr;
    };

    let navName = '';
    let navUrl = '';
    const addNavigation = (e) => {
        e.preventDefault();
        navBar.TITLE = [ ...navBar.TITLE, {"name": navName, "url": navUrl, "SUBTITLE": []}];
        navBar = navBar;
        navName = '';
        navUrl = '';
        updateOrCreateNavBar(navBar)
        .then((result) => navBar = result.navBar)
        .catch((error) => messageUpdateNav = error);
    };
    const deleteNavigation = (index) => {
        navBar.TITLE.splice(index, 1);
        navBar = navBar;
        updateOrCreateNavBar(navBar)
        .then((result) => navBar = result.navBar)
        .catch((error) => messageUpdateNav = error);
    };
    const upNavigation = (index) => {
        if (index > 0) {
        navBar.TITLE = arrayMove(navBar.TITLE, index, index - 1);
        updateOrCreateNavBar(navBar)
            .then((result) => navBar = result.navBar)
            .catch((error) => messageUpdateNav = error);
        }
    };
    const downNavigation = (index) => {
        if (index < navBar.TITLE.length - 1) {
        navBar.TITLE = arrayMove(navBar.TITLE, index, index + 1);
        updateOrCreateNavBar(navBar)
            .then((result) => navBar = result.navBar)
            .catch((error) => messageUpdateNav = error);
        }
    };

</script>

<h3>Ajout / Suppression de liens de navigation</h3>
<div class="col">
  <form on:submit={addNavigation}>
    <div class="row align-items-end">
      <div class="col">
        <label for="nameMenu">Menu Name</label>
        <input type="text" class="form-control" id="nameMenu" bind:value={navName} placeholder="Ex. Home"/>
      </div>
      <div class="col">
        <label for="urlMenu">Redirection vers </label>
        <input type="text" class="form-control" id="urlMenu" bind:value={navUrl} placeholder="Ex. /home"/>
      </div>
      <div class="col">
        <button type='submit' class="btn btn-primary">+</button>
      </div>
    </div>
  </form>
  {#each navBar.TITLE as menu, ind}
    <div class='row mt-1'>
      <div class="col">
        <input type="text" class="form-control" id={`menu-${ind}`} bind:value={menu.name} >
      </div>
      <div class="col">
        <input type="text" class="form-control" id={`url-${ind}`} bind:value={menu.url} >
      </div>
      <div class="col">
        <button class="btn btn-danger btn-sm" on:click={() => deleteNavigation(ind)}>x</button>
        <button class="btn btn-secondary btn-sm" on:click={() => upNavigation(ind)}>Up</button>
        <button class="btn btn-secondary btn-sm" on:click={() => downNavigation(ind)}>Down</button>
      </div>
    </div>
  {/each}
</div>