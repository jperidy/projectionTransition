<script>
    export let navBar;

    // Manage styles
    const colors = ['primary', 'secondary', 'pomme', 'outremer', 'lavande', 'caraibe', 'tangerine', 'ambre', 'light', 'white', 'dark', 'black'];

</script>

<h3>Edition des styles de la barre de navigation</h3>
<div class="row">
    <div class="col">
    <label for="select-expand">Expand</label>
    <select id="select-expand" class="form-control" bind:value={navBar.STYLE.expand}>
        <option value="">--select--</option>
        <option value="xs">xs</option>
        <option value="sm">sm</option>
        <option value="md">md</option>
        <option value="lg">lg</option>
        <option value="xl">xl</option>
    </select>
    </div>
    <div class="col">
    <label for="color-bar">Couleur de la navbar</label>
    <select id="color-bar" class="form-control" bind:value={navBar.STYLE.color}>
        <option values="">--select--</option>
        {#each colors as color}
        <option values={color}>{color}</option>
        {/each}
    </select>
    </div>
    <div class="col">
    <label for="color-bar">Thème de la navbar</label>
    <select id="color-bar" class="form-control" bind:value={navBar.STYLE.theme}>
        <option values="">--select--</option>
        {#each colors as color}
        <option values={color}>{color}</option>
        {/each}
    </select>
    </div>
</div>
<div class="row">
    <div class="col">
    <label for="title-style-bootstrap">Titre (Bootstrap class)</label>
    <input class="form-control" type="text" id="title-style-bootstrap" bind:value={navBar.STYLE.TITLE.bootstrapClass}>
    </div>
    <div class="col">
    <label for="title-style-css">Titre (style css)</label>
    <input class="form-control" type="text" id="title-style-css" bind:value={navBar.STYLE.TITLE.style}>
    </div>
</div>
<div class="row">
    <div class="col">
    <label for="socialNetwork-style-bootstrap">Réseaux sociaux (Bootstrap class)</label>
    <input class="form-control" type="text" id="socialNetwork-style-bootstrap" bind:value={navBar.STYLE.SOCIAL_NETWORKS.bootstrapClass}>
    </div>
    <div class="col">
    <label for="socialNetwork-style-css">Réseaux sociaux (style css)</label>
    <input class="form-control" type="text" id="socialNetwork-style-css" bind:value={navBar.STYLE.SOCIAL_NETWORKS.style}>
    </div>
</div>