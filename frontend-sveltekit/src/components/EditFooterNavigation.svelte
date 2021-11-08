<script>
    import Message from "./Message.svelte";
    export let footer;
    // export let updateOrCreateFooter;

    let messageUpdateFooter;

    // Manage Navigation
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
        footer.TITLE = [ ...footer.TITLE, {"name": navName, "url": navUrl, "SUBTITLE": []}];
        footer = footer;
        navName = '';
        navUrl = '';
        // updateOrCreateFooter(footer)
        // .then((result) => footer = result.footer)
        // .catch((error) => messageUpdateFooter = error);
    };

    const deleteNavigation = (index) => {
        footer.TITLE.splice(index, 1);
        footer = footer;
    // updateOrCreateFooter(footer)
    //   .then((result) => footer = result.footer)
    //   .catch((error) => messageUpdateFooter = error);
    };
    const upNavigation = (index) => {
        if (index > 0) {
        footer.TITLE = arrayMove(footer.TITLE, index, index - 1);
        // updateOrCreateFooter(footer)
        //     .then((result) => footer = result.footer)
        //     .catch((error) => messageUpdateFooter = error);
        }
    };
    const downNavigation = (index) => {
        if (index < footer.TITLE.length - 1) {
        footer.TITLE = arrayMove(footer.TITLE, index, index + 1);
        // updateOrCreateFooter(footer)
        //     .then((result) => footer = result.footer)
        //     .catch((error) => messageUpdateFooter = error);
        }
    };
</script>

{#if messageUpdateFooter}
    <Message color='danger'>{messageUpdateFooter}</Message>
{/if}

<h3 class="border-bottom mb-3 pb-2">Navigation items</h3>
<div class="col">
    <form on:submit={addNavigation}>
        <div class="row align-items-end">
        <div class="col">
            <label for="nameMenu">Menu Name</label>
            <input type="text" class="form-control" id="nameMenu" bind:value={navName} placeholder="Ex. MENTIONS LEGALES"/>
        </div>
        <div class="col">
            <label for="urlMenu">Redirection vers </label>
            <input type="text" class="form-control" id="urlMenu" bind:value={navUrl} placeholder="Ex. /mentions-legales#up"/>
        </div>
        <div class="col">
            <button type='submit' class="btn btn-primary">+</button>
        </div>
        </div>
    </form>

    {#each footer.TITLE as itemFooter, ind}
        <div class='row mt-1'>
        <div class="col">
            <input type="text" class="form-control" id={`itemFooter-${ind}`} bind:value={itemFooter.name} >
        </div>
        <div class="col">
            <input type="text" class="form-control" id={`url-${ind}`} bind:value={itemFooter.url} >
        </div>
        <div class="col">
            <button class="btn btn-danger btn-sm" on:click={() => deleteNavigation(ind)}><i class="bi bi-trash"></i></button>
            <button class="btn btn-secondary btn-sm" on:click={() => upNavigation(ind)}><i class="bi bi-chevron-compact-up"></i></button>
            <button class="btn btn-secondary btn-sm" on:click={() => downNavigation(ind)}><i class="bi bi-chevron-compact-down"></i></button>
        </div>
        </div>
    {/each}
</div>