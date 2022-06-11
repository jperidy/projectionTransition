<script>
  import AddElement from "./AddElement.svelte";

  export let addContent = null;
  export let position = 0;
  export let addToLayout = null;

  let type = '';
  let values = [];
  let styles = [];

  const toggle = async(save) => {
    if (addContent && save) {
        await addContent({type, values, styles });
    }
    if (addToLayout && save) {
        await addToLayout({type, values, styles }, position);
    }
  };

</script>

<AddElement 
  addContent={addContent}
  position={position}      
  addToLayout={addToLayout}
/>

<div class='row my-1 py-1'>
  <div class='col'>
    <button 
      color="primary" 
      class='my-1 p-2' 
      on:click={toggle}
      data-bs-toggle="modal"
      data-bs-target="#addElementModal"
    >Add an element</button>
  </div>
</div>