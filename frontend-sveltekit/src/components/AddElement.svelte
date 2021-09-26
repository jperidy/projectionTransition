<script>

    import { Button, Col, FormGroup, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "sveltestrap";
    
    export let addContent = null;
    export let position = 0;
    export let addToLayout = null;
    export let open = false;

    let type = '';
    let values = [];
    let styles = [];

    //let open = false;

    const toggle = async(save) => {
        if (open && addContent && save) {
            await addContent({type, values, styles }, position);
        }
        if (open && addToLayout && save) {
            await addToLayout({type, values, styles }, position);
        }
        open = !open;
    };

    const onChangeHandler = () => {
        values=[];
        styles=[];
    }

</script>

<Modal isOpen={open} {toggle} size='lg' scrollable>
      
    <ModalHeader {toggle}>Ajouter un contenu</ModalHeader>
    
    <ModalBody>
      <Row>
        <Col>
            <FormGroup>
                <Label for="exampleSelect">Select</Label>
                <select class='form-select' type="select" name="select" id="exampleSelect" bind:value={type} on:change={onChangeHandler}>
                  <option value='' selected={type === ''}>--- select ---</option>
                  <option value='layoutComponent' selected={type === 'layoutComponent'}>type LAYOUT</option>
                  <option value='textComponent' selected={type === 'textComponent'}>type TEXT</option>
                  <option value='imageComponent' selected={type === 'imageComponent'}>type IMAGE</option>
                  <option value='videoComponent' selected={type === 'videoComponent'}>type VIDEO</option>
                  <option value='carouselComponent' selected={type === 'carouselComponent'}>type CAROUSEL</option>
                  <option value='editoComponent' selected={type === 'editoComponent'}>type EDITO</option>
                  <option value='articlesComponent' selected={type === 'articlesComponent'}>type ARTICLES</option>
                  <option value='partenairesComponent' selected={type === 'partenairesComponent'}>type PARTENAIRES</option>
                  <option value='infoComponent' selected={type === 'infoComponent'}>type INFO VILLE</option>
                  <option value='programmationComponent' selected={type === 'programmationComponent'}>type PROGRAMMATION VILLE</option>
                  <option value='equipeComponent' selected={type === 'equipeComponent'}>type EQUIPE</option>
                  <option value='contactComponent' selected={type === 'contactComponent'}>type CONTACT</option>
                  
                  <option value='test' selected={type === 'test'}>type TEST</option>
                </select>
              </FormGroup> 
        </Col>
      </Row>
    </ModalBody>

    <ModalFooter>
      <Button color="primary" on:click={() => toggle(true)}>Enregistrer</Button>
      <Button color="secondary" on:click={() => toggle(false)}>Cancel</Button>
    </ModalFooter>

  </Modal>