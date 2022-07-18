<script>
    export let values;
    export let styles;
    export let selectedComponentPosition;

    import AddElement from '../AddElement.svelte';
    import EditLayoutComponentChildren from './EditLayoutComponentChildren.svelte';
    import DropDown from './DropDown.svelte';
    import EditStyleComponent from './EditStyleComponent.svelte';
    
    let positionToCreate = 0;

    const modalId = 'editLayoutComponentModal' + crypto.randomUUID();

    const addToLayout = (column, position) => {
        values[position].values[0] = column;
        values = values;
    };

    const columnChangeHandler = (number) => {
        if (number > values.length && number >=1) {
            while (values.length < number) {
                values.push({type:'layout', size: 4, sizeTablette: 4, sizeMobile: 12, values:[]});
            }
        } else {
            const limit = 0;
            while (values.length > number && values.length > limit) {
                values.pop();
            }
        }
        values = values;
    };
    
</script>

<EditStyleComponent 
    bind:styles={styles}
    stylesToEdit={{
        screenSize: true,
        alignContent: true,
        border: true,
        background: true,
        spaces: true,
    }} 
/>

<div class="row align-items-center d-block">
    
    <DropDown
        title="Number of columns"
    >
        <div class='p-3 d-flex align-items-center'>
            <label for="input-columns" class="form-label w-100"><strong>Number of column in the frame</strong></label>
            <input type="number" class="form-control" id="input-columns" 
                aria-describedby="nombre de colonnes" 
                placeholder="Nombre de colonnes"
                min={1}
                required
                value={values.length}
                on:change={(e) => columnChangeHandler(e.target.value)}
            />
        </div>
    </DropDown>
    
    
    <div class="mt-1 d-block">
        {#each values as component, index}
            <EditLayoutComponentChildren 
                bind:values={values}
                bind:component={component}
                bind:selectedComponentPosition={selectedComponentPosition}
                bind:positionToCreate={positionToCreate}
                index={index}
                modalId={modalId}
            />
        {/each}
    </div>    
</div>

<AddElement
    position={positionToCreate}
    action={addToLayout}
    modalId={modalId}
/>