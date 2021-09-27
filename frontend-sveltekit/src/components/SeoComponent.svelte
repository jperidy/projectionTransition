<script>
    import CustomContainer from "./CustomContainer.svelte";

    export let pageContent;
    export let page;
    export let siteURL;
    export let admin;
    export let updateContent;

    const defaultTitleSeo = `Projection Transition ${pageContent.name ? pageContent.name : ''}`;
    const defaultDescriptionSeo = "Retrouvez toutes les informations sur le festival Projection Transition";
    const defaultTitleOG = "Projection Transition - Le festival ciné-débat pour la transition écologique";
    const defaultDescriptionOG = "Retrouvez toutes les informations sur le festival Projection Transition";
</script>

<svelte:head>
    <title>{`${pageContent && pageContent.titleSeo ? pageContent.titleSeo : defaultTitleSeo}`}</title>
	<meta name='description' content={`${pageContent && pageContent.descriptionSeo ? pageContent.descriptionSeo : defaultDescriptionSeo}`} />
	<meta property="og:title" content={`${pageContent && pageContent.titleOG ? pageContent.titleOG : defaultTitleOG}`} />
	<meta property="og:description" content={`${pageContent && pageContent.descriptionOG ? pageContent.descriptionOG : defaultDescriptionOG}`} />
	<meta property="og:type" content="website" />
	<meta property="og:image" content={`${siteURL}/images/og_logo.jpg`} />
	<meta property="og:image:width" content="800" />
	<meta property="og:image:height" content="400" />
	<meta property="og:url" content={`${siteURL}${page.path}`} />
	<meta property="og:locale" content="fr_FR" />
	<meta name="twitter:image" content={`${siteURL}/images/og_logo.jpg`} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:description" content={`${pageContent && pageContent.descriptionOG ? pageContent.descriptionOG : defaultDescriptionOG}`} />
</svelte:head>

<CustomContainer size={{ xs: 12, sm:8, md:8, lg:8 }}>
    {#if admin && pageContent}
        <label for="seo-title" class='mt-5'>Balise "title" pour le SEO</label>
        <input 
            id="seo-title" 
            class='form-control' 
            type='text' 
            bind:value={pageContent.titleSeo} 
            on:change={updateContent}
            aria-describedby="seo-title-helper" 
            placeholder="Entrer le titre de la page (important pour le SEO)"
        />
        <div id="seo-title-helper" class="form-text">
            Très important pour le SEO. 
            Synthèse du contenu de la page. 
            Structure unique sur l'ensemble du site. 
            Chaque page a son propre titre (unique).
            Ne pas dépasser 60 à 80 caractères.
            Ne pas bourrer le mots clés.
        </div>
        
        <label for="seo-description" class='mt-3'>Balise "description" pour le SEO</label>
        <input 
            id="seo-description" 
            class='form-control' 
            type='text' 
            bind:value={pageContent.descriptionSeo} 
            on:change={updateContent}
            aria-describedby="seo-description-helper" 
            placeholder="Entrer la description de la page"
        />
        <div id="seo-description-helper" class="form-text">
            Pas importante pour le SEO. Mais importante dans l'affichage du résultat de la recherche.
            Le contenu de cette balise peut se retrouver juste sous le titre de la page dans le résultat de la recherche.
            Ce n'est pas obligatoire, parfois le moteur de recherche préférera afficher une partie du contenu de la page. 
            Soigner le contenu (des phrases). Mettre les mots clés de la page dans ces phrases.
            Eviter de dépasser 160 caractères.
            Avoir une description unique pour chacune des pages.
        </div>

        <label for="og-titre" class='mt-3'>Titre (Open Graph) : vignette lorsque vous partagez la page sur les réseaux sociaux</label>
        <input 
            id="og-titre" 
            class='form-control' 
            type='text' 
            bind:value={pageContent.titleOG} 
            on:change={updateContent}
            aria-describedby="og-titre-helper" 
            placeholder="Titre de la vignette sur les réseaux sociaux"
        />
        <div id="og-titre-helper" class="form-text">
            Pas d'impact sur le SEO.
            Lorsqu'un utilisateur partagera le lien de cette page sur les réseaux sociaux, une vignette s'affichera avec en titre le contenu que vous aurez renseigné.
        </div>

        <label for="og-description" class='mt-3'>Description (Open Graph) : vignette lorsque vous partagez la page sur les réseaux sociaux</label>
        <input 
            id="og-description" 
            class='form-control' 
            type='text' 
            bind:value={pageContent.descriptionOG} 
            on:change={updateContent}
            aria-describedby="og-description-helper" 
            placeholder="Description de la vignette sur les réseaux sociaux"
        />
        <div id="og-description-helper" class="form-text">
            Pas d'impact sur le SEO.
            Lorsqu'un utilisateur partagera le lien de cette page sur les réseaux sociaux, une vignette s'affichera avec en description le contenu que vous aurez renseigné.
        </div>
    {/if}
</CustomContainer>