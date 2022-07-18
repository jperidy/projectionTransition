<script>
    import config from '../config.json';
    const API_URL = config.API_URL;
    
    let local = false;

    export let values=[];
    export let styles=[];
    export let isSelected = {select: false, position: null};
    
    $: textAlign = styles.filter(x => x.name === 'text-align')[0] && styles.filter(x => x.name === 'text-align')[0].value;
    $: size = styles.filter(x => x.name === 'maxWidth')[0] && styles.filter(x => x.name === 'maxWidth')[0].value || "small";

    $: {
        if (values.length === 0) {
            values.push({
                type: 'youtube',
                url: '',
            })
        }
        if (values.length === 1) {
            values.push({
                type: 'local',
                url: '',
            })
        }
    }

    $: {
        if (styles.length === 0) {
            styles.push({
                name: 'maxWidth', size: 'normal', value: '500px',
            });
        } 
    }

</script>

<style>
    .content-container{
        position: relative;
    }
    .content {
        transition: .5s ease;
        opacity: 1;
        width: 100%;
        height: 100%;
        backface-visibility: hidden;
    }
    .video-container {
        position: relative;
        padding-bottom: 56.25%; /* 16:9 */
        height: 0;
    }
    .video-container iframe {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
    .video-insert {
        min-width: 100%; 
        min-height: 100%;
        width: 100%; 
        height: 100%;
        background-size: cover;
        overflow: hidden;
    }
    
</style>

<div class={`content-container `}>
    <div class={`content ${isSelected.select && "border border-3 rounded"}`}>
    <div class='row my-3'>
        <div class='col text-center'>
            {#if values[0].url}
                <div class='video-dimension' style={`max-width:${styles.filter(x => x.name === 'maxWidth')[0].value};${textAlign};`}>
                    <div class={`video-container`}>
                        <iframe 
                            width="1280"
                            height="720"
                            src={values[0].url} 
                            title="YouTube video player" 
                            frameborder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowfullscreen
                        ></iframe>
                    </div>
                </div>
            {/if}
            {#if values[1].url}
                <!-- Afficher la version locale si la version youtube n'est pas disponible -->
                {#if !values[0].url}
                    <div class='video-local-dimension' style={`max-width:${styles.filter(x => x.name === 'maxWidth')[0].value};${textAlign};`}>
                        <video class='video-insert' controls >
                            <source src={API_URL + '/' + values[1].url} type="video/mp4">
                            <source src={API_URL + '/' + values[1].url} type="video/webm">
                            <source src={API_URL + '/' + values[1].url} type="video/ogg">
                            <track default kind="captions"/>
                            Sorry, your browser doesn't support embedded videos.
                        </video>
                    </div>
                {:else}
                    <!-- si la version youtube est disponible on peut regarder optionnellement la version locale -->
                    <button class='btn btn-sm btn-primary my-3' on:click={() => local = !local}>
                        {local ? 'Retour' : 'Voir la version locale'}
                    </button>
                    {#if local}
                        <div class='video-local-dimension' style={`max-width:${styles.filter(x => x.name === 'maxWidth')[0].value};${textAlign};`}>
                            <video class='video-insert' controls >
                                <source src={API_URL + '/' + values[1].url} type="video/mp4">
                                <source src={API_URL + '/' + values[1].url} type="video/webm">
                                <source src={API_URL + '/' + values[1].url} type="video/ogg">
                                <track default kind="captions"/>
                                Sorry, your browser doesn't support embedded videos.
                            </video>
                        </div>
                    {/if}
                {/if}
            {/if}
        </div>
    </div>
    </div>
</div>