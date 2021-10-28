<script>
    export let footer;
</script>

<h3>Editer les styles du pied de page</h3>
<div class="row p-2">
    <div class="row p-2 align-items-end text-end">
        <div class="col-3">
            <p class="my-auto">FOOTER STYLE: </p>
        </div>
        <div class="col">
            <label for="footer-bootstrapclass">Classe bootstrap</label>
            <input type="text" class="form-control" id="footer-bootstrapclass" bind:value={footer.STYLE.FOOTER.bootstrapClass} placeholder="Ex. bg-primary">
        </div>
        <div class="col">
            <label for="footer-style">Style (CSS)</label>
            <input type="text" class="form-control" id="footer-style" bind:value={footer.STYLE.FOOTER.style} placeholder="Ex. background: blue;">
        </div>
    </div>
    <div class="row p-2 align-items-end text-end">
        <div class="col-3">
            <p class="my-auto">NAVIGATION STYLE: </p>
        </div>
        <div class="col">
            <label for="navigation-bootstrapclass">Classe bootstrap</label>
            <input type="text" class="form-control" id="navigation-bootstrapclass" bind:value={footer.STYLE.NAVIGATION.bootstrapClass} placeholder="Ex. bg-primary">
        </div>
        <div class="col">
            <label for="navigation-style">Style (CSS)</label>
            <input type="text" class="form-control" id="navigation-style" bind:value={footer.STYLE.NAVIGATION.style} placeholder="Ex. background: blue;">
        </div>
    </div>
    <div class="row p-2 align-items-end text-end">
        <div class="col-3">
            <p class="my-auto">COPYRIGHT STYLE: </p>
        </div>
        <div class="col">
            <label for="copyright-style-bootstrapclass">Classe bootstrap</label>
            <input type="text" class="form-control" id="copyright-style-bootstrapclass" bind:value={footer.STYLE.COPYRIGHT.bootstrapClass} placeholder="Ex. bg-primary">
        </div>
        <div class="col">
            <label for="copyright-style-style">Style (CSS)</label>
            <input type="text" class="form-control" id="copyright-style-style" bind:value={footer.STYLE.COPYRIGHT.style} placeholder="Ex. background: blue;">
        </div>
    </div>
    <div class="row p-2 align-items-end text-end">
        <div class="col-3">
            <p class="my-auto">TITLE STYLE: </p>
        </div>
        <div class="col">
            <label for="title-style-bootstrapclass">Classe bootstrap</label>
            <input type="text" class="form-control" id="title-style-bootstrapclass" bind:value={footer.STYLE.TITLE.bootstrapClass} placeholder="Ex. bg-primary">
        </div>
        <div class="col">
            <label for="title-style-style">Style (CSS)</label>
            <input type="text" class="form-control" id="title-style-style" bind:value={footer.STYLE.TITLE.style} placeholder="Ex. background: blue;">
        </div>
    </div>
    <div class="row p-2 align-items-end text-end">
        <div class="col-3">
            <p class="my-auto">SOCIAL NETWORKS STYLE: </p>
        </div>
        <div class="col">
            <label for="social-networks-style-bootstrapclass">Classe bootstrap</label>
            <input type="text" class="form-control" id="social-networks-style-bootstrapclass" bind:value={footer.STYLE.SOCIAL_NETWORKS.bootstrapClass} placeholder="Ex. bg-primary">
        </div>
        <div class="col">
            <label for="social-networks-style-style">Style (CSS)</label>
            <input type="text" class="form-control" id="social-networks-style-style" bind:value={footer.STYLE.SOCIAL_NETWORKS.style} placeholder="Ex. background: blue;">
        </div>
    </div>
</div>