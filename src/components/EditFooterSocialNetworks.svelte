<script>
    import Message from "./Message.svelte";
    import config from '../config.json';
    import { uploadFile } from "../actions/uploadActions";
    import Loading from "./Loading.svelte";
import { imagesFormats } from "../constants/files";
    
    const API_URL = config.API_URL;

    export let footer;

    // Manage Social Network
    let snName = '';
    let snIcon = '';
    let snAlt = '';
    let snRedirect = '';
    let newTarget = true;

    let messageUpdateFooter = "";
    let loadingImage = false;

    const arrayMove = (arr, fromIndex, toIndex) => {
        var element = arr[fromIndex];
        arr.splice(fromIndex, 1);
        arr.splice(toIndex, 0, element);
        return arr;
    };

    const addSocialNetwork = (e) => {
        e.preventDefault();
        footer.SOCIAL_NETWORKS = [ ...footer.SOCIAL_NETWORKS, {"name": snName, "icon": snIcon, "alt": snAlt, "redirect": snRedirect, "target": newTarget ? '_blank' : ''}];
        footer = footer;
        snName = "";
        snIcon = "";
        snAlt = "";
        snRedirect = "";
        newTarget = true;
    };
    const deleteSocialNetwork = (index) => {
        footer.SOCIAL_NETWORKS.splice(index, 1);
        footer = footer;
    };
    const upSocialNetwork = (index) => {
        if (index > 0) {
        footer.SOCIAL_NETWORKS = arrayMove(footer.SOCIAL_NETWORKS, index, index - 1);
        }
    };
    const downSocialNetwork = (index) => {
        if (index < footer.SOCIAL_NETWORKS.length - 1) {
        footer.SOCIAL_NETWORKS = arrayMove(footer.SOCIAL_NETWORKS, index, index + 1);
        }
    };
    const onSelectAnImageSocialNetwork = async(index, e) => {
        loadingImage = true;
        const file = e.target.files[0];
        const fileName = Date.now() + '_' + file.name;
        
        const { error } = await uploadFile(
            file, 
            fileName, 
            index === -1 ? '' : footer.SOCIAL_NETWORKS[index].icon, 
            imagesFormats
        );

        messageUpdateFooter = error;
        
        if (index === -1) { 
            snIcon = `/uploads/${fileName}`;
        } else { 
            footer.SOCIAL_NETWORKS[index].icon = `/uploads/${fileName}`;
            footer = footer;
        }
        
        loadingImage = false;
    };

</script>

<h3 class="border-bottom mb-3 pb-2">Social Networks thumbnail</h3>
{#if messageUpdateFooter}
    <Message color='danger'>{messageUpdateFooter}</Message>
{/if}
<div class="row">
    <div class="col">
        <form on:submit={addSocialNetwork}>
            <div class="row align-items-end py-2">
                <div class="col">
                    {#if snIcon}
                        {#if loadingImage}
                            <Loading />
                        {:else}
                            <img class='img-fluid bg-light rounded' src={API_URL + snIcon} alt={snAlt} style="width:7vh;height:7vh;" />
                        {/if}
                    {:else}
                        <div class="d-flex bg-light rounded justify-content-center text-center align-items-center text-dark" style="height: 7vh;width:7vh;">No image</div>
                    {/if}
                </div>
                <div class="col">
                    <label for="iconSN">Icon </label>
                    <input type="file" class="form-control" id="iconSN" on:change={(e) => onSelectAnImageSocialNetwork(-1, e)}/>
                </div>
                <div class="col">
                    <label for="nameSN">Name</label>
                    <input type="text" class="form-control" id="nameSN" bind:value={snName} placeholder="Ex. Facebook"/>
                </div>
                <div class="col">
                    <label for="altSN">Texte alternatif</label>
                    <input type="text" class="form-control" id="altSN" bind:value={snAlt} placeholder="Ex. Lien vers Facebook"/>
                </div>
                <div class="col">
                    <label for="redirectSN">Redirection vers </label>
                    <input type="text" class="form-control" id="redirectSN" bind:value={snRedirect} placeholder="Ex. https://facebook.com"/>
                </div>
                <div class="col">
                    <div class="form-check">
                        <label for="targetSN">Nouvel onglet </label>
                        <input type="checkbox" class="form-check-input" id="targetSN" bind:checked={newTarget} />
                    </div>
                </div>
                <div class="col-2">
                    <button type='submit' class="btn btn-primary">+</button>
                </div>
            </div>
        </form>
    
        <!-- {"name": "", "icon": "", "alt": "", "redirect": "", "target": ""}, -->
        {#each footer.SOCIAL_NETWORKS as item, ind}
            <div class='row border-top border-light'>
                <div class="col my-2">
                    {#if loadingImage}
                        <Loading />
                    {:else}
                        <img class='img-fluid bg-light rounded' src={API_URL + item.icon} alt={snAlt} style="width:7vh;height:7vh;"/>
                    {/if}
                </div>
                <div class="col my-auto">
                    <input type="file" class="form-control" on:change={(e) => onSelectAnImageSocialNetwork(ind, e)}>
                </div>
                <div class="col my-auto">
                    <input type="text" class="form-control" bind:value={item.name} >
                </div>
                <div class="col my-auto">
                    <input type="text" class="form-control" bind:value={item.alt} >
                </div>
                <div class="col my-auto">
                    <input type="text" class="form-control" bind:value={item.redirect} >
                </div>
                <div class="col my-auto">
                    <input type="text" class="form-control" bind:value={item.target} >
                </div>
                <div class="col-2 my-auto">
                    <button class="btn btn-danger btn-sm" on:click={() => deleteSocialNetwork(ind)}><i class="bi bi-trash"></i></button>
                    <button class="btn btn-secondary btn-sm" on:click={() => upSocialNetwork(ind)}><i class="bi bi-chevron-compact-up"></i></button>
                    <button class="btn btn-secondary btn-sm" on:click={() => downSocialNetwork(ind)}><i class="bi bi-chevron-compact-down"></i></button>
                </div>
            </div>
        {/each}
    </div>
</div>