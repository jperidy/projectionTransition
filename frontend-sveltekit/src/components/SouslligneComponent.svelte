<script>

    import { Icon, Modal, ModalBody, ModalFooter, ModalHeader } from "sveltestrap";
    import EditButton from "./EditButton.svelte";

    export let values=[];
    export let styles=[];
    export let admin=false;admin; // to remove
    export let edit=false;edit; // to remove
    export let updateContent; updateContent; // to remove
    export let isSelected = {select: false, position:null};

    
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
    $: marginLeft = styles.filter(x => x.name === 'marginLeft')[0] ? styles.filter(x => x.name === 'marginLeft')[0].value : 0;
    $: marginRight = styles.filter(x => x.name === 'marginRight')[0] ? styles.filter(x => x.name === 'marginRight')[0].value : 0;
    $: textAlign = styles.filter(x => x.name === 'text-align')[0] && styles.filter(x => x.name === 'text-align')[0].value;
    $: textColor = styles.filter(x => x.name === 'text-color')[0] && styles.filter(x => x.name === 'text-color')[0].value;

</script>

<div class={`content-container row ${isSelected.select && "border border-3 rounded"}`}>
    <div class="col">
        <div 
            class={`border-top border-5 ${textColor}`}
            style={`max-width: ${width}vh; margin-top:${marginTop}rem;margin-left:${marginLeft}rem;margin-right:${marginRight}rem;margin-bottom:${marginBottom}rem;${textAlign};`}
        >
        </div>
    </div>
</div>