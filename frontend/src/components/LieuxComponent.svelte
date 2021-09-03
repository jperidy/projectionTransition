<script>
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
            }]});
        }
    }

    const addLieuHandler = () => {
        values[0].values.push({ 
            name: {name:'ville', values:[], styles:[]},
            adresse: {name: 'adresse', values:[], styles:[]},
            telephone: {name: 'telephone', values:[], styles:[]},
            tarifs: {name: 'tarifs', values:[], styles:[]},
            maps: {name: 'maps', values:[], styles:[]},
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
        <div class='col-sm-12 col-md-4'>
            <MovingContent
                array={values[0].values} 
                position={position} 
                admin={admin} 
                updateMovedArray={updateMovedArray}
            >
            <!-- nom du groupe de la ville -->
            <div class='text-center mt-5 py-3' style="border-bottom:1px dotted white">
                <TextComponent 
                    bind:values={lieu.name.values}
                    bind:styles={lieu.name.styles}
                    edit={edit}
                    admin={admin}
                    updateContent={updateContent}
                />
            </div>
            <!-- Informations pratiques sur la ville -->
            <div class='text-center bg-none mt-3'>
                <div class='row align-items-center my-2'>
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
                <div class='row align-items-center my-2'>
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
                <div class='row align-items-center my-2'>
                    <div class='col-2 text-end'>
                        <i class="bi bi-currency-euro"></i>
                    </div>
                    <div class='col-10 text-start'>
                        <TextComponent 
                            bind:values={lieu.tarifs.values}
                            bind:styles={lieu.tarifs.styles}
                            edit={edit}
                            admin={admin}
                            updateContent={updateContent}
                        />
                    </div>
                </div>
                <div class='row align-items-center my-2'>
                    <div class='col-2 text-end'>
                        <i class="bi bi-map"></i>
                    </div>
                    <div class='col-10 text-start'>
                        Map to integrate    
                    </div>
                </div>
            </div>
            </MovingContent>
        </div>
    {/each}
</div>