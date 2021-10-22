<script>
    // import { Container, Row, Col } from 'sveltestrap';
    export let size = { xs: 12, sm:12, md:12, lg:10, xl:10 };
    export let backgroundColor = 'bg-transparent';
    export let backgroundHTML = null;
</script>

<div class={`container-fluid ${!backgroundHTML && backgroundColor}`} style={`background-color: ${backgroundHTML}`}>
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