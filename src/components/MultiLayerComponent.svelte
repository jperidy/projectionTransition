<script>

    import DisplayCustomComponent from "./DisplayCustomComponent.svelte";

    export let values=[];
    export let styles=[];styles;
    export let isSelected = {select: false, position:null};

</script>

<div class={`layer ${isSelected.select && "border border-3 rounded"}`} style="position: relative;">
    {#each values as element, posElement}
        {#if element.type}
            {#if posElement}
                <div 
                    class={`element_N`}
                    style={`position:absolute;top:${element.top || '0'}%;left:${element.left || '0'}%;max-width:${100-element.left}%;max-height:${100-element.top}%;width:${element.width ? element.width + '%' : null};`}
                >            
                    <!-- <div class={`${admin && "border"}`}> -->
                        <DisplayCustomComponent
                            bind:value={element.value}
                            bind:values={element.values}
                            bind:styles={element.styles}
                            type={element.type}
                            updateContent={null}
                            admin={false}
                            edit={false}
                            isSelected={{select: isSelected.select && isSelected.position === posElement, position: null}}
                        />
                    <!-- </div> -->
                </div>
            {:else}
                <div 
                    class="element_0" 
                    style={`position:relative;`}
                >            
                    <DisplayCustomComponent
                        bind:value={element.value}
                        bind:values={element.values}
                        bind:styles={element.styles}
                        type={element.type}
                        updateContent={null}
                        admin={false}
                        edit={false}
                    />
                </div>
            {/if}    
        {/if}
    {/each}
</div>        
