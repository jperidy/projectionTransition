<script>
    import { goto } from "$app/navigation";
    import config from '../config.json';
    
    export let footer;
    
</script>

<!-- display the footer -->
<div class={`row ${footer.STYLE.FOOTER.bootstrapClass}`}>

    {#if footer.TYPE.navigation}
        <div class={`row ${footer.STYLE.NAVIGATION.bootstrapClass}`} style={footer.STYLE.NAVIGATION.style}>
            <div class='col-3 text-start'>
                <a href="#up">
                    <img 
                        class='img-fluid mx-2'
                        src={footer.BRAND.LOGO.path}
                        alt={footer.BRAND.LOGO.alt}
                        style={footer.BRAND.LOGO.style}
                    />
                </a>
            </div>
            <div class='col-6 text-center'>
                <div class='row align-items-center'>
                    <div class='col text-center'>
                        {#each footer.TITLE as item, position}
                            <span class={footer.STYLE.TITLE.bootstrapClass} style={footer.STYLE.TITLE.style} on:click={() => goto(item.url)}>{item.name}</span>
                            {#if position < (footer.TITLE.length - 1)}
                                <span class='fw-bold' style={footer.STYLE.TITLE.style}>|</span>
                            {/if} 
                        {/each}
                    </div>
                </div>
            </div>
            <div class='col-3 text-center'>
                <div class='row my-1'>
                    <div class="col text-center" style='font-size:1.4rem'>
                        {#each footer.SOCIAL_NETWORKS as item}
                            <span class='fw-bold'>
                                <a class="" target={item.target} href={item.redirect}>
                                    <img 
                                        class={footer.STYLE.SOCIAL_NETWORKS.bootstrapClass} 
                                        style={footer.STYLE.SOCIAL_NETWORKS.style} src={item.icon} 
                                        alt={item.alt} 
                                    />
                                </a>
                            </span>
                        {/each}
                    </div>
                </div>
            </div>
        </div>
    {/if}
    {#if footer.TYPE.copyright}
        <div class={`row ${footer.STYLE.COPYRIGHT.bootstrapClass}`} style={footer.STYLE.COPYRIGHT.style}>
            <div class='col text-center'>
                <span class={footer.COPYRIGHT.bootstrapClass} style={footer.COPYRIGHT.style}>{footer.COPYRIGHT.value}</span>
            </div>
        </div>
    {/if}
</div>