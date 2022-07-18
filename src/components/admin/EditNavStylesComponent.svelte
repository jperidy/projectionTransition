<script>
    export let navBar;

    // Manage styles
    const colors = ['primary', 'secondary', 'pomme', 'outremer', 'lavande', 'caraibe', 'tangerine', 'ambre', 'light', 'white', 'dark', 'black'];

</script>

<h3 class="border-bottom mb-3 pb-2">Styles</h3>

<div class="row gx-3 gy-2">
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
        <label for="color-bar">Background color</label>
        <select id="color-bar" class="form-control" bind:value={navBar.STYLE.color}>
            <option values="">--select--</option>
            {#each colors as color}
            <option values={color}>{color}</option>
            {/each}
        </select>
    </div>
    <div class="col">
        <label for="color-bar">Theme</label>
        <select id="color-bar" class="form-control" bind:value={navBar.STYLE.theme}>
            <option values="">--select--</option>
            {#each colors as color}
            <option values={color}>{color}</option>
            {/each}
        </select>
    </div>
</div>
<div class="row gx-3 gy-2">
    <div class="col">
        <label for="title-style-bootstrap">Navigation items (Bootstrap class)</label>
        <input class="form-control" type="text" id="title-style-bootstrap" placeholder="Ex. bg-primary" bind:value={navBar.STYLE.TITLE.bootstrapClass}>
    </div>
    <div class="col">
    <label for="title-style-css">Navigation items (style css)</label>
    <input class="form-control" type="text" id="title-style-css" placeholder="Ex. width: 5px;" bind:value={navBar.STYLE.TITLE.style}>
    </div>
</div>
<div class="row gx-3 gy-2">
    <div class="col">
        <label for="socialNetwork-style-bootstrap">Social networks items (Bootstrap class)</label>
        <input class="form-control" type="text" id="socialNetwork-style-bootstrap" placeholder="Ex. bg-primary" bind:value={navBar.STYLE.SOCIAL_NETWORKS.bootstrapClass}>
    </div>
    <div class="col">
        <label for="socialNetwork-style-css">Social networks items (style css)</label>
        <input class="form-control" type="text" id="socialNetwork-style-css" placeholder="Ex. width: 5px;" bind:value={navBar.STYLE.SOCIAL_NETWORKS.style}>
    </div>
</div>