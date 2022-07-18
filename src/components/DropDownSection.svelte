<script>

export let sectionTitle = 'section';
export let visible = false;
export let type = 'p';

</script>

<div class="d-grid gap-2">
    <button on:click={() => visible = !visible} class='btn btn-transparent text-start text-dark border-bottom'>
        <div class={type}>
            {#if visible}
                <i class="bi bi-chevron-up"></i>
            {:else}
                <i class="bi bi-chevron-down"></i>
            {/if}
            {sectionTitle}
        </div>        
    </button>
</div>
{#if visible}
<slot></slot>
{/if}