<script context='module'>
  export const prerender = true;
</script>

<script>
  import { goto } from '$app/navigation';
  import { userInfo } from '../store';
  import { getNavBar, updateOrCreateNavBar } from '../actions/navActions';
  import { getSeo, updateOrCreateSeo } from '../actions/seoActions';
  import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    Dropdown,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter
    } from 'sveltestrap';
    import { onMount } from 'svelte';
    import { uploadImage } from '../actions/imagesActions';
    import Message from './Message.svelte';
    import config from '../config.json';
    const API_URL = config.SVELTE_ENV === 'dev' ? config.API_URL_DEV : config.SVELTE_ENV === 'preprod' ? config.API_URL_PREPROD : config.SVELTE_ENV === 'production' ? config.API_URL_PROD : config.API_URL_DEV;

  
    let edit=false;
    let messageUploadImage = '';
    let messageUpdateNav = '';
    let messageUpdateSeo = '';
    let messageUpdateFavicon = '';

    $: isAuthenticate = $userInfo && $userInfo.profil === 'admin' ? true : false;
    
    let isOpen = false;

    const navigateHandler = (url) => {
        isOpen = false;
        goto(url);
    };

    // Add to edit the nav bar
    const toggle = async() => {
        if (edit) {
            updateOrCreateNavBar(navBar)
              .then((result) => navBar = result.navBar)
              .catch((error) => messageUpdateNav = error);
            updateOrCreateSeo(seo)
              .then((result) => seo = result.seo)
              .catch((error) => messageUpdateSeo = error);
        }
        edit = !edit;
    };

    // DEFAULT nav bar
    let navBar = {
      name:"nav",
      "TITLE": [
          {"name": "MENU 1", "url": "", "SUBTITLE": []},
      ],
      "BRAND": {
          "LOGO": {
              "path": "", 
              "alt": "", 
              "style": "max-width: 20vh; height:auto;"
          },
          "NAME": ""
      },
      "SOCIAL_NETWORKS": [
          {"name": "", "icon": "", "alt": "", "redirect": "", "target": "_blank"},
      ],
      "STYLE": {
          "expand": "xl",
          "color": "white",
          "theme": "light",
          "TITLE": { "bootstrapClass": "text-dark mx-2", "style": "font-family: omotenashi_2regular;font-size: 1.3rem;" },
          "SOCIAL_NETWORKS": { "bootstrapClass": "", "style": "max-width: 6vh;height: auto;"}
      }
  };
  //$: console.log('brand alt', navBar.BRAND.LOGO.alt);

  // Default SEO
  let seo = {
    "name": "seo",
    "DEFAULT_TITLE": "",
    "DEFAULT_DESCRIPTION": "",
    "DEFAULT_OG_TITLE": "",
    "DEFAULT_OG_DESCRIPTION": "",
    "DEFAULT_OG_IMAGE": "",
    "FAVICON_48_48": "",
    "FAVICON_64_64": "",
    "FAVICON_96_96": "",
    "FAVICON_128_128": "",
    "FAVICON_196_196": ""
  }

  onMount(async () => {
    // load navBar
    let navRequest = await getNavBar();
    if (navRequest && navRequest.navBar) {
      for (let key in navRequest.navBar) {
        navBar[key] = navRequest.navBar[key];
      }
    }
    navBar = navBar;

    // load seo
    let seoRequest = await getSeo();
    if (seoRequest && seoRequest.seo) {
      for (let key in seoRequest.seo) {
        seo[key] = seoRequest.seo[key];
      }
    }
    seo = seo;
  });

  const expand = navBar.STYLE.expand;

  // Manage Brand
  const onSelectAnImageBrand = async(e) => {
    const data = new FormData();
    data.append('file', e.target.files[0]);
    const result = await uploadImage(data, navBar.BRAND.LOGO.path);
    if (result.status === 'Ok') {
        navBar.BRAND.LOGO.path = result.data;
        navBar = navBar;
        messageUploadImage = '';
        updateOrCreateNavBar(navBar)
          .then((result) => navBar = result.navBar)
          .catch((error) => messageUpdateNav = error);
    } else {
        messageUploadImage = result.data;
    }
  };
  

  // Manage navigation
  const arrayMove = (arr, fromIndex, toIndex) => {
      var element = arr[fromIndex];
      arr.splice(fromIndex, 1);
      arr.splice(toIndex, 0, element);
      return arr;
  };

  let navName = '';
  let navUrl = '';
  const addNavigation = (e) => {
    e.preventDefault();
    navBar.TITLE = [ ...navBar.TITLE, {"name": navName, "url": navUrl, "SUBTITLE": []}];
    navBar = navBar;
    navName = '';
    navUrl = '';
    updateOrCreateNavBar(navBar)
      .then((result) => navBar = result.navBar)
      .catch((error) => messageUpdateNav = error);
  };
  const deleteNavigation = (index) => {
    navBar.TITLE.splice(index, 1);
    navBar = navBar;
    updateOrCreateNavBar(navBar)
      .then((result) => navBar = result.navBar)
      .catch((error) => messageUpdateNav = error);
  };
  const upNavigation = (index) => {
    if (index > 0) {
      navBar.TITLE = arrayMove(navBar.TITLE, index, index - 1);
      updateOrCreateNavBar(navBar)
        .then((result) => navBar = result.navBar)
        .catch((error) => messageUpdateNav = error);
    }
  };
  const downNavigation = (index) => {
    if (index < navBar.TITLE.length - 1) {
      navBar.TITLE = arrayMove(navBar.TITLE, index, index + 1);
      updateOrCreateNavBar(navBar)
        .then((result) => navBar = result.navBar)
        .catch((error) => messageUpdateNav = error);
    }
  };

  // Manage Social Network
  let snName = '';
  let snIcon = '';
  let snAlt = '';
  let snRedirect = '';
  let newTarget = true;

  const addSocialNetwork = (e) => {
    e.preventDefault();
    navBar.SOCIAL_NETWORKS = [ ...navBar.SOCIAL_NETWORKS, {"name": snName, "icon": snIcon, "alt": snAlt, "redirect": snRedirect, "target": newTarget ? '_blank' : ''}];
    navBar = navBar;
    snName = "";
    snIcon = "";
    snAlt = "";
    snRedirect = "";
    newTarget = true;
    updateOrCreateNavBar(navBar)
      .then((result) => navBar = result.navBar)
      .catch((error) => messageUpdateNav = error);
  };
  const deleteSocialNetwork = (index) => {
    navBar.SOCIAL_NETWORKS.splice(index, 1);
    navBar = navBar;
    updateOrCreateNavBar(navBar)
      .then((result) => navBar = result.navBar)
      .catch((error) => messageUpdateNav = error);
  };
  const upSocialNetwork = (index) => {
    if (index > 0) {
      navBar.SOCIAL_NETWORKS = arrayMove(navBar.SOCIAL_NETWORKS, index, index - 1);
    }
  };
  const downSocialNetwork = (index) => {
    if (index < navBar.SOCIAL_NETWORKS.length - 1) {
      navBar.SOCIAL_NETWORKS = arrayMove(navBar.SOCIAL_NETWORKS, index, index + 1);
    }
  };
  const onSelectAnImageSocialNetwork = async(index, e) => {
    const data = new FormData();
    data.append('file', e.target.files[0]);
    const result = await uploadImage(data, index === -1 ? '' : navBar.SOCIAL_NETWORKS[index].icon);
    if (result.status === 'Ok') {
      if (index === -1) { // create
        snIcon = result.data;
      } else { // update
        navBar.SOCIAL_NETWORKS[index].icon = result.data;
        navBar = navBar;
        updateOrCreateNavBar(navBar)
          .then((result) => navBar = result.navBar)
          .catch((error) => messageUpdateNav = error);
      }
        messageUploadImage = '';
    } else {
        messageUploadImage = result.data;
    }
  };

  // Manage styles
  const colors = ['primary', 'secondary', 'pomme', 'outremer', 'lavande', 'caraibe', 'tangerine', 'ambre', 'light', 'white', 'dark', 'black'];

  // Manage OG
  const onSelectAnImageOg = async(e) => {
    const data = new FormData();
    data.append('file', e.target.files[0]);
    const result = await uploadImage(data, seo.DEFAULT_OG_IMAGE);
    if (result.status === 'Ok') {
        seo.DEFAULT_OG_IMAGE = result.data;
        seo = seo;
        messageUploadImage = '';
        updateOrCreateSeo(seo)
          .then((result) => seo = result.seo)
          .catch((error) => messageUpdateSeo = error);
    } else {
        messageUploadImage = result.data;
    }
  };

  // Manage Favicon
  const onSelectAnImageFavicon = async(e, name) => {
    const data = new FormData();
    data.append('file', e.target.files[0]);
    const result = await uploadImage(data, seo[name]);
    if (result.status === 'Ok') {
        seo[name] = result.data;
        seo = seo;
        messageUpdateFavicon = '';
        updateOrCreateSeo(seo)
          .then((result) => seo = result.seo)
          .catch((error) => messageUpdateSeo = error);
    } else {
        messageUpdateFavicon = result.data;
    }
  };

</script>

<!-- <Navbar 
color={config.NAV_BAR.STYLE.color}
light={config.NAV_BAR.STYLE.theme === "light"}
dark={config.NAV_BAR.STYLE.theme === "dark"}
expand={expand}
>
  <NavbarBrand on:click={() => navigateHandler('/')}>
    <img class='img-fluid' style={config.NAV_BAR.BRAND.LOGO.style} src={config.NAV_BAR.BRAND.LOGO.path} alt={config.NAV_BAR.BRAND.LOGO.path}/>
  </NavbarBrand>
  <div class='mx-auto'>
    {#each config.NAV_BAR.SOCIAL_NETWORKS as item}
      <span class='fw-bold'><a class="" target={item.target} href={item.redirect}><img class='icone-rs' style={config.NAV_BAR.STYLE.SOCIAL_NETWORKS.style} src={item.icon} alt={item.alt} /></a></span>
    {/each}
  </div>
  <NavbarToggler on:click={() => (isOpen = !isOpen)} />
  <Collapse {isOpen} navbar expand={expand}>
    <Nav class="ms-auto align-items-center" navbar>
      {#each config.NAV_BAR.TITLE as item}
        <Dropdown nav inNavbar>
          <NavItem><NavLink class={config.NAV_BAR.STYLE.TITLE.bootstrapClass} style={config.NAV_BAR.STYLE.TITLE.style} on:click={() => navigateHandler(item.url)}><span >{item.name.toString()}</span></NavLink></NavItem>
        </Dropdown>
      {/each}
      {#if isAuthenticate}
      <Dropdown nav inNavbar>
        <button class="btn btn-light px-2" on:click={toggle}><i class="bi bi-pencil-square"></i></button>
      </Dropdown>
      {/if}
    </Nav>
  </Collapse>
</Navbar> -->

{#if messageUpdateNav}
  <Message color='danger'>{messageUpdateNav}</Message>
{/if}
{#if messageUpdateSeo}
  <Message color='danger'>{messageUpdateSeo}</Message>
{/if}
{#if messageUpdateFavicon}
  <Message color='danger'>{messageUpdateFavicon}</Message>
{/if}
<Navbar 
color={navBar.STYLE.color}
light={navBar.STYLE.theme === "light"}
dark={navBar.STYLE.theme === "dark"}
expand={expand}
>
  <NavbarBrand on:click={() => navigateHandler('/')}>
    <img class='img-fluid' style={navBar.BRAND.LOGO.style} src={API_URL + navBar.BRAND.LOGO.path} alt={navBar.BRAND.LOGO.alt}/>
  </NavbarBrand>
  <div class='mx-auto d-flex'>
    {#each navBar.SOCIAL_NETWORKS as item}
      <div class={`fw-bold ${navBar.STYLE.SOCIAL_NETWORKS.bootstrapClass}`}><a class="" target={item.target} href={item.redirect}><img class='icone-rs' style={navBar.STYLE.SOCIAL_NETWORKS.style} src={API_URL + item.icon} alt={item.alt} /></a></div>
    {/each}
  </div>
  <NavbarToggler on:click={() => (isOpen = !isOpen)} />
  <Collapse {isOpen} navbar expand={expand}>
    <Nav class="ms-auto align-items-center" navbar>
      {#each navBar.TITLE as item}
        <Dropdown nav inNavbar>
          <NavItem><NavLink class={navBar.STYLE.TITLE.bootstrapClass} style={navBar.STYLE.TITLE.style} on:click={() => navigateHandler(item.url)}><span >{item.name.toString()}</span></NavLink></NavItem>
        </Dropdown>
      {/each}
      {#if isAuthenticate}
      <Dropdown nav inNavbar>
        <button class="btn btn-light px-2" on:click={toggle}><i class="bi bi-pencil-square"></i></button>
      </Dropdown>
      {/if}
    </Nav>
  </Collapse>
</Navbar>

<Modal isOpen={edit} {toggle} size='lg' scrollable>
  <ModalHeader {toggle}>Editer la barre de navigation</ModalHeader>
  <ModalBody>
      {#if messageUploadImage}
        <Message color='danger'>{messageUploadImage}</Message>
      {/if}
      <!-- brand edition -->
      <div class="row p-2">
        <div class="col">
          <label for="logo-img">Charger un logo</label>
          <input type="file" name="" id="logo-img" on:change={(e) => onSelectAnImageBrand(e)}/>
        </div>
        <div class="col">
          <img src={navBar.BRAND.LOGO.path ? API_URL + navBar.BRAND.LOGO.path : ""} alt={navBar.BRAND.LOGO.alt} class="img-fluid" />
        </div>
        <div class="col">
          <label for="logo-alt">Alternative message</label>
          <input type="text" name="" id="logo-alt" class="form-control" bind:value={navBar.BRAND.LOGO.alt}/>
        </div>
        <div class="col">
          <label for="logo-img">Style bootstrap : </label>
          <input type="text" name="" id="logo-img" class="form-control" bind:value={navBar.BRAND.LOGO.style}/>
        </div>
      </div>

      <!-- menu edition -->
      <div class='row p-2'>
        <div class="col">
          <form on:submit={addNavigation}>
            <div class="row align-items-end">
              <div class="col">
                <label for="nameMenu">Menu Name</label>
                <input type="text" class="form-control" id="nameMenu" bind:value={navName} placeholder="Ex. Home"/>
              </div>
              <div class="col">
                <label for="urlMenu">Redirection vers </label>
                <input type="text" class="form-control" id="urlMenu" bind:value={navUrl} placeholder="Ex. /home"/>
              </div>
              <div class="col">
                <button type='submit' class="btn btn-primary">+</button>
              </div>
            </div>
          </form>

          {#each navBar.TITLE as menu, ind}
            <div class='row mt-1'>
              <div class="col">
                <input type="text" class="form-control" id={`menu-${ind}`} bind:value={menu.name} >
              </div>
              <div class="col">
                <input type="text" class="form-control" id={`url-${ind}`} bind:value={menu.url} >
              </div>
              <div class="col">
                <button class="btn btn-danger btn-sm" on:click={() => deleteNavigation(ind)}>x</button>
                <button class="btn btn-secondary btn-sm" on:click={() => upNavigation(ind)}>Up</button>
                <button class="btn btn-secondary btn-sm" on:click={() => downNavigation(ind)}>Down</button>
              </div>
            </div>
          {/each}
        </div>

      </div>

      <!-- social network edition -->
      <div class='row p-2'>
        <div class="col">
          <p>Social Networks</p>
          <form on:submit={addSocialNetwork}>
            <div class="row align-items-end">
              <div class="col">
                <label for="nameSN">Name</label>
                <input type="text" class="form-control" id="nameSN" bind:value={snName} placeholder="Ex. Facebook"/>
              </div>
              <div class="col">
                <label for="iconSN">Icon </label>
                <input type="file" class="form-control" id="iconSN" on:change={(e) => onSelectAnImageSocialNetwork(-1, e)}/>
              </div>
              <div class="col bg-light">
                <img class='img-fluid' src={API_URL + snIcon} alt={snAlt} />
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
                <div class="form-check form-switch align-items-center">
                  <label for="targetSN">Nouvel onglet </label>
                  <input type="checkbox" class="form-check-input" id="targetSN" bind:checked={newTarget} />
                </div>
              </div>
              <div class="col">
                <button type='submit' class="btn btn-primary">+</button>
              </div>
            </div>
          </form>

          <!-- {"name": "", "icon": "", "alt": "", "redirect": "", "target": ""}, -->
          {#each navBar.SOCIAL_NETWORKS as item, ind}
            <div class='row mt-1'>
              <div class="col my-auto">
                <input type="text" class="form-control" bind:value={item.name} >
              </div>
              <div class="col my-auto">
                <input type="file" class="form-control" on:change={(e) => onSelectAnImageSocialNetwork(ind, e)}>
              </div>
              <div class="col my-auto bg-light">
                <img class='img-fluid' src={API_URL + item.icon} alt={snAlt} />
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
              <div class="col my-auto">
                <button class="btn btn-danger btn-sm" on:click={() => deleteSocialNetwork(ind)}>x</button>
                <button class="btn btn-secondary btn-sm" on:click={() => upSocialNetwork(ind)}>Up</button>
                <button class="btn btn-secondary btn-sm" on:click={() => downSocialNetwork(ind)}>Down</button>
              </div>
            </div>
          {/each}

        </div>
      </div>

      <!-- styles edition -->
      <div class="row p-2">
        <div class="col">
          <label for="select-expand">Expand</label>
          <select id="select-expand" class="form-control" bind:value={navBar.STYLE.expand}>
            <option value="">--select--</option>
            <option value="xs">xs</option>
            <option value="sm">sm</option>
            <option value="md">md</option>
            <option value="lg">lg</option>
            <option value="xl">xl</option>
          </select>
        </div>
        <div class="col">
          <label for="color-bar">Couleur de la navbar</label>
          <select id="color-bar" class="form-control" bind:value={navBar.STYLE.color}>
            <option values="">--select--</option>
            {#each colors as color}
              <option values={color}>{color}</option>
            {/each}
          </select>
        </div>
        <div class="col">
          <label for="color-bar">Thème de la navbar</label>
          <select id="color-bar" class="form-control" bind:value={navBar.STYLE.theme}>
            <option values="">--select--</option>
            {#each colors as color}
              <option values={color}>{color}</option>
            {/each}
          </select>
        </div>
      </div>
      <div class="row p-2">
        <div class="col">
          <label for="title-style-bootstrap">Titre (Bootstrap class)</label>
          <input class="form-control" type="text" id="title-style-bootstrap" bind:value={navBar.STYLE.TITLE.bootstrapClass}>
        </div>
        <div class="col">
          <label for="title-style-css">Titre (style css)</label>
          <input class="form-control" type="text" id="title-style-css" bind:value={navBar.STYLE.TITLE.style}>
        </div>
      </div>
      <div class="row p-2">
        <div class="col">
          <label for="socialNetwork-style-bootstrap">Réseaux sociaux (Bootstrap class)</label>
          <input class="form-control" type="text" id="socialNetwork-style-bootstrap" bind:value={navBar.STYLE.SOCIAL_NETWORKS.bootstrapClass}>
        </div>
        <div class="col">
          <label for="socialNetwork-style-css">Réseuax sociaux (style css)</label>
          <input class="form-control" type="text" id="socialNetwork-style-css" bind:value={navBar.STYLE.SOCIAL_NETWORKS.style}>
        </div>
      </div>

      <!-- Seo edition -->
      <div class='row p-2 align-items-end'>
        <div class="col">
          <label for="seo-default-title">Default Title</label>
          <input type="text" class="form-control" id="seo-default-title" bind:value={seo.DEFAULT_TITLE}/>
        </div>
        <div class="col">
          <label for="seo-default-description">Default Description</label>
          <input type="text" class="form-control" id="seo-default-description" bind:value={seo.DEFAULT_DESCRIPTION}/>
        </div>
        <div class="col">
          <label for="seo-default-og-title">Default OG Title</label>
          <input type="text" class="form-control" id="seo-default-og-title" bind:value={seo.DEFAULT_OG_TITLE}/>
        </div>
        <div class="col">
          <label for="seo-default-og-description">Default OG Description</label>
          <input type="text" class="form-control" id="seo-default-og-description" bind:value={seo.DEFAULT_OG_DESCRIPTION}/>
        </div>
        <div class="col">
          <label for="seo-default-OG-image"></label>
          <input type="file" class="form-control" id="seo-default-OG-image" on:change={(e) => onSelectAnImageOg(e)}/>
        </div>
        <div class="col">
          <img class='img-fluid' src={API_URL + seo.DEFAULT_OG_IMAGE} alt={seo.DEFAULT_OG_TITLE} />
        </div>
      </div>

      <!-- favicon edition -->
      <div class='row p-2 align-items-top'>
        <p>Configuration des favicon</p>
        <div class="col text-center">
          <label for="FAVICON_48_48"></label>
          <input type="file" class="form-control" id="FAVICON_48_48" on:change={(e) => onSelectAnImageFavicon(e, "FAVICON_48_48")}/>
          <img class="img-fluid" src={API_URL + seo.FAVICON_48_48} alt="FAVICON_48_48" />
        </div>
        <div class="col text-center">
          <label for="FAVICON_64_64"></label>
          <input type="file" class="form-control" id="FAVICON_64_64" on:change={(e) => onSelectAnImageFavicon(e, "FAVICON_64_64")}/>
          <img class="img-fluid" src={API_URL + seo.FAVICON_64_64} alt="FAVICON_64_64" />
        </div>
        <div class="col text-center">
          <label for="FAVICON_96_96"></label>
          <input type="file" class="form-control" id="FAVICON_96_96" on:change={(e) => onSelectAnImageFavicon(e, "FAVICON_96_96")}/>
          <img class="img-fluid" src={API_URL + seo.FAVICON_96_96} alt="FAVICON_96_96" />
        </div>
        <div class="col text-center">
          <label for="FAVICON_128_128"></label>
          <input type="file" class="form-control" id="FAVICON_128_128" on:change={(e) => onSelectAnImageFavicon(e, "FAVICON_128_128")}/>
          <img class="img-fluid" src={API_URL + seo.FAVICON_128_128} alt="FAVICON_128_128" />
        </div>
        <div class="col text-center">
          <label for="FAVICON_196_196"></label>
          <input type="file" class="form-control" id="FAVICON_196_196" on:change={(e) => onSelectAnImageFavicon(e, "FAVICON_196_196")}/>
          <img class="img-fluid" src={API_URL + seo.FAVICON_196_196} alt="FAVICON_196_196" />
        </div>
      </div>
  </ModalBody>
  <ModalFooter>
      <button class="btn btn-primary" on:click={toggle}>Enregistrer</button>
      <button class="btn btn-secondary" on:click={toggle}>Cancel</button>
  </ModalFooter>
</Modal> 