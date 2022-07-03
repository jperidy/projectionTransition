<script>
    import { updateStyle, watchStyle } from '../../utils/styleFunctions'; 
    import EditStyleComponent from "./EditStyleComponent.svelte";

    export let values=[];
    export let styles=[];
    
    let borderRadiusOpen = false;

    $: rounded = watchStyle(styles, 'rounded', 0);
</script>

<EditStyleComponent 
    bind:styles={styles}
    stylesToEdit={{
        margin: true,
        padding: true,
        rotation: true,
        font: true,
        text: true,
    }}
/>

<div class='row py-1'>
    
    <div class='col-12 d-flex justify-content-start'>
        <button class='btn btn-light border px-1' on:click={() => {
            const currentUnderlined = watchStyle(styles, 'bgPrimaryText', false);
            styles = updateStyle(styles, { name:'bgPrimaryText', value: !currentUnderlined })
        }}
        ><span class='bg-primary'>Background</span></button>
        <div>
            <button class={`px-2 border btn bg-light`} on:click={() => borderRadiusOpen = !borderRadiusOpen}>Border</button>
            {#if borderRadiusOpen}
                <div class="row position-absolute rounded panel justify-content-around p-1 g-1">
                    <button class={`btn color-button px-2 border rounded-0 ${rounded === "rounded-0" ? "border border-secondary" : "btn-light"}`} on:click={() => styles = updateStyle(styles, {name:'rounded', value:'rounded-0'})}><span>r-0</span></button>
                    <button class={`btn color-button px-2 border rounded-1 ${rounded === "rounded-1" ? "border border-secondary" : "btn-light"}`} on:click={() => styles = updateStyle(styles, {name:'rounded', value:'rounded-1'})}><span>r-1</span></button>
                    <button class={`btn color-button px-2 border rounded-2 ${rounded === "rounded-2" ? "border border-secondary" : "btn-light"}`} on:click={() => styles = updateStyle(styles, {name:'rounded', value:'rounded-2'})}><span>r-2</span></button>
                    <button class={`btn color-button px-2 border rounded-3 ${rounded === "rounded-3" ? "border border-secondary" : "btn-light"}`} on:click={() => styles = updateStyle(styles, {name:'rounded', value:'rounded-3'})}><span>r-3</span></button>
                </div>
            {/if}
        </div>
    </div>
</div>
<textarea 
    name='textarea' 
    id='input-textarea' 
    class='my-3 form-control' 
    rows={6}
    bind:value={values[0].value}
/>

<style>
    .panel {
        background-color: white;
        width: 128px;
    }
    .color-button {
        width: 24px;
        height: 24px;
        border-radius: 8px;
        border: 1px solid darkgrey;
    }
</style>