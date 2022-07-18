<script>
    import EditStyleComponent from "./EditStyleComponent.svelte";

    export let values=[];
    export let styles=[];
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
    
    
</div>
<textarea 
    name='textarea' 
    id='input-textarea' 
    class='my-3 form-control' 
    rows={6}
    bind:value={values[0].value}
/>