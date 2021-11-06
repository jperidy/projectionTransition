<script>

    import SvelteMarkdown from "svelte-markdown";

    import ParagrapheMarkdown from "./markdown/ParagrapheMarkdown.svelte";
    import TableMarkdown from "./markdown/TableMarkdown.svelte";
    import TdMarkdown from "./markdown/TdMarkdown.svelte";
    import TextBgFillPrimaryMarkdown from "./markdown/TextBgFillPrimaryMarkdown.svelte";
    import TextMarkdown from "./markdown/TextMarkdown.svelte";

    export let values=[];
    export let styles=[];
    export let isSelected = {select: false, position: null};
    

    $: textAlign = styles.filter(x => x.name === 'text-align')[0] && styles.filter(x => x.name === 'text-align')[0].value;
    $: textColor = styles.filter(x => x.name === 'text-color')[0] && styles.filter(x => x.name === 'text-color')[0].value;
    $: bgColor = styles.filter(x => x.name === 'backgroud-color')[0] && styles.filter(x => x.name === 'backgroud-color')[0].value;
    $: bgPrimaryText = styles.filter(x => x.name === 'bgPrimaryText')[0] && styles.filter(x => x.name === 'bgPrimaryText')[0].value;
    $: fontWeight = styles.filter(x => x.name === 'font-weight')[0] && styles.filter(x => x.name === 'font-weight')[0].value;
    $: fontStyle = styles.filter(x => x.name === 'font-style')[0] && styles.filter(x => x.name === 'font-style')[0].value;
    $: fontFamily = styles.filter(x => x.name === 'fontFamily')[0] && styles.filter(x => x.name === 'fontFamily')[0].value || "";
    $: fontSize = styles.filter(x => x.name === 'fontSize')[0] && styles.filter(x => x.name === 'fontSize')[0].value || "";
    $: marginL = styles.filter(x => x.name === 'marginL')[0] && styles.filter(x => x.name === 'marginL')[0].value || 0;
    $: marginR = styles.filter(x => x.name === 'marginR')[0] && styles.filter(x => x.name === 'marginR')[0].value || 0;
    $: marginT = styles.filter(x => x.name === 'marginT')[0] && styles.filter(x => x.name === 'marginT')[0].value || 0;
    $: marginB = styles.filter(x => x.name === 'marginB')[0] && styles.filter(x => x.name === 'marginB')[0].value || 0;
    $: paddingL = styles.filter(x => x.name === 'paddingL')[0] && styles.filter(x => x.name === 'paddingL')[0].value || 0;
    $: paddingR = styles.filter(x => x.name === 'paddingR')[0] && styles.filter(x => x.name === 'paddingR')[0].value || 0;
    $: paddingT = styles.filter(x => x.name === 'paddingT')[0] && styles.filter(x => x.name === 'paddingT')[0].value || 0;
    $: paddingB = styles.filter(x => x.name === 'paddingB')[0] && styles.filter(x => x.name === 'paddingB')[0].value || 0;
    $: rounded = styles.filter(x => x.name === 'rounded')[0] && styles.filter(x => x.name === 'rounded')[0].value;
    $: transformR = styles.filter(x => x.name === 'transformR')[0] ? styles.filter(x => x.name === 'transformR')[0].value : 0;


    $:{
        if (values.length === 0) {
            values.push({type:'text', value:'#Edit your text here'});
        }
    }
    $:{
        if (!styles.length) {
            styles = [];
        }
    }

</script>


<div class='content-container'>
    <div class={`content ${isSelected.select && "border border-3 rounded"}`} >
        <div class={`${textColor} ${bgColor} ${rounded}`} style={`text-align: ${textAlign}; font-family: ${fontFamily};${fontSize > 0 ? "font-size: " + fontSize + "rem"  : ""};font-weight: ${fontWeight};font-style: ${fontStyle};transform: rotate(${transformR}deg);margin-left: ${marginL}rem;margin-right: ${marginR}rem;margin-top: ${marginT}rem;margin-bottom: ${marginB}rem;padding-left: ${paddingL}rem;padding-right: ${paddingR}rem;padding-top: ${paddingT}rem;padding-bottom: ${paddingB}rem;`}>
            <SvelteMarkdown source={values[0] && values[0].value ? values[0].value : ''} renderers={{
                paragraph: ParagrapheMarkdown, 
                table: TableMarkdown, 
                tablecell: TdMarkdown,
                text: bgPrimaryText ? TextBgFillPrimaryMarkdown : TextMarkdown,
                }} />
        </div>
    </div>
</div>