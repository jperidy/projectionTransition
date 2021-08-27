<script>
  import { Button, Col, FormGroup, Label, Row, Modal, ModalHeader, ModalBody, ModalFooter } from "sveltestrap";
  import DisplayCustomComponent from "./DisplayCustomComponent.svelte";

  export let admin = false;
  export let addContent = null;

  // let section = '';
  //let components = [];
  let type = '';
  let value = '';
  let values = [];
  // let values = [{ url: '', title: '', subTitle: '', text: '', footer: ''}];
  let styles = [];

  let open = false;
  const toggle = () => (open = !open);

  const validateModal = () => {
    console.log({type, value, values, styles});
    addContent({type, values, styles });
    // addContent({section, type, value, values, styles });
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
              <!-- <Label for='input-section'>Nom de la section (non affiché)</Label>
              <Input type='text' name='text' id='input-section' bind:value={section} /> -->
              <FormGroup>
                  <Label for="exampleSelect">Select</Label>
                  <select class='form-select' type="select" name="select" id="exampleSelect" bind:value={type}>
                    <option value='' selected={type === ''}>--- select ---</option>
                    <option value='textComponent' selected={type === 'textComponent'}>type TEXT [NEW]</option>
                    <option value='imageComponent' selected={type === 'imageComponent'}>type IMAGE [NEW]</option>
                    <option value='carouselComponent' selected={type === 'carouselComponent'}>type CAROUSEL [NEW]</option>
                    <option value='text' selected={type === 'text'}>type TEXT</option>
                    <option value='carousel' selected={type === 'carousel'}>type CAROUSEL</option>
                    <option value='video' selected={type === 'video'}>type VIDEO</option>
                    <option value='image' selected={type === 'image'}>type IMAGE</option>
                    <option value='edito' selected={type === 'edito'}>type EDITO</option>
                    <option value='card' selected={type === 'card'}>type CARD</option>
                    <option value='test' selected={type === 'test'}>type TEST</option>
                  </select>
                </FormGroup> 
          </Col>
        </Row>

        <Row class='mt-5'>
          <Col>
            <DisplayCustomComponent 
              bind:value={value}
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