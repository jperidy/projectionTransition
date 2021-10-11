<script>
    import { goto } from "$app/navigation";
    import config from '../config.json';
</script>

<div class={`row ${config.FOOTER.STYLE.FOOTER.bootstrapClass}`}>

    {#if config.FOOTER.TYPE.navigation}
        <div class={`row ${config.FOOTER.STYLE.NAVIGATION.bootstrapClass}`} style={config.FOOTER.STYLE.NAVIGATION.style}>
            <div class='col-3 text-start'>
                <a href="#up">
                    <img 
                        class='img-fluid mx-2'
                        src={config.FOOTER.BRAND.LOGO.path}
                        alt={config.FOOTER.BRAND.LOGO.alt}
                        style={config.FOOTER.BRAND.LOGO.style}
                    />
                </a>
            </div>
            <div class='col-6 text-center'>
                <div class='row align-items-center'>
                    <div class='col text-center'>
                        {#each config.FOOTER.TITLE as item, position}
                            <span class={config.FOOTER.STYLE.TITLE.bootstrapClass} style={config.FOOTER.STYLE.TITLE.style} on:click={() => goto(item.url)}>{item.name}</span>
                            {#if position < (config.FOOTER.TITLE.length - 1)}
                                <span class='fw-bold' style={config.FOOTER.STYLE.TITLE.style}>|</span>
                            {/if} 
                        {/each}
                    </div>
                </div>
            </div>
            <div class='col-3 text-center'>
                <div class='row my-1'>
                    <div class="col text-center" style='font-size:1.4rem'>
                        {#each config.FOOTER.SOCIAL_NETWORKS as item}
                            <span class='fw-bold'><a class="" target={item.target} href={item.redirect}><img class={config.FOOTER.STYLE.SOCIAL_NETWORKS.bootstrapClass} style={config.FOOTER.STYLE.SOCIAL_NETWORKS.style} src={item.icon} alt={item.alt} /></a></span>
                        {/each}
                    </div>
                </div>
            </div>
        </div>
    {/if}
    {#if config.FOOTER.TYPE.copyright}
        <div class={`row ${config.FOOTER.STYLE.COPYRIGHT.bootstrapClass}`} style={config.FOOTER.STYLE.COPYRIGHT.style}>
            <div class='col text-center'>
                <span class={config.FOOTER.COPYRIGHT.bootstrapClass} style={config.FOOTER.COPYRIGHT.style}>{config.FOOTER.COPYRIGHT.value}</span>
            </div>
        </div>
    {/if}
</div>

<!-- <div class='row bg-white text-dark align-items-center'>
    <div class="row bg-white text-dark align-items-center px-3 py-2 " style='min-height:15vh;'>
        <div class='col-3 text-start'>
            <a href="#up">
                <img 
                    class='img-fluid mx-2'
                    src="/images/Logo_Principal.jpg"
                    alt='logo en projection transition en bas de page'
                    style="width: 100%; max-width:130px;"
                />
            </a>
        </div>
        <div class='col-6 text-center'>
            <div class='row align-items-center'>
                <div class='col text-center'>
                    <span class='ref-bas mx-3 fw-bold' on:click={() => goto('/the-shift-project#up')}>QUI SOMMES-NOUS</span>
                    <span class='ref-bas fw-bold ' >|</span>
                    <span class='ref-bas mx-3 fw-bold ' on:click={() => goto('/presse#up')}>PRESSE</span>
                    <span class='ref-bas fw-bold ' >|</span>
                    <span class='ref-bas mx-3 fw-bold ' on:click={() => goto('/archives-2020#up')}>ARCHIVES 2020</span>
                    <span class='ref-bas fw-bold ' >|</span>
                    <span class='ref-bas mx-3 fw-bold ' on:click={() => goto('/mentions-legales')}>MENTIONS L&Eacute;GALES</span>
                </div>
            </div>
        </div>
        <div class='col-3 text-center'>
            <div class='row my-1'>
                <div class="col text-center" style='font-size:1.4rem'>
                    <span class='fw-bold'><a class="" target="_self" href="/informationsPratiques#contact"><img class='icone-rs' src="/icones/MAIL.004.png" alt="icone envoyer mail" /></a></span>
                    <span class='fw-bold'><a class="" target="_blank" href="https://www.facebook.com/FestivalProjectionTransition/"><img class='icone-rs' src="/icones/FB.004.png" alt="icone lien Facebook" /></a></span>
                    <span class='fw-bold'><a class="" target="_blank" href="https://www.instagram.com/projectiontransition/"><img class='icone-rs' src="/icones/INSTA.004.png" alt="icone lien Instagram" /></a></span>
                    <span class='fw-bold'><a class="" target="_blank" href="https://www.youtube.com/channel/UCgSSefHpeDC42nXZcOy97aA"><img class='icone-rs' src="/icones/YT.004.png" alt="icone lien Youtube" /></a></span>
                </div>
            </div>
        </div>
    </div>
    <div class="row align-items-center my-1">
        <div class='col text-center'>
            <span class='mx-3fw-bold' style="font-size:1rem; ">&copy;2021 Projection Transition</span>
        </div>
    </div>
</div> -->

<style>
    /* .ref-bas {
        font-size:1rem; 
        cursor:pointer;
    } */
    /* .icone-rs {
        max-width: 7vh;
        height: auto;
    } */
</style>