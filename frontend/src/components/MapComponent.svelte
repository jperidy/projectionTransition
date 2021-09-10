<script>
    import L from 'leaflet';
    export let adresse = '';
    export let latitude = 0;
    export let longitude = 0;

    let map;

    const tileLayerUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';    
    

    // https://leafletjs.com/examples/quick-start/

    const createMap = (container) => {

        // const container = L.DomUtil.get(mapid);
        // if(container != null){
        //     container._leaflet_id = null;
        // }

        const myMap = L.map(container).setView([latitude, longitude], 13);
        
        L.tileLayer(tileLayerUrl, {
            attribution: attribution
        }).addTo(myMap);
        // Add a marker
        L.marker([latitude, longitude]).addTo(myMap)
            .bindPopup(`<b>${adresse}</b>`)
            .openPopup();

        return myMap;
    }

    const mapAction = (container) => {
        map = createMap(container);
        return {
            destroy: () => {
				 map.remove();
				 map = null;
			 }
        }
    }
    
    // onMount(() => {
    //     console.log('onMount')
    //     createMap();
    //     return {
    //         destroy: () => {
	// 			 myMap.remove();
	// 			 myMap = null;
	// 		 }
    //     }
    // });

</script>

<!-- Integrate map from openstreetmap -->
<link 
    rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
    integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
    crossorigin=""
/>

<!-- <div id={mapid} class='mapid'></div> -->
<div class='mapid' use:mapAction></div>


<style>
    .mapid { 
        height: 230px; 
    }
</style>