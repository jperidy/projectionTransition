<script>
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
                maps: {name: 'maps', values:[], styles:[]},
                latitude:'',
                longitude:''
            }]});
        }
        if (values.length === 1) {
            values.push({
                infoCovid: {values:[], styles: []},
                contact: {email: '', telephone:''}
            })
        }
    }

    const addLieuHandler = () => {
        values[0].values.push({ 
            name: {name:'ville', values:[], styles:[]},
            adresse: {name: 'adresse', values:[], styles:[]},
            telephone: {name: 'telephone', values:[], styles:[]},
            tarifs: {name: 'tarifs', values:[], styles:[]},
            maps: {name: 'maps', values:[], styles:[]},
            latitude:'',
            longitude:''
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

<div class='row'>   
    {#each values[0].values as lieu, position}
        <!-- block pour chaque ville -->
        <div class='col-sm-12 col-md-4 p-3'>
            <MovingContent
                array={values[0].values} 
                position={position} 
                admin={admin} 
                updateMovedArray={updateMovedArray}
            >
            <div class='p-3 bg-white rounded-3 lieu-content'>
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
                <!-- Informations pratiques sur la ville -->
                <div class='text-center' >
                    <div class='row align-items-center'>
                        {#if admin}
                            <div class='row'>
                                <div class='col'>
                                    <p >Latitude : </p>
                                    <input type='number' bind:value={lieu.latitude} step={0.00001} on:change={updateContent}/>
                                </div>
                                <div class='col'>
                                    <p >Longitude : </p>
                                    <input type='number' bind:value={lieu.longitude} step={0.00001} on:change={updateContent}/>
                                </div>
                            </div>
                        {/if}
                        <div class='col text-center px-3 '>
                            <MapComponent 
                                latitude={lieu.latitude}
                                longitude={lieu.longitude}
                                adresse={lieu.adresse.values[0].value}
                            />
                        </div>
                    </div>
                    <div class='informations'>
                        <div class='row align-items-center mt-1'>
                            <div class='col-2 text-end'>
                                <i class="bi bi-geo-alt"></i>
                            </div>
                            <div class='col-10 text-start'>
                                <TextComponent 
                                    bind:values={lieu.adresse.values}
                                    bind:styles={lieu.adresse.styles}
                                    edit={edit}
                                    admin={admin}
                                    updateContent={updateContent}
                                />
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
                    </div>
                </div>
            </div>
            </MovingContent>
        </div>
    {/each}
</div>  
<div class='row mt-5'>
    <div class='col bg-secondary text-center rounded-3 p-3'>
        <TextComponent 
            bind:values={values[1].infoCovid.values}
            bind:styles={values[1].infoCovid.styles}
            edit={edit}
            admin={admin}
            updateContent={updateContent}
        />
    </div>
</div>
{#if admin}
<div class="row">
    <div class="col">
        <p>Email de contact</p>
        <input type="mail" bind:value={values[1].contact.email} on:change={updateContent}/>
    </div>
    <div class="col">
        <p>Téléphone de contact</p>
        <input type="phone" bind:value={values[1].contact.telephone} on:change={updateContent}/>
    </div>
</div>
    
{/if}
<div class='row mt-5'>
    <div class="col text-center">
        <span>Nous contacter : </span>
        <a href ={`mailto: ${values[1].contact.email}`} class='py-3'><i class="bi bi-envelope-fill"></i><span class='py-2'>Email</span></a>
        <span class='py-3'>Téléphone: {values[1].contact.telephone}</span>
    </div>
</div>

<style>
    .lieu-content {
        -webkit-transform: scale(1);
	    transform: scale(1);
        transition: .5s ease;
    }
    .lieu-content:hover {
        -webkit-transform: scale(1.13);
	    transform: scale(1.13);
        transition: .5s ease;
    }
</style>