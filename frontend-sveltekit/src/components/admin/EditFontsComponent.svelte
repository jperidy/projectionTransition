<script>
    import { deleteAFont, getFonts, updateOrCreateFont } from "../../actions/fontsActions";
    import { onMount } from "svelte";
    import Message from "../Message.svelte";

    export let fonts = [];
    
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

    const extractFontName = (input) => {
      let family = input.split('family=');
      if (family.length > 1) {
        family = family[1].split(/&|:/)[0];
      } else {
        family = "";
      }
      const fontExtractName = `'${family.replaceAll('+', ' ')}'`;
      return fontExtractName;
    }

    const updateFont = (font, ind) => {
      fonts[ind].name = extractFontName(font.href);
      fonts = fonts;
      updateOrCreateFont(font)
          .then((result) => messageUpdateOrCreate = "")
          .catch((error) => messageUpdateOrCreate = error);
    };

    const updateNameHandler = (input) => {
      fontName = extractFontName(input)
    }
</script>

<div class="px-5 py-3">
  <h3 class="border-bottom mb-3 pb-2">Fonts</h3>
  <div class="col">
      {#if messageUpdateOrCreate}
          <Message color='danger'>{messageUpdateOrCreate}</Message>
      {/if}
      <form on:submit={addFont}>
        <div class="row align-items-end">
          <div class="col-4">
              <label for="hrefFont">href</label>
              <input type="text" class="form-control" id="hrefFont" bind:value={href} placeholder="href from googleapis" on:change={(e) => updateNameHandler(e.target.value)}/>
          </div>
          <div class="col">
            <label for="nameFont">Font Name</label>
            <input type="text" class="form-control-plaintext" id="nameFont" value={fontName} placeholder="[automatic]" readonly/>
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
            <button type='submit' class="btn btn-primary">+</button>
          </div>
        </div>
      </form>
      {#each fonts as font, ind}
        <div class='row mt-1 align-items-center'>
          <div class="col-4">
            <input type="text" class="form-control" bind:value={font.href} on:change={() => updateFont(font, ind)}>
          </div>
          <div class="col">
            <input type="text" class="form-control-plaintext" value={font.name} readonly>
          </div>
          <div class="col">
              <input type="checkbox" class="form-check-input" bind:checked={font.defaultHeader} on:change={() => updateFont(font, ind)}/>
          </div>
          <div class="col">
              <input type="checkbox" class="form-check-input" bind:checked={font.defaultBody} on:change={() => updateFont(font, ind)}/>
          </div>
          <div class="col">
            <button class="btn btn-danger btn-sm" on:click={() => deleteFont(ind)}><i class="bi bi-trash"></i></button>
          </div>
        </div>
      {/each}
  </div>
</div>