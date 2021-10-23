<script>
    import config from '../config.json';
    const API_URL = config.SVELTE_ENV === 'dev' ? config.API_URL_DEV : config.SVELTE_ENV === 'preprod' ? config.API_URL_PREPROD : config.SVELTE_ENV === 'production' ? config.API_URL_PROD : config.API_URL_DEV;

    // import { Container, Row, Col } from 'sveltestrap';
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


<!-- <Container fluid>
    <Row>
        <Col 
            xs={{size:size.xs, offset:(12-size.xs)/2}}
            sm={{size:size.sm, offset:(12-size.sm)/2}}
            md={{size:size.md, offset:(12-size.md)/2}}
            lg={{size:size.lg, offset:(12-size.lg)/2}}
            xl={{size:size.xl, offset:(12-size.xl)/2}}
        >
            <slot></slot>
        </Col>
    </Row>
</Container> -->