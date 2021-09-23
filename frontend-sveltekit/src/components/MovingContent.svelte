<script>
    import { Button, Col, Icon, Row } from "sveltestrap";
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


    const deleteAction = async() => {

        const values = array[position];
        await recursiveDeleteAction(values);
        array.splice(position, 1);
        updateMovedArray(array);
    };

</script>

<style>
    .moving-container {
        -webkit-transform: scale(1);
	    transform: scale(1);
        transition: .5s ease;
        border: dashed 1px;
    }
    .moving-container:hover {
        -webkit-transform: scale(1.03);
	    transform: scale(1.03);
        transition: .5s ease;
    }
</style>

{#if admin}
    <div class='moving-container border-light rounded-3 mt-3 mb-1 p-3 bg-dark shadow-lg'>
        <Row class='align-items-center'>
            <Col class='text-center mb-2'>
                <Button class='mx-3' color='secondary' on:click={() => upAction()}><Icon name='caret-up'/>  UP</Button>
                <Button class='mx-3' color='secondary' on:click={() => downAction()}><Icon name='caret-down'/>  DOWN</Button>
                <Button class='mx-3' color='danger' on:click={async() => await deleteAction()}><Icon name='trash'/>  DELETE</Button>
            </Col>
        </Row>
        <slot></slot>
    </div>
{:else}
    <span><slot></slot></span>
{/if}
