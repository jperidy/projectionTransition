<script>
    import { goto } from "$app/navigation";
    import config from '../config.json';
</script>

<div class={`row ${config.FOOTER.STYLE.FOOTER.bootstrapClass}`}>

    {#if config.FOOTER.TYPE.navigation}
        <div class={`row ${config.FOOTER.STYLE.NAVIGATION.bootstrapClass}`} style={config.FOOTER.STYLE.NAVIGATION.style}>
            <div class='col-3 text-start'>
                <a href="#up">
                    <img 
                        class='img-fluid mx-2'
                        src={config.FOOTER.BRAND.LOGO.path}
                        alt={config.FOOTER.BRAND.LOGO.alt}
                        style={config.FOOTER.BRAND.LOGO.style}
                    />
                </a>
            </div>
            <div class='col-6 text-center'>
                <div class='row align-items-center'>
                    <div class='col text-center'>
                        {#each config.FOOTER.TITLE as item, position}
                            <span class={config.FOOTER.STYLE.TITLE.bootstrapClass} style={config.FOOTER.STYLE.TITLE.style} on:click={() => goto(item.url)}>{item.name}</span>
                            {#if position < (config.FOOTER.TITLE.length - 1)}
                                <span class='fw-bold' style={config.FOOTER.STYLE.TITLE.style}>|</span>
                            {/if} 
                        {/each}
                    </div>
                </div>
            </div>
            <div class='col-3 text-center'>
                <div class='row my-1'>
                    <div class="col text-center" style='font-size:1.4rem'>
                        {#each config.FOOTER.SOCIAL_NETWORKS as item}
                            <span class='fw-bold'><a class="" target={item.target} href={item.redirect}><img class={config.FOOTER.STYLE.SOCIAL_NETWORKS.bootstrapClass} style={config.FOOTER.STYLE.SOCIAL_NETWORKS.style} src={item.icon} alt={item.alt} /></a></span>
                        {/each}
                    </div>
                </div>
            </div>
        </div>
    {/if}
    {#if config.FOOTER.TYPE.copyright}
        <div class={`row ${config.FOOTER.STYLE.COPYRIGHT.bootstrapClass}`} style={config.FOOTER.STYLE.COPYRIGHT.style}>
            <div class='col text-center'>
                <span class={config.FOOTER.COPYRIGHT.bootstrapClass} style={config.FOOTER.COPYRIGHT.style}>{config.FOOTER.COPYRIGHT.value}</span>
            </div>
        </div>
    {/if}
</div>