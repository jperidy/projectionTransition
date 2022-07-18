<script>
    export let values;
    export let styles;styles;

</script>

<label for="type-of-contact">Send to: </label>
<select class='form-control' name="type-of-contact" id="type-of-contact" bind:value={values[0].type}>
    <option value="">--selectionner--</option>
    <option value="contact">Contact</option>
    <option value="dev">Developer</option>
</select>