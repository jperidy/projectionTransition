<script>
    export let footer;
    
</script>

<h3>Modifier le copyright</h3>
<div class="row p-2">
    <div class="col">
        <label for="copyright-name">Name</label>
        <input type="text" class="form-control" id="copyright-name" bind:value={footer.COPYRIGHT.value} placeholder="©2021">
    </div>
    <div class="col">
        <label for="copyright-bootstrapclass">Classe bootstrap</label>
        <input type="text" class="form-control" id="copyright-bootstrapclass" bind:value={footer.COPYRIGHT.bootstrapClass} placeholder="Ex. bg-primary">
    </div>
    <div class="col">
        <label for="copyright-style">Style (CSS)</label>
        <input type="text" class="form-control" id="copyright-style" bind:value={footer.COPYRIGHT.style} placeholder="Ex. background: blue;">
    </div>
</div>