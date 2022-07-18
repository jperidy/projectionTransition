<script>
    export let pageContent;

    let visible = false;


</script>

<style>
    .edit-component:hover {
        font-weight: bold;
    }
    .item:hover {
        transform: scale(1.01);
    }
</style>

<div class="my-2 p-1 shadow-sm item rounded">
    <div class="d-flex justify-content-between">
        <button class="edit-component btn btn-md btn-transparent px-0 text-start text-dark" on:click={() => visible = !visible}>
            {#if visible}
                <i class="bi bi-dash-square me-3 ms-2"></i>
            {:else}
                <i class="bi bi-plus-square me-3 ms-2"></i>
            {/if}
            SHOW SEO CONFIGURATION
        </button>
    </div>
</div>

{#if visible}
<label for="seo-title" class='mt-2'>Balise "title" for SEO</label>
<button type="button" class="btn btn-transparent" data-bs-toggle="tooltip" data-bs-placement="top" 
title="Très important pour le SEO. 
Synthèse du contenu de la page. 
Structure unique sur l'ensemble du site. 
Chaque page a son propre titre (unique).
Ne pas dépasser 60 à 80 caractères.
Ne pas bourrer le mots clés.">
    <i class="bi bi-question-circle-fill text-dark"></i>
</button>
<input 
    id="seo-title" 
    class='form-control' 
    type='text' 
    bind:value={pageContent.titleSeo} 
    aria-describedby="seo-title-helper" 
    placeholder="Entrer le titre de la page (important pour le SEO)"
/>

<label for="seo-description" class='mt-3'>Balise "description" for SEO</label>
<button type="button" class="btn btn-transparent" data-bs-toggle="tooltip" data-bs-placement="top" 
title="Pas importante pour le SEO. Mais importante dans l'affichage du résultat de la recherche.
Le contenu de cette balise peut se retrouver juste sous le titre de la page dans le résultat de la recherche.
Ce n'est pas obligatoire, parfois le moteur de recherche préférera afficher une partie du contenu de la page. 
Soigner le contenu (des phrases). Mettre les mots clés de la page dans ces phrases.
Eviter de dépasser 160 caractères.
Avoir une description unique pour chacune des pages.">
    <i class="bi bi-question-circle-fill text-dark"></i>
</button>
<input 
    id="seo-description" 
    class='form-control' 
    type='text' 
    bind:value={pageContent.descriptionSeo} 
    aria-describedby="seo-description-helper" 
    placeholder="Entrer la description de la page"
/>

<label for="og-titre" class='mt-3'>OG (Open-Graph) : share a thumbnail title on Social Networks</label>
<button type="button" class="btn btn-transparent" data-bs-toggle="tooltip" data-bs-placement="top" 
title="Pas d'impact sur le SEO.
Lorsqu'un utilisateur partagera le lien de cette page sur les réseaux sociaux, une vignette s'affichera avec en titre le contenu que vous aurez renseigné.">
<i class="bi bi-question-circle-fill text-dark"></i>
</button>
<input 
    id="og-titre" 
    class='form-control' 
    type='text' 
    bind:value={pageContent.titleOG} 
    aria-describedby="og-titre-helper" 
    placeholder="Titre de la vignette sur les réseaux sociaux"
/>

<label for="og-description" class='mt-3'>OG (Open-Graph) : share a thumbnail description on Social Networks</label>
<button type="button" class="btn btn-transparent" data-bs-toggle="tooltip" data-bs-placement="top" 
title="Pas d'impact sur le SEO.
Lorsqu'un utilisateur partagera le lien de cette page sur les réseaux sociaux, une vignette s'affichera avec en description le contenu que vous aurez renseigné.">
<i class="bi bi-question-circle-fill text-dark"></i>
</button>
<input 
    id="og-description" 
    class='form-control' 
    type='text' 
    bind:value={pageContent.descriptionOG} 
    aria-describedby="og-description-helper" 
    placeholder="Description de la vignette sur les réseaux sociaux"
/>

{/if}