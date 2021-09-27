<script>
import EditButton from "./EditButton.svelte";


    export let values=[];
    export let styles=[];
    export let admin='false';
    export let edit='false';
    export let updateContent;
    
    $:{
        if (values.length === 0) {
            values.push({type:'sousligne', value:'sousigne'});
        }
    }
    $:{
        if (!styles.length) {
            styles = [];
        }
    }

    $: width = styles.filter(x => x.name === 'width')[0] ? styles.filter(x => x.name === 'width')[0].value : 10;
    $: marginTop = styles.filter(x => x.name === 'marginTop')[0] ? styles.filter(x => x.name === 'marginTop')[0].value : 0;
    $: marginBottom = styles.filter(x => x.name === 'marginBottom')[0] ? styles.filter(x => x.name === 'marginBottom')[0].value : 0;

    const updateStyle = ({name, value}) => {
        const curentStyleItem = styles.filter(x => x.name === name);
        if (curentStyleItem.length) {
            for (let index = 0; index < styles.length; index++) {
                if (styles[index].name === name) {
                    styles[index].value = value;
                }
            }
        } else {
            styles = [...styles, {name, value}];
        }
        styles = styles;
    };

</script>

<div class="content-container row">
    <div class='col'>
        <div 
            class='border-top border-5 border-primary'
            style={`max-width: ${width}vh; margin-top:${marginTop}px;margin-bottom:${marginBottom}px;`}
        >
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
    </div>
    {#if edit}
        <div class='col-2 parametres'>
            <label for="inputWidth">Largeur en % de la largeur totale</label>
            <input id ="inputWidth" type='number' class='form-control' value={width} on:change={(e) => updateStyle({name:'width', value:e.target.value})} />
            <label for="marginTop">Marge au dessus en pixels</label>
            <input id ="marginTop" type='number' class='form-control' value={marginTop} min={0} on:change={(e) => updateStyle({name:'marginTop', value:e.target.value})} />
            <label for="marginBottom">Marge au dessous en pixels</label>
            <input id ="marginBottom" type='number' class='form-control' value={marginBottom} min={0} on:change={(e) => updateStyle({name:'marginBottom', value:e.target.value})} />
        </div>
    {/if}
</div>



<style>
    .parametres {
        -webkit-transform: scale(0);
        transform: scale(0);
        transition: .5s ease;
        width: 0vh;
    }
    .content-container{
        position: relative;
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
    .content-container:hover .parametres {
        -webkit-transform: scale(1);
        transform: scale(1);
        transition: .5s ease;
        width: 20vh;
    }

</style>