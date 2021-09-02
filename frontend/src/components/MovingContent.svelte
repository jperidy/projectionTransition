<script>
    import { Button, Col, Icon, Row } from "sveltestrap";
    // import { deleteImage } from "../actions/imagesActions";
    import { recursiveDeleteAction } from '../utils/imageFunctions'
    
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

    // const recursiveDeleteAction = async (array) => {

    //     for (let ind = 0 ; ind < array.length ; ind++) {
    //         if (array[ind].url && array[ind].url.length) {
    //             await deleteImage(array[ind].url);
    //         }
    //         if (array[ind].component && array[ind].component.values && array[ind].component.values.length) {
    //             recursiveDeleteAction(array[ind].component.values);
    //         }
    //         if (array[ind].values && array[ind].values.length) {
    //             recursiveDeleteAction(array[ind].values);
    //         }
    //     }
    //     return;
    // }

    const deleteAction = async() => {

        // delete component images from backend
        const values = array[position].values;
        await recursiveDeleteAction(values);

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