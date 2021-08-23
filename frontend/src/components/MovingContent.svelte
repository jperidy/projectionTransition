<script>
    import { Button, Col, Icon, Row } from "sveltestrap";
    
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
    }

</script>

{#if admin}
    <div class='border border-secondary my-3 pt-3'>
        <Button on:click={() => upAction()}>UP<Icon name='caret-up'/></Button>
        <Button on:click={() => downAction()}>DOWN<Icon name='caret-down'/></Button>
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