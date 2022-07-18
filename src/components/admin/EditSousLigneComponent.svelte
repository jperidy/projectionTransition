<script>

import { updateStyle } from "../../utils/styleFunctions";


    export let values; values;
    export let styles;

    const colors = ['pomme', 'outremer', 'lavande', 'caraibe', 'tangerine', 'ambre', 'light', 'white', 'dark', 'black'];

    $: width = styles.filter(x => x.name === 'width')[0] ? styles.filter(x => x.name === 'width')[0].value : 10;
    $: marginTop = styles.filter(x => x.name === 'marginTop')[0] ? styles.filter(x => x.name === 'marginTop')[0].value : 0;
    $: marginBottom = styles.filter(x => x.name === 'marginBottom')[0] ? styles.filter(x => x.name === 'marginBottom')[0].value : 0;
    $: marginLeft = styles.filter(x => x.name === 'marginLeft')[0] ? styles.filter(x => x.name === 'marginLeft')[0].value : 0;
    $: marginRight = styles.filter(x => x.name === 'marginRight')[0] ? styles.filter(x => x.name === 'marginRight')[0].value : 0;
    $: textAlign = styles.filter(x => x.name === 'text-align')[0] && styles.filter(x => x.name === 'text-align')[0].value;
    $: textColor = styles.filter(x => x.name === 'text-color')[0] && styles.filter(x => x.name === 'text-color')[0].value;

</script>

<div class='parametres'>
    <label for="inputWidth">Width (%)</label>
    <input id ="inputWidth" type='number' class='form-control' value={width} on:change={(e) => styles = updateStyle(styles, {name:'width', value:e.target.value})} />
    <p class="my-0 pt-2">Margin (rem)</p>
    <div class="row align-items-end">
        <div class="col">
            <label for="marginTop">Top</label>
            <input id ="marginTop" type='number' class='form-control' value={marginTop} min={0} on:change={(e) => styles = updateStyle(styles, {name:'marginTop', value:e.target.value})} />
        </div>
        <div class="col">
            <label for="marginBottom">Bottom</label>
            <input id ="marginBottom" type='number' class='form-control' value={marginBottom} min={0} on:change={(e) => styles = updateStyle(styles, {name:'marginBottom', value:e.target.value})} />
        </div>
        <div class="col">
            <label for="marginLeft">Left</label>
            <input id ="marginLeft" type='number' class='form-control' value={marginLeft} min={0} on:change={(e) => styles = updateStyle(styles, {name:'marginLeft', value:e.target.value})} />
        </div>
        <div class="col">
            <label for="marginRight">Right</label>
            <input id ="marginRight" type='number' class='form-control' value={marginRight} min={0} on:change={(e) => styles = updateStyle(styles, {name:'marginRight', value:e.target.value})} />
        </div>
    </div>
    <div class='py-1 d-flex align-items-center'>
        <button class={`px-2 border rounded btn ${textAlign === "margin-right:auto;" ? "btn-primary" : "btn-light"}`} on:click={() => styles = updateStyle(styles, {name:'text-align', value:'margin-right:auto;'})}><i class='bi bi-text-left' /></button>
        <button class={`px-2 border rounded btn ${textAlign === "margin-right:auto;margin-left:auto;" ? "btn-primary" : "btn-light"}`} on:click={() => styles = updateStyle(styles, {name:'text-align', value:'margin-right:auto;margin-left:auto;'})}><i class='bi bi-text-center' /></button>
        <button class={`px-2 border rounded btn ${textAlign === "margin-left:auto;" ? "btn-primary" : "btn-light"}`} on:click={() => styles = updateStyle(styles, {name:'text-align', value:'margin-left:auto;'})}><i class='bi bi-text-right' /></button>
        <label for="select-color" class="mx-2">Color: </label>
        <select id="select-color" class="form-control" value={textColor.split('-').length > 1 ? textColor.split('-')[1] : "primary"} on:change={(e) => styles = updateStyle(styles, {name:'text-color', value:`border-${e.target.value}`})}>
            <option value="primary">"Default (primary)"</option>
            {#each colors as color}
                <option value={color}>{color}</option>
            {/each}
        </select>
    </div>
</div>