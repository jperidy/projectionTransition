<script>
import { goto } from "$app/navigation";
    
</script>


<div class="row bg-white text-dark align-items-center px-5 py-2 " style='min-height:15vh;'>
    <div class='col-sm-12 col-md-9 text-center'>
        <span class='mx-3 fw-bold ' style="font-size:1.2rem; cursor:pointer;" on:click={() => goto('/mentions-legales')}>MENTIONS LEGALES</span>
        <span class='fw-bold ' style="font-size:1.2rem;">|</span>
        <span class='mx-3 fw-bold ' style="font-size:1.2rem; cursor:pointer;" on:click={() => goto('/the-shift-project')}>THE SHIFT PROJECT</span>
        <span class='fw-bold ' style="font-size:1.2rem;">|</span>
        <span class='mx-3 fw-bold ' style="font-size:1.2rem; cursor:pointer;" on:click={() => goto('/archives-2020')}>ARCHIVES 2020</span>
    </div>
    
    <div class='col-sm-12 col-md-3 text-center'>
        <div class='row my-1'>
            <div class="col text-center" style='font-size:1.4rem'>
                <span class='fw-bold' style="margin: 0px 15px;"><a class="" target="_blank" href="https://www.facebook.com/FestivalProjectionTransition/"><i class="bi bi-facebook text-dark"></i></a></span>
                <span class='fw-bold' style="margin: 0px 15px;"><a class="" target="_blank" href="https://www.instagram.com/projectiontransition/"><i class="bi bi-instagram text-dark"></i></a></span>
                <span class='fw-bold' style="margin: 0px 15px;"><a class="" target="_blank" href="mailto:contact@projectiontransition.fr"><i class="bi bi-envelope-fill text-dark"></i></a></span>
            </div>
        </div>
    </div>
</div>