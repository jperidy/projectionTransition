<script>
    import { deleteAFont, getFonts, updateOrCreateFont } from "../actions/fontsActions";
    import { onMount } from "svelte";
    import Message from "./Message.svelte";

    let fonts = [];
    let messageUpdateOrCreate = "";

    onMount(async () => {
        try {
            const fontsRequest = await getFonts();
            fonts = fontsRequest.fonts;
            messageUpdateOrCreate = "";
        } catch (error) {
            messageUpdateOrCreate = error;
            fonts = [];
        }
    });

    let fontName = '';
    let defaultHeader = false;
    let defaultBody = false;
    let href = "";

    const addFont = (e) => {
        e.preventDefault();
        const newFont = {"name": fontName, defaultHeader, defaultBody, href};
        fonts = [ ...fonts, newFont];
        fonts = fonts;
        fontName = '';
        defaultHeader = false;
        defaultBody = false;
        href = "";
        updateOrCreateFont(newFont)
            .then((result) => location.reload())
            .catch((error) => messageUpdateOrCreate = error);
    };
    const deleteFont = (index) => {
        deleteAFont(fonts[index])
            .then((result) => location.reload())
            .catch((error) => messageUpdateOrCreate = error);
        fonts.splice(index, 1);
        fonts = fonts;
    };
    const updateFont = (font) => {
        updateOrCreateFont(font)
            .then((result) => messageUpdateOrCreate = "")
            .catch((error) => messageUpdateOrCreate = error);
    }
</script>

<h3>Ajout / Suppression des polices d'écriture</h3>
<div class="col">
    {#if messageUpdateOrCreate}
        <Message color='danger'>{messageUpdateOrCreate}</Message>
    {/if}
    <form on:submit={addFont}>
      <div class="row align-items-end">
        <div class="col">
          <label for="nameFont">Font Name</label>
          <input type="text" class="form-control" id="nameFont" bind:value={fontName} placeholder="Ex. Ubuntu"/>
        </div>
        <div class="col">
            <div class="form-check align-items-center">
                <label for="defaultHeader">Default Header </label>
                <input type="checkbox" class="form-check-input" id="defaultHeader" bind:checked={defaultHeader} />
            </div>
        </div>
        <div class="col">
            <div class="form-check align-items-center">
                <label for="defaultBody">Default Header </label>
                <input type="checkbox" class="form-check-input" id="defaultBody" bind:checked={defaultBody} />
            </div>
        </div>
        <div class="col">
            <label for="hrefFont">href</label>
            <input type="text" class="form-control" id="hrefFont" bind:value={href} placeholder="href from googleapis"/>
        </div>
        <div class="col">
          <button type='submit' class="btn btn-primary">+</button>
        </div>
      </div>
    </form>
    {#each fonts as font, ind}
      <div class='row mt-1'>
        <div class="col">
          <input type="text" class="form-control" bind:value={font.name} on:change={() => updateFont(font)}>
        </div>
        <div class="col">
            <input type="checkbox" class="form-check-input" bind:checked={font.defaultHeader} on:change={() => updateFont(font)}/>
        </div>
        <div class="col">
            <input type="checkbox" class="form-check-input" bind:checked={font.defaultBody} on:change={() => updateFont(font)}/>
        </div>
        <div class="col">
          <input type="text" class="form-control" bind:value={font.href} on:change={() => updateFont(font)}>
        </div>
        <div class="col">
          <button class="btn btn-danger btn-sm" on:click={() => deleteFont(ind)}>x</button>
        </div>
      </div>
    {/each}
</div>