<script>
  import { Button, Col, FormGroup, Label, Row, Modal, ModalHeader, ModalBody, ModalFooter } from "sveltestrap";
  import DisplayCustomComponent from "./DisplayCustomComponent.svelte";

  export let admin = false;
  export let addContent = null;

  let type = '';
  let values = [];
  let styles = [];

  let open = false;
  const toggle = () => (open = !open);

  const validateModal = () => {
    addContent({type, values, styles });
    toggle();
  };

</script>

<Row class='my-3 pt-3'>
  <Col>
    <Button color="primary" class='my-3' on:click={toggle}>Ajouter un contenu</Button>

    <Modal isOpen={open} {toggle}>
      
      <ModalHeader {toggle}>Ajouter un contenu</ModalHeader>
      
      <ModalBody>
        <Row>
          <Col>
              <FormGroup>
                  <Label for="exampleSelect">Select</Label>
                  <select class='form-select' type="select" name="select" id="exampleSelect" bind:value={type}>
                    <option value='' selected={type === ''}>--- select ---</option>
                    <option value='textComponent' selected={type === 'textComponent'}>type TEXT [NEW]</option>
                    <option value='imageComponent' selected={type === 'imageComponent'}>type IMAGE [NEW]</option>
                    <option value='videoComponent' selected={type === 'videoComponent'}>type VIDEO [NEW]</option>
                    <option value='carouselComponent' selected={type === 'carouselComponent'}>type CAROUSEL [NEW]</option>
                    <option value='editoComponent' selected={type === 'editoComponent'}>type EDITO [NEW]</option>
                    <option value='articlesComponent' selected={type === 'articlesComponent'}>type ARTICLES [NEW]</option>
                    <option value='partenairesComponent' selected={type === 'partenairesComponent'}>type PARTENAIRES [NEW]</option>
                    <option value='infoComponent' selected={type === 'infoComponent'}>type INFO VILLE [NEW]</option>
                    
                    <option value='test' selected={type === 'test'}>type TEST</option>
                  </select>
                </FormGroup> 
          </Col>
        </Row>

        <Row class='mt-5'>
          <Col>
            <DisplayCustomComponent 
              bind:values={values}
              bind:styles={styles}
              type={type}
              updateContent={null}
              admin={admin}
              edit={false}
            />
          </Col>
        </Row>
      </ModalBody>

      <ModalFooter>
        <Button color="primary" on:click={validateModal}>Enregistrer</Button>
        <Button color="secondary" on:click={toggle}>Cancel</Button>
      </ModalFooter>

    </Modal>
  </Col>
</Row>