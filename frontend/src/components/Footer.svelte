<script>
import { push } from "svelte-spa-router";


    
</script>


<div class="row text-secondary align-items-center px-5 py-2 border-top border-body text-body" style='min-height:5vh;'>
    <div class='col-sm-12 col-md-9 text-center'><span class='fw-bold text-body' style="font-size:1.2rem; cursor:pointer;" on:click={() => push('#/mentions-legales')}>MENTIONS LEGALES</span></div>
    <div class='col-sm-12 col-md-3 text-center'>
        <div class='row my-1'>
            <div class="col text-center" style='font-size:1.4rem'>
                <span class='fw-bold' style="margin: 0px 15px;"><a class="text-body" href="https://www.facebook.com/FestivalProjectionTransition/"><i class="bi bi-facebook"></i></a></span>
                <span class='fw-bold' style="margin: 0px 15px;"><a class="text-body" href="https://www.instagram.com/projectiontransition/"><i class="bi bi-instagram"></i></a></span>
                <span class='fw-bold' style="margin: 0px 15px;"><a class="text-body" href="mailto:contact@projectiontransition.fr"><i class="bi bi-envelope-fill"></i></a></span>
            </div>
        </div>
    </div>
</div>

<!-- <div class='row mt-3'>
    <div class='col text-center'>
        <p><strong>&copy; jprdev</strong></p>
    </div>
</div> -->