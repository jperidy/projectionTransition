<script>
    import { Col, FormGroup, Input, Label, Row } from "sveltestrap";

    let type = '';

</script>

<Row class='border border-secondary my-3 pt-3'>
    <h3>Ajouter un contenu</h3>
    <Col>
        <FormGroup>
            <Label for="exampleSelect">Select</Label>
            <select class='form-select' type="select" name="select" id="exampleSelect" bind:value={type} on:change={() => console.log(type)}>
              <option value='' selected={type === ''}>--- select ---</option>
              <option value='text' selected={type === 'text'}>type TEXT</option>
              <option value='card' selected={type === 'card'}>type CARD</option>
              <option value='carousel' selected={type === 'carousel'}>type CAROUSEL</option>
            </select>
          </FormGroup> 
    </Col>
</Row>