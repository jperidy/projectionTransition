<script>
  import { Button, Col, FormGroup, Input, Label, Row } from "sveltestrap";
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


</script>

<Row class='border border-secondary my-3 pt-3'>
    <h3>Ajouter un contenu</h3>
    <Button on:click={() => addContent({section, type, value, values })}>Enregistrer</Button>
    <Row>
      <Col>
          <Label for='input-section'>Nom de la section (non affiché)</Label>
          <Input type='text' name='text' id='input-section' bind:value={section} />
          <FormGroup>
              <Label for="exampleSelect">Select</Label>
              <select class='form-select' type="select" name="select" id="exampleSelect" bind:value={type} on:change={() => console.log(type)}>
                <option value='' selected={type === ''}>--- select ---</option>
                <option value='text' selected={type === 'text'}>type TEXT</option>
                <option value='card' selected={type === 'card'}>type CARD</option>
                <option value='video' selected={type === 'video'}>type VIDEO</option>
              </select>
            </FormGroup> 
      </Col>
    </Row>
    <Row>
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
</Row>