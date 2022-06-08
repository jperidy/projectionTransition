<script>
    import { deleteImage } from "../actions/imagesActions";
    import EditButton from "./EditButton.svelte";
    import ImageComponent from "./ImageComponent.svelte";
    
    export let values=[];
    export let styles=[];
    export let admin='false';
    export let edit='false';
    export let updateContent;
    
    styles
    
    $:{
        if (values.length === 0) {
            values.push({title: '', subTitle: '', component: {values: [], styles: []}});
        }
    }
    $:{
        if (values.length && !values[0].component) {
            values[0].component = {values: [], styles: []};
        }
    }
    
    const addAnItem = () => {
        values = [ ...values, {
            title: '',
            subTitle: '',
            component: {values: [], styles: []}
        }];
    };
    
    const removeAnItem = async (index) => {
        // delete Image in database
        const imageToDelete = values[index].component.values[0] && values[index].component.values[0].url;
        
        if (imageToDelete && imageToDelete.length) {
            await deleteImage(values[index].component.values[0].url);
        }
        
        values.splice(index,1);
        values = values;
    };
    
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
    .middle {
        transition: .5s ease;
        opacity: 0.5;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        -ms-transform: translate(-50%, -50%);
        text-align: center;
    }
    .content-container:hover .middle {
        opacity: 1;
    }
    
</style>


<div class='content-container'>
    
    <div class='row text-center my-5'>
        <div class='col'>
            <div class='content'>
                <div 
                id="carouselExampleIndicators"
                class="carousel slide"
                data-bs-ride="carousel"
                >
                <div class="carousel-indicators">
                    {#each values as item, index}
                    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to={index} class="active" aria-current="true" aria-label={`Slide ${index}`}></button>
                    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to={index} aria-label={`Slide ${index}`}></button>
                    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to={index} aria-label={`Slide ${index}`}></button>
                    {/each}
                </div>
                <div class="carousel-inner">
                    {#each values as item, index}
                    <div class={`carousel-item ${index === 1 && 'active'}`}>                        
                        {#if edit}
                        <div class='row mt-3'>
                            <div class="col"><input type='text' bind:value={item.title} placeholder='Titre'/></div>
                            <div class="col"><input type='text' bind:value={item.subTitle} placeholder='Sous-titre'/></div>
                        </div>
                        
                        <div class='row my-3'>
                            <div class="col"><button class='btn' block on:click={() => addAnItem()}>Add an item</button></div>
                            <div class="col"><button class='btn' block on:click={() => removeAnItem(index)}>Delete</button></div>
                        </div> 
                        <div class="row">
                            <div class="col">
                                <div>Image</div>
                                <ImageComponent
                                    bind:values={item.component.values}
                                    bind:styles={item.component.styles}
                                    admin={admin}
                                    edit={false}
                                    updateContent={null}
                                />
                            </div>
                        </div>
                        
                        {:else}
                        <ImageComponent
                        bind:values={item.component.values}
                        bind:styles={item.component.styles}
                        admin={false}
                        edit={false}
                        updateContent={null}
                        />
                        <div class="carousel-caption d-none d-md-block">
                            <h5>{item.title}</h5>
                            <p>{item.subTitle}</p>
                        </div>
                        {/if}
                        
                    </div>
                    {/each}
                </div>
                {#if !edit}
                <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Next</span>
                </button>
                {/if}
            </div>
        </div>
    </div>
</div>

{#if admin}
<div class='middle'>
    <EditButton
    admin={admin}
    updateContent={updateContent}
    bind:edit={edit}
    />
</div>
{/if}
</div>