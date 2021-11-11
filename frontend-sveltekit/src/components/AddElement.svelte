<script>
  import { recursiveBlankMedias } from "../utils/imageFunctions";

  import { Button, Col, FormGroup, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "sveltestrap";
  import { copyComponent } from "../store";
  import { get } from "svelte/store";
    
  export let addContent = null;
  export let position = 0;
  export let addToLayout = null;
  export let open = false;
  //export let copyValues = [];
  //export let copyStyles = [];
  //export let copyType = '';

  let type = '';
  let values = [];
  let styles = [];
  //let copy = false;
  let past = false;


  const toggle = async(save) => {
    //console.log(save, open, addToLayout);
      if (open && addContent && save) {
        await addContent({type, values, styles }, position);
      }
      if (open && addToLayout && save) {
        await addToLayout({type, values, styles }, position);
      }
      open = !open;
      //copy = false;
      past = false;
  };

  const updateValues = () => {
    // if (copy) {
    //   let newArrayCopy = JSON.parse(JSON.stringify(copyValues));
    //   recursiveBlankMedias(newArrayCopy);
    //   values = newArrayCopy;
    //   console.log('valuesCopy', values);
    //   styles = copyStyles;
    //   type = copyType;
    // } else 
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

  // const onChangeHandler = () => {
  //     copy = false;
  //     updateValues();
  // };

  // const toogleCopy = () => {
  //   copy = !copy;
  //   if (copy) past = false;
  //   updateValues();
  // };

  const tooglePast = () => {
    past = !past;
    //if (past) copy = false;
    updateValues();
  };

  const handleClick = (typeComponent) => {
    type = typeComponent;
    //copy = false;
    updateValues();
  };

</script>

<Modal isOpen={open} {toggle} size='lg' scrollable>
    <ModalHeader {toggle}>Ajouter un contenu</ModalHeader>
    <ModalBody>
      <Row>
        <Col>
          <FormGroup>
            {#if $copyComponent}
              <div class="form-check form-switch mt-3">
                <input class="form-check-input" type="checkbox" id="flexSwitchPast" checked={past} on:change={tooglePast}>
                <label class="form-check-label" for="flexSwitchPast">Coller ici la forme que vous avez auparavant copié</label>
              </div>  
            {/if}
            <!-- <div class="form-check form-switch mt-3">
              <input class="form-check-input" type="checkbox" id="flexSwitchCopy" checked={copy} on:change={toogleCopy}>
              <label class="form-check-label" for="flexSwitchCopy">Copier la forme que vous venez de sélectionner</label>
            </div> -->
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

              <!-- <Label for="exampleSelect">Select</Label>
              <select class='form-select' type="select" name="select" id="exampleSelect" bind:value={type} on:change={onChangeHandler}>
                <option value='' selected={type === ''}>--- select ---</option>
                <option value='layoutComponent' selected={type === 'layoutComponent'}>type LAYOUT</option>
                <option value='textComponent' selected={type === 'textComponent'}>type TEXT</option>
                <option value='imageComponent' selected={type === 'imageComponent'}>type IMAGE</option>
                <option value='videoComponent' selected={type === 'videoComponent'}>type VIDEO</option>
                <option value='compressComponent' selected={type === 'compressComponent'}>type COMPRESS FILE</option>
                <option value='contactComponent' selected={type === 'contactComponent'}>type CONTACT</option>
                <option value='sousligneComponent' selected={type === 'sousligneComponent'}>type TRAIT</option>
                <option value='carouselComponent' selected={type === 'carouselComponent'}>type CAROUSEL</option>
                <option value='editoComponent' selected={type === 'editoComponent'}>type EDITO</option>
                <option value='articlesComponent' selected={type === 'articlesComponent'}>type ARTICLES</option>
                <option value='partenairesComponent' selected={type === 'partenairesComponent'}>type PARTENAIRES</option>
                <option value='infoComponent' selected={type === 'infoComponent'}>type INFO VILLE</option>
                <option value='programmationComponent' selected={type === 'programmationComponent'}>type PROGRAMMATION VILLE</option>
                <option value='equipeComponent' selected={type === 'equipeComponent'}>type EQUIPE</option>
              </select> -->
            {/if}
          </FormGroup> 
        </Col>
      </Row>
    </ModalBody>

    <ModalFooter>
      <Button color="primary" on:click={() => toggle(true)}>Enregistrer</Button>
      <Button color="secondary" on:click={() => toggle(false)}>Cancel</Button>
    </ModalFooter>

  </Modal>