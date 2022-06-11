<script>
  import { recursiveBlankMedias } from "../utils/imageFunctions";
  
  import { copyComponent } from "../store";
  import { get } from "svelte/store";
  
  export let addContent = null;
  export let position = 0;
  export let addToLayout = null;
  
  let type = '';
  let values = [];
  let styles = [];
  let past = false;
  
  
  const toggle = async(save) => {
    if (addContent && save) {
      await addContent({type, values, styles }, position);
    }
    if (addToLayout && save) {
      await addToLayout({type, values, styles }, position);
    }
    past = false;
  };
  
  const updateValues = () => {
    if (past) {
      let newArrayPast = JSON.parse(JSON.stringify(get(copyComponent))).values;
      recursiveBlankMedias(newArrayPast);
      values = newArrayPast;
      styles = JSON.parse(JSON.stringify(get(copyComponent))).styles;
      type = JSON.parse(JSON.stringify(get(copyComponent))).type;
    } else {
      values=[];
      styles=[];
    }
  }
  
  const tooglePast = () => {
    past = !past;
    updateValues();
  };
  
  const handleClick = (typeComponent) => {
    type = typeComponent;
    updateValues();
  };
  
</script>

<div class="modal fade" id="addElementModal" tabindex="-1" aria-labelledby="addElementModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-scrollable">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="staticBackdropLabel">Ajouter un contenu</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div class='row'>
          <div class='col'>
            <div>
              {#if $copyComponent}
              <div class="form-check form-switch mt-3">
                <input class="form-check-input" type="checkbox" id="flexSwitchPast" checked={past} on:change={tooglePast}>
                <label class="form-check-label" for="flexSwitchPast">Coller ici la forme que vous avez auparavant copié</label>
              </div>  
              {/if}
              {#if !past}
                <div class='mt-3 d-grid gap-2 d-sm-block'>
                  <h3>Standard components: </h3>
                  <button 
                    class={`btn ${type === 'layoutComponent' ? 'btn-primary' : 'btn-light'}  btn-lg`} 
                    on:click={() => handleClick('layoutComponent')}
                    data-bs-toggle="tooltip" 
                    data-bs-placement="right" 
                    title="Add a frame in your page to host another components like Text, Image, Video"
                    >
                    <i class="bi bi-grid-1x2"></i>
                  </button>
                  <button 
                    class={`btn ${type === 'textComponent' ? 'btn-primary' : 'btn-light'}  btn-lg`} 
                    on:click={() => handleClick('textComponent')}
                    data-bs-toggle="tooltip" 
                    data-bs-placement="right" 
                    title="Add a text in your page or in your frame (recommended)"
                    >
                    <i class="bi bi-type"></i>
                  </button>
                  <button 
                    class={`btn ${type === 'imageComponent' ? 'btn-primary' : 'btn-light'}  btn-lg`}  
                    on:click={() => handleClick('imageComponent')}
                    data-bs-toggle="tooltip" 
                    data-bs-placement="right" 
                    title="Add an image in your page or in your frame (recommended)"
                    >
                    <i class="bi bi-image"></i>
                  </button>
                  <button 
                    class={`btn ${type === 'videoComponent' ? 'btn-primary' : 'btn-light'}  btn-lg`}  
                    on:click={() => handleClick('videoComponent')}
                    data-bs-toggle="tooltip" 
                    data-bs-placement="right" 
                    title="Add a video in your page or in your frame (recommended)"
                    >
                    <i class="bi bi-youtube"></i>
                  </button>
                  <button 
                    class={`btn ${type === 'compressComponent' ? 'btn-primary' : 'btn-light'}  btn-lg`}  
                    on:click={() => handleClick('compressComponent')}
                    data-bs-toggle="tooltip" 
                    data-bs-placement="right" 
                    title="Upload a compressed file that user can download in your page or in your frame (recommended)"
                    >
                    <i class="bi bi-file-earmark-arrow-up"></i>
                  </button>
                  <button 
                    class={`btn ${type === 'sousligneComponent' ? 'btn-primary' : 'btn-light'}  btn-lg`}  
                    on:click={() => handleClick('sousligneComponent')}
                    data-bs-toggle="tooltip" 
                    data-bs-placement="right" 
                    title="Add a line form in your page or in your frame (recommended)"
                    >
                    <i class="bi bi-dash"></i>
                  </button>
                  <button 
                    class={`btn ${type === 'multiLayerComponent' ? 'btn-primary' : 'btn-light'}  btn-lg`}  
                    on:click={() => handleClick('multiLayerComponent')}
                    data-bs-toggle="tooltip" 
                    data-bs-placement="right" 
                    title="Add a multi-layer form in your page or in your frame (recommended)"
                    >
                    <i class="bi bi-stack"></i>
                  </button>
                </div>
                <div class='mt-3 d-grid gap-2 d-sm-block'>
                  <h3>Custom components: </h3>
                  <button 
                    class={`btn ${type === 'contactComponent' ? 'btn-primary' : 'btn-light'}  btn-lg`}  
                    on:click={() => handleClick('contactComponent')}
                    data-bs-toggle="tooltip" 
                    data-bs-placement="right" 
                    title="Add a contact form in your page or in your frame (recommended)"
                    >
                    <i class="bi bi-envelope"></i>
                  </button>
                  <button 
                    class={`btn ${type === 'carouselComponent' ? 'btn-primary' : 'btn-light'}  btn-lg`}  
                    on:click={() => handleClick('carouselComponent')}
                    data-bs-toggle="tooltip" 
                    data-bs-placement="right" 
                    title="Add a carousel in your page or in your frame (recommended)"
                    >
                    <i class="bi bi-images"></i>
                  </button>
                  <button 
                    class={`btn ${type === 'editoComponent' ? 'btn-primary' : 'btn-light'}  btn-lg`}  
                    on:click={() => handleClick('editoComponent')}
                    data-bs-toggle="tooltip" 
                    data-bs-placement="right" 
                    title="Add an edito composition in your page or in your frame (recommended)"
                    >
                    <i class="bi bi-megaphone"></i>
                  </button>
                  <button 
                    class={`btn ${type === 'programmationComponent' ? 'btn-primary' : 'btn-light'}  btn-lg`}  
                    on:click={() => handleClick('programmationComponent')}
                    data-bs-toggle="tooltip" 
                    data-bs-placement="right" 
                    title="Add a programmation component in your page or in your frame (recommended) : create a frame with all films and links to pre-built pages with complete films details"
                    >
                    <i class="bi bi-film"></i>
                  </button>
                  <button 
                    class={`btn ${type === 'infoComponent' ? 'btn-primary' : 'btn-light'}  btn-lg`}  
                    on:click={() => handleClick('infoComponent')}
                    data-bs-toggle="tooltip" 
                    data-bs-placement="right" 
                    title="Add a component in your page or in your frame (recommended) with information on your event : map, price, others informations"
                    >
                    <i class="bi bi-geo-alt"></i>
                  </button>
                  <button 
                    class={`btn ${type === 'articlesComponent' ? 'btn-primary' : 'btn-light'}  btn-lg`}  
                    on:click={() => handleClick('articlesComponent')}
                    data-bs-toggle="tooltip" 
                    data-bs-placement="right" 
                    title="Add an article component in your page or in your frame (recommended) : create a frame with all articles and link to pre-built pages with complete article (work in progress)"
                    >
                    <i class="bi bi-megaphone"></i>
                  </button>
                </div>
              {/if}
            </div> 
          </div>
        </div>
      </div>
      <div class=modal-footer>
        <button 
          type="button" 
          class="btn btn-primary" 
          on:click={() => toggle(true)}
          data-bs-dismiss="modal"
        >Add</button>
        <button 
          type="button" 
          class="btn btn-secondary" 
          data-bs-dismiss="modal" 
          on:click={() => toggle(false)}
        >Cancel</button>
      </div>
    </div>
  </div>
</div>