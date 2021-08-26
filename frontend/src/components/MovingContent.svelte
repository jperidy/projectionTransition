<script>
    import { Button, Col, Icon, Row } from "sveltestrap";
import { deleteImage } from "../actions/imagesActions";
    
    export let array = [];
    export let position = 0;
    export let admin = false;
    export let updateMovedArray;

    const arrayMove = (arr, fromIndex, toIndex) => {
        var element = arr[fromIndex];
        arr.splice(fromIndex, 1);
        arr.splice(toIndex, 0, element);
        return arr;
    }

    const upAction = () => {
        if (position > 0) {
            array = arrayMove(array, position, position - 1);
        }
        updateMovedArray(array);
    };

    const downAction = () => {
        if (position < array.length - 1) {
            array = arrayMove(array, position, position + 1);
        }
        updateMovedArray(array); 
    };

    const deleteAction = async() => {
        
        // clean images in database
        const imageToDelete = array[position].values && array[position].values.map(x => x.url);
        for (let index = 0; index < imageToDelete.length; index++) {
            const pathToDelete = imageToDelete[index];
            if (pathToDelete.length) {
                const result = await deleteImage();
            }
        }
        array.splice(position, 1);
        updateMovedArray(array);
    };

</script>

{#if admin}
    <div class='border border-secondary my-3 pt-3'>
        <Row>
            <Col>
                <Button class='mx-3' color='secondary' on:click={() => upAction()}><Icon name='caret-up'/>  UP</Button>
                <Button class='mx-3' color='secondary' on:click={() => downAction()}><Icon name='caret-down'/>  DOWN</Button>
                <Button class='mx-3' color='danger' on:click={() => deleteAction()}><Icon name='trash'/>  DELETE</Button>
            </Col>
        </Row>
        
        <slot></slot>
    </div>
{:else}
    <span><slot></slot></span>
{/if}

<!-- <style>
    .moving-content-modify {
        border: 1px rgb(230, 220, 220) solid;
        margin-top: 3px;
        margin-bottom: 3px;
        padding-top: 5px;
    }
</style> -->