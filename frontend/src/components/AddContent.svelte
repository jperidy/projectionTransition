<script>
  import { Button, Col, FormGroup, Input, Label, Row, Modal, ModalHeader, ModalBody, ModalFooter } from "sveltestrap";
  import DisplayCustomComponent from "./DisplayCustomComponent.svelte";

  export let admin = false;
  export let addContent = null;

  let section = '';
  let type = '';
  let value = '';
  let values = [{
            url: '',
            title: '',
            subTitle: '',
            text: '',
            footer: '',
  }];

  let open = false;

  const toggle = () => (open = !open);

  const validateModal = () => {
    addContent({section, type, value, values });
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
              <Label for='input-section'>Nom de la section (non affiché)</Label>
              <Input type='text' name='text' id='input-section' bind:value={section} />
              <FormGroup>
                  <Label for="exampleSelect">Select</Label>
                  <select class='form-select' type="select" name="select" id="exampleSelect" bind:value={type}>
                    <option value='' selected={type === ''}>--- select ---</option>
                    <option value='text' selected={type === 'text'}>type TEXT</option>
                    <option value='card' selected={type === 'card'}>type CARD</option>
                    <option value='carousel' selected={type === 'carousel'}>type CAROUSEL</option>
                    <option value='video' selected={type === 'video'}>type VIDEO</option>
                  </select>
                </FormGroup> 
          </Col>
        </Row>

        <Row class='mt-5'>
          <Col>
            <DisplayCustomComponent 
              bind:value={value}
              bind:values={values}
              type={type}
              updateContent={null}
              admin={admin}
              edit={true}
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