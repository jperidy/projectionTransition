<script>
    export let adresse = '';
    export let latitude = 0;
    export let longitude = 0;
    export let mapid = 'id';
    import { browser } from '$app/env'; 
    import { onMount } from 'svelte';
    //import L from 'leaflet';
    
    //console.log('mapid', mapid)

    //let map;
    
    const tileLayerUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';    
    
    onMount(async() => {
        if (browser) {
            const L = await import('leaflet');

            const myMap = L.map(mapid.toString()).setView([latitude, longitude], 13);

            L.tileLayer(tileLayerUrl, {
                attribution: attribution
            }).addTo(myMap);
            // Add a marker
            L.marker([latitude, longitude]).addTo(myMap)
                .bindPopup(`<b>${adresse.replaceAll(/[#|*|_]/g,'')}</b>`)
                .openPopup();
        }

    });


    // https://leafletjs.com/examples/quick-start/

</script>

<!-- Integrate map from openstreetmap -->
<link 
    rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
    integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
    crossorigin=""
/>

{#if browser}
    <div id={mapid.toString()} class='mapid'></div>
{/if}
<!-- <div class='mapid m-0 p-0 rounded-3' use:mapAction></div> -->
<!-- <div class='mapid m-0 p-0 rounded-3'></div> -->


<style>
    .mapid { 
        height: 230px; 
    }
</style>