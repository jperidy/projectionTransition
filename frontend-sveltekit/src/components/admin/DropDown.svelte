<script>
    let open = false;
    export let title;
</script>
<div class='row ms-2 d-block'>
    <button 
        class="btn btn-transparent drop-down-button text-start my-0"
        on:click={() => open = !open}
    >
        {#if open}
            <i class="bi bi-chevron-up"></i>
        {:else}
            <i class="bi bi-chevron-down"></i>
        {/if}
        {title}
        {#if open}
            <slot></slot>
        {/if}
    </button>
</div>
<style>
    .drop-down-button {
        color: rgb(88, 88, 88);
    }
    .drop-down-button:hover {
        font-weight: bold;
    }
</style>