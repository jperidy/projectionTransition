<script>
  import { Button, Col, FormGroup, Label, Row, Modal, ModalHeader, ModalBody, ModalFooter } from "sveltestrap";
  import AddElement from "./AddElement.svelte";
  //import DisplayCustomComponent from "./DisplayCustomComponent.svelte";

  export let admin = false;
  export let addContent = null;
  export let position = 0;
  export let addToLayout = null;
  admin;

  let type = '';
  let values = [];
  let styles = [];

  let open = false;
  //const toggle = () => (open = !open);

  const toggle = async(save) => {
    if (open && addContent && save) {
        await addContent({type, values, styles });
    }
    if (open && addToLayout && save) {
        await addToLayout({type, values, styles }, position);
    }
    open = !open;
  };

</script>

<AddElement 
  addContent={addContent}
  position={position}      
  bind:open={open}
  addToLayout={addToLayout}
/>

<Row class='my-1 py-1'>
  <Col>
    <Button color="primary" class='my-1 p-2' on:click={toggle}>Ajouter un contenu</Button>
  </Col>
</Row>