<script>

    export let updateContent;
    export let admin = false;
    export let edit = false;

    const modifyEdit = () => {
        if (edit && updateContent) {
            updateContent();
        }
        edit = !edit;
    }

</script>

{#if admin}
    <div class='row text-end'>
        <div class='col'>
            <button 
                size='sm'
                color='ambre'
                on:click={() => modifyEdit()}
            ><i class={edit ? 'bi bi-arrow-counterclockwise' : 'bi bi-box-arrow-up-left'}/>
                {edit ? 'Save' : 'Edit'}
            </button>
        </div>
    </div>
{/if}