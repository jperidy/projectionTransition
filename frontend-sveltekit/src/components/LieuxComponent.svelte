<script>
    import DropDownSection from "./DropDownSection.svelte";

    import MapComponent from "./MapComponent.svelte";
    import MovingContent from "./MovingContent.svelte";

    import TextComponent from "./TextComponent.svelte";
    export let values=[];
    export let styles=[];
    export let admin='false';
    export let edit='false';
    export let updateContent;

    styles;

    $: {
        if (values.length === 0) {
            values.push({name:'Info pratiques', values:[{ 
                name: {name:'ville', values:[], styles:[]},
                adresse: {name: 'adresse', values:[], styles:[]},
                telephone: {name: 'telephone', values:[], styles:[]},
                tarifs: {name: 'tarifs', values:[], styles:[]},
                access: {name: 'access', values:[], styles:[]},
                internet: '',
                maps: {name: 'maps', values:[], styles:[]},
                latitude:'',
                longitude:'',
                gmapsLink: '',
            }]});
        }
    }

    const addLieuHandler = () => {
        values[0].values.push({ 
            name: {name:'ville', values:[], styles:[]},
            adresse: {name: 'adresse', values:[], styles:[]},
            telephone: {name: 'telephone', values:[], styles:[]},
            tarifs: {name: 'tarifs', values:[], styles:[]},
            access: {name: 'access', values:[], styles:[]},
            internet: '',
            maps: {name: 'maps', values:[], styles:[]},
            latitude:'',
            longitude:'',
            gmapsLink: ''
        });
        values = values;
    };

    const updateMovedArray = async(array) => {
        values[0].values = array;
        values = values;
        updateContent();
    };

</script>

<!-- on admin mode -->
{#if admin}
    <div class='row my-5'>
        <div class='col text-center'>
            <button class='btn btn-primary' on:click={addLieuHandler}>Add a Location</button>
        </div>
    </div>
{/if}

<div class='row mt-3 mb-5 gx-5 gy-3'>   
    {#each values[0].values as lieu, position}
        <!-- block pour chaque ville -->
        <div class='col-sm-12 col-md-6'>
            <MovingContent
                array={values[0].values} 
                position={position} 
                admin={admin} 
                updateMovedArray={updateMovedArray}
            >
            <div class='p-3 bg-white rounded-3 lieu-content'>
                <div class='row'>
                    <!-- nom du groupe de la ville -->
                    <div class='text-center my-1'>
                        <TextComponent 
                            bind:values={lieu.name.values}
                            bind:styles={lieu.name.styles}
                            edit={edit}
                            admin={admin}
                            updateContent={updateContent}
                        />
                    </div>
                </div>
            
                <div class='row align-items-center'>
                    {#if admin}
                        <div class='row'>
                            <div class='col'>
                                <span>Lien Google Maps :</span>
                                <input class='form-control' type='text' bind:value={lieu.gmapsLink} on:change={updateContent}/>
                            </div>
                        </div>
                        <div class='row'>
                            <div class='col'>
                                <span>Latitude : </span>
                                <input class='form-control' type='number' bind:value={lieu.latitude} step={0.00001} on:change={updateContent}/>
                            </div>
                        </div>
                        <div class='row'>
                            <div class='col'>
                                <span>Longitude : </span>
                                <input class='form-control' type='number' bind:value={lieu.longitude} step={0.00001} on:change={updateContent}/>
                            </div>
                        </div>
                    {/if}
                            
                    <div class='row align-items-center'>
                        <div class='col text-center my-3'>
                            <MapComponent 
                                latitude={lieu.latitude}
                                longitude={lieu.longitude}
                                adresse={lieu.adresse.values[0] ? lieu.adresse.values[0].value : 'Unknown'}
                                mapid={position}
                            />
                        </div>
                    </div>


                    <div class='row align-items-center mt-1'>
                        <div class='col-2 text-end'>
                            <i class="bi bi-geo-alt"></i>
                        </div>
                        <div class='col-10 text-start'>
                            <a href={lieu.gmapsLink ? lieu.gmapsLink : (lieu.gmapsLink = '')} target="_blank">
                                <TextComponent 
                                    bind:values={lieu.adresse.values}
                                    bind:styles={lieu.adresse.styles}
                                    edit={edit}
                                    admin={admin}
                                    updateContent={updateContent}
                                />
                            </a>
                        </div>
                    </div>
                    <div class='row align-items-center mt-1'>
                        <div class='col-2 text-end'>
                            <i class="bi bi-telephone"></i>
                        </div>
                        <div class='col-10 text-start'>
                            <TextComponent 
                                bind:values={lieu.telephone.values}
                                bind:styles={lieu.telephone.styles}
                                edit={edit}
                                admin={admin}
                                updateContent={updateContent}
                            />
                        </div>
                    </div>
                    <div class='row align-items-center mt-1'>
                        <div class='col-2 text-end'>
                            <i class="bi bi-globe"></i>
                        </div>
                        {#if admin}
                            <div class='row'>
                                <div class='col'>
                                    <span>Site web du cinéma :</span>
                                    <input class='form-control' type='text' bind:value={lieu.internet} on:change={updateContent}/>
                                </div>
                            </div>
                        {:else}
                            <div class='col-10 text-start'>
                                <a href={lieu.internet ? lieu.internet : (lieu.internet = '')} target="_blank">Accéder directement au site web du cinéma</a>
                            </div>
                        {/if}
                    </div>                    
                </div>
                
                <div class='mt-3'>
                    <!-- Informations pratiques sur l'itinéraire -->
                    <DropDownSection
                        sectionTitle="Accés au site"
                        visible={false}
                        type="h4"
                    >
                        <div class='row align-items-center'>
                            <div class='col-12 text-center'>
                                <TextComponent 
                                    bind:values={lieu.access.values}
                                    bind:styles={lieu.access.styles}
                                    edit={edit}
                                    admin={admin}
                                    updateContent={updateContent}
                                />
                            </div>
                        </div>
                    </DropDownSection>
                    
                    <!-- Informations pratiques sur le prix -->
                    <DropDownSection
                        sectionTitle="Tarifs"
                        visible={false}
                        type="h4"
                    >
                        <div class='row align-items-center mt-2'>
                            <div class='col-12 text-center'>
                                <TextComponent 
                                    bind:values={lieu.tarifs.values}
                                    bind:styles={lieu.tarifs.styles}
                                    edit={edit}
                                    admin={admin}
                                    updateContent={updateContent}
                                />
                            </div>
                        </div>
                    </DropDownSection>
                </div>
                    
            </div>
            </MovingContent>
        </div>
    {/each}
</div>  