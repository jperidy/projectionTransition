<script>

    import config from '../config.json';
    const API_URL = config.API_URL;

    export let values=[];
    export let styles=[];
    export let isSelected = {select: false, position:null};


    // Build the first component
    $:{
        if (values && values.length === 0) {
            values.push({caption: '',substitution: '',url: '',redirection:''});
        }
        if (!styles) styles = [];
        if (!values) values = [];
    }

    $:{
        if (!styles.length) {
            styles = [];
        }
    }
    
    // styles section
    $: shadow = styles.filter(x => x.name === 'shadow')[0] && styles.filter(x => x.name === 'shadow')[0].value;
    $: rounded = styles.filter(x => x.name === 'rounded')[0] && styles.filter(x => x.name === 'rounded')[0].value;
    $: textAlign = styles.filter(x => x.name === 'text-align')[0] && styles.filter(x => x.name === 'text-align')[0].value;
    $: transformR = styles.filter(x => x.name === 'transformR')[0] ? styles.filter(x => x.name === 'transformR')[0].value : 0;
    $: scaleXY = styles.filter(x => x.name === 'scaleXY')[0] ? styles.filter(x => x.name === 'scaleXY')[0].value : 1;
    $: width = styles.filter(x => x.name === 'width')[0] ? styles.filter(x => x.name === 'width')[0].value : 100;
    $: paddingL = styles.filter(x => x.name === 'paddingL')[0] && styles.filter(x => x.name === 'paddingL')[0].value || 0;
    $: paddingR = styles.filter(x => x.name === 'paddingR')[0] && styles.filter(x => x.name === 'paddingR')[0].value || 0;
    $: paddingT = styles.filter(x => x.name === 'paddingT')[0] && styles.filter(x => x.name === 'paddingT')[0].value || 0;
    $: paddingB = styles.filter(x => x.name === 'paddingB')[0] && styles.filter(x => x.name === 'paddingB')[0].value || 0;


</script>

<style>
    img {
        object-fit: cover;
        /* width: 100%;
        height: auto; */
    }
    figure {
        object-fit: cover;
        width: 100%;
        height: 100%;
    }
</style>

<div class='content-container'>
    <div class='row'>
        <div class={`col ${textAlign}`}>   
            {#if !values[0].url}
                <div class={`${isSelected.select && "border border-3 rounded"}`} style={`transform: rotate(${transformR}deg) scale(${scaleXY, scaleXY});padding-left: ${paddingL}rem;;padding-right: ${paddingR}rem;padding-top: ${paddingT}rem;;padding-bottom: ${paddingB}rem;`}>
                    <div class='bg-secondary text-center text-dark rounded-3 d-flex align-items-center justify-content-center' style="min-height:100px;">No image selected</div>
                </div>
            {:else}
                {#if values[0].redirection}
                    <a href={values[0].redirection} target={values[0].redirection.match(/^http/i) ? '_blank' : ''} >
                        <figure class={`figure ${isSelected.select && "border border-3 rounded"}`} style={`transform: rotate(${transformR}deg) scale(${scaleXY, scaleXY});padding-left: ${paddingL}rem;;padding-right: ${paddingR}rem;padding-top: ${paddingT}rem;;padding-bottom: ${paddingB}rem;`}>
                            <img 
                                src={`${API_URL}${values[0].url}`} 
                                alt={values[0].substitution}
                                class={`figure-img img-fluid m-0 p-0 ${rounded} ${shadow}`}
                                style={`width:${width}%;height:100%;`}
                                >
                            <figcaption class='figure-caption'>{values[0].caption}</figcaption>
                        </figure>
                    </a>
                {:else}
                    <figure class={`figure ${isSelected.select && "border border-3 rounded"}`} style={`transform: rotate(${transformR}deg) scale(${scaleXY, scaleXY});padding-left: ${paddingL}rem;;padding-right: ${paddingR}rem;padding-top: ${paddingT}rem;;padding-bottom: ${paddingB}rem;`}>
                        <img 
                            src={`${API_URL}${values[0].url}`} 
                            alt={values[0].substitution}
                            class={`figure-img img-fluid m-0 p-0 ${rounded} ${shadow}`}
                            style={`width:${width}%;height:100%;`}
                            >
                        <figcaption class='figure-caption'>{values[0].caption}</figcaption>
                    </figure>
                {/if}
            {/if}
        </div>
    </div>
</div>