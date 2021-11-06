<script>
    import CustomContainer from "./CustomContainer.svelte";
    import DisplayCustomComponent from "./DisplayCustomComponent.svelte";

    export let values=[];
    export let styles=[];
    export let city='';
    export let isSelected = {select: false, position:null};


    $:{
        if (values.length === 0) {
            values.push({type:'layout', size: 4, sizeTablette: 4, sizeMobile: 12, values:[]});
        }
    };
    $:{
        if (!styles.length) {
            styles = [];
        }
    };

    $: xsSize = styles.filter(x => x.name === 'xsSize')[0] && styles.filter(x => x.name === 'xsSize')[0].value || 12;
    $: smSize = styles.filter(x => x.name === 'smSize')[0] && styles.filter(x => x.name === 'smSize')[0].value || 12;
    $: mdSize = styles.filter(x => x.name === 'mdSize')[0] && styles.filter(x => x.name === 'mdSize')[0].value || 12;
    $: lgSize = styles.filter(x => x.name === 'lgSize')[0] && styles.filter(x => x.name === 'lgSize')[0].value || 10;
    $: xlSize = styles.filter(x => x.name === 'xlSize')[0] && styles.filter(x => x.name === 'xlSize')[0].value || 8;
    
    $: alignContent = styles.filter(x => x.name === 'align-items')[0] && styles.filter(x => x.name === 'align-items')[0].value;
    $: bgColor = styles.filter(x => x.name === 'backgroud-color')[0] && styles.filter(x => x.name === 'backgroud-color')[0].value;
    $: backgroundHTML = styles.filter(x => x.name === 'backgroundHTML')[0] && styles.filter(x => x.name === 'backgroundHTML')[0].value || '';
    $: backgroundImage = styles.filter(x => x.name === 'backgroundImage')[0] && styles.filter(x => x.name === 'backgroundImage')[0].value || '';

    $: marginX = styles.filter(x => x.name === 'marginX')[0] && styles.filter(x => x.name === 'marginX')[0].value || 0;
    $: marginY = styles.filter(x => x.name === 'marginY')[0] && styles.filter(x => x.name === 'marginY')[0].value || 0;
    $: paddingX = styles.filter(x => x.name === 'paddingX')[0] && styles.filter(x => x.name === 'paddingX')[0].value || 1;
    $: paddingY = styles.filter(x => x.name === 'paddingY')[0] && styles.filter(x => x.name === 'paddingY')[0].value || 1;
    $: rounded = styles.filter(x => x.name === 'rounded')[0] && styles.filter(x => x.name === 'rounded')[0].value || 0;
    
    $: gutterX = styles.filter(x => x.name === 'gutterX')[0] && styles.filter(x => x.name === 'gutterX')[0].value || 2;
    $: gutterY = styles.filter(x => x.name === 'gutterY')[0] && styles.filter(x => x.name === 'gutterY')[0].value || 2;

    $: border = styles.filter(x => x.name === 'border')[0] && styles.filter(x => x.name === 'border')[0].value;
    $: borderColor = styles.filter(x => x.name === 'border-color')[0] && styles.filter(x => x.name === 'border-color')[0].value;

    const calculateCol = (size, position, arrayLength) => {
        if (size && size !=='auto') {
            if (position < arrayLength) {
                return size.toString();
            } else {
                return '4';
            }
        } else {
            return '4';
        }
    };

</script>

<CustomContainer 
    size={{ xs: xsSize, sm: smSize, md: mdSize, lg: lgSize, xl: xlSize}}
    backgroundColor={bgColor}
    backgroundHTML={backgroundHTML}
    backgroundImage={backgroundImage}
>
    <div class={`content-container ${isSelected.select && "border border-3 rounded"}`}>        
        <div class={`row content gx-${gutterX} gy-${gutterY} align-items-${alignContent} ${marginX} ${marginY} ${rounded} ${border} ${borderColor}`} style={`margin-left: ${marginX}rem;margin-right: ${marginX}rem;margin-bottom: ${marginY}rem;margin-top: ${marginY}rem;padding-left: ${paddingX}rem;padding-right: ${paddingX}rem;padding-top: ${paddingY}rem;padding-bottom: ${paddingY}rem;`}>
            {#each values as column, position}
                <div class={`item-column col-${calculateCol(column.sizeMobile, position, values.length)} col-md-${calculateCol(column.sizeTablette, position, values.length)} col-xl-${calculateCol(column.size, position, values.length)} `} style={`min-height: 5vh;`};>
                    {#each column.values as content, pos}
                        <DisplayCustomComponent 
                            bind:value={content.value}
                            bind:values={content.values}
                            bind:styles={content.styles}
                            type={content.type}
                            updateContent={null}
                            admin={false}
                            edit={false}
                            city={city}
                            isSelected={{select: isSelected.select && isSelected.position === position, position: null}}
                        />
                    {/each}                        
                </div>
            {/each}
        </div>
    </div>
</CustomContainer>