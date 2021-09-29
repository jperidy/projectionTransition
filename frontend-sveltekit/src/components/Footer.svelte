<script>
    import { goto } from "$app/navigation";
</script>

<div class='row bg-white text-dark align-items-center'>
    <div class="row bg-white text-dark align-items-center px-3 py-2 " style='min-height:15vh;'>
        <div class='col-3 text-center'>
            <a href="#up">
                <img 
                    src="/favicon-bas-page.jpeg"
                    alt='logo en projection transition en bas de page'
                    style="width: 100%; max-width:20vh;"
                />
            </a>
        </div>
        <div class='col-6 text-center'>
            <div class='row align-items-center'>
                <div class='col text-center'>
                    <span class='ref-bas mx-3 fw-bold' on:click={() => goto('/the-shift-project#up')}>QUI SOMMES NOUS</span>
                    <span class='ref-bas fw-bold ' >|</span>
                    <span class='ref-bas mx-3 fw-bold ' on:click={() => goto('/presse#up')}>PRESSE</span>
                    <span class='ref-bas fw-bold ' >|</span>
                    <span class='ref-bas mx-3 fw-bold ' on:click={() => goto('/archives-2020#up')}>ARCHIVES 2020</span>
                    <span class='ref-bas fw-bold ' >|</span>
                    <span class='ref-bas mx-3 fw-bold ' on:click={() => goto('/mentions-legales')}>MENTIONS LEGALES</span>
                </div>
            </div>
            <!-- <div class="row align-items-center">
                <div class='col text-center'>
                </div>
            </div> -->
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
</div>

<style>
    .ref-bas {
        font-size:1.1rem; 
        cursor:pointer;
    }
    .icone-rs {
        max-width: 7vh;
        height: auto;
    }
</style>


<!-- <i class="bi bi-envelope-fill text-dark"></i> -->
<!-- <i class="bi bi-facebook text-dark"></i> -->
<!-- <i class="bi bi-instagram text-dark"></i> -->