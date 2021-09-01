<script>
    
    import AdminButton from '../components/AdminButton.svelte';
    import ImageComponent from '../components/ImageComponent.svelte';
    import TextComponent from '../components/TextComponent.svelte';

    import { userInfo } from '../store';

    export let params = { category: 'actualite', id: null};
    $: category = params.category;
    $: id = params.id;
    $: isAuthenticate = $userInfo && $userInfo.profil === 'admin' ? true : false;
    
    let admin = false;
    let edit = false;
    let updateContent;

    const articleContent = {
        _id: id,
        title: {values:[], styles:[]},
        subTitle: {values:[], styles:[]},
        src: {values:[], styles:[]},
        content: {values:[], styles:[]},
    }

    $: {
        console.log('create function to get the document', category, id);
        
        
    }

    const updateArticle = async() => {
        console.log('create here function to create or update the article');
    }

</script>

{#if isAuthenticate}
    <AdminButton
        bind:admin={admin}
        isAuthenticate={isAuthenticate}
    />
{/if}

<div class='row'>

    <div class='col-md-3 col-sm-12'>
        <ImageComponent
            bind:values={articleContent.src.values}
            bind:styles={articleContent.src.styles}
            admin={admin}
            edit={edit}
            updateContent={updateContent}
        />
    </div>

    <div class='col-md-9 col-sm-12'>
        <TextComponent
            bind:values={articleContent.title.values}
            bind:styles={articleContent.title.styles}
            admin={admin}
            edit={edit}
            updateContent={updateContent}
        />
    </div>

</div>

<div class='row'>
    <div class='col'>
        <TextComponent 
            bind:values={articleContent.subTitle.values}
            bind:styles={articleContent.subTitle.styles}
            admin={admin}
            edit={edit}
            updateContent={updateContent}
        />
    </div>
</div>

<div class='row'>
    <div class='col'>
        <TextComponent 
            bind:values={articleContent.content.values}
            bind:styles={articleContent.content.styles}
            admin={admin}
            edit={edit}
            updateContent={updateContent}
        />
    </div>
</div>