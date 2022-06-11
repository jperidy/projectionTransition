<script>
    import config from '../config.json';
    const API_URL = config.API_URL;

    export let size = { xs: 12, sm:12, md:12, lg:10, xl:10 };
    export let backgroundColor = 'bg-transparent';
    export let backgroundHTML = null;
    export let backgroundImage = '';
</script>

<div class={`container-fluid p-0 m-0 ${!backgroundHTML && backgroundColor}`} style={`background-color: ${backgroundHTML}; background-image: url("${API_URL}${backgroundImage}"); background-repeat: no-repeat; background-size: 100%; background-position-x: center;`}>
    <div class="row">
        <div class={`col-${size.xs} offset-${Math.round((12-size.xs)/2)} col-sm-${size.sm} offset-sm-${Math.round((12-size.sm)/2)} col-md-${size.md} offset-md-${Math.round((12-size.md)/2)} col-lg-${size.lg} offset-lg-${Math.round((12-size.lg)/2)} col-xl-${size.xl} offset-xl-${Math.round((12-size.xl)/2)}`}>
            <slot></slot>
        </div>
    </div>
</div>