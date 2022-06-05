<script>
  import Message from './Message.svelte';

  let messageUpdateNav = '';
  let messageUpdateSeo = '';

  export let navBar;

</script>

{#if messageUpdateNav}
  <Message color='danger'>{messageUpdateNav}</Message>
{/if}
{#if messageUpdateSeo}
  <Message color='danger'>{messageUpdateSeo}</Message>
{/if}

<!-- NavBar to display -->
<nav class={`navbar navbar-expand-${navBar.STYLE.expand} navbar-${navBar.STYLE.color} bg-${navBar.STYLE.theme}`}>
  <div class="container-fluid">
    <a class='navbar-brand' href="/">
      <img class='img-fluid' style={navBar.BRAND.LOGO.style} src={navBar.BRAND.LOGO.path} alt={navBar.BRAND.LOGO.alt}/>
    </a>
    <div class='mx-auto d-flex'>
      {#each navBar.SOCIAL_NETWORKS as item}
        <div class={`fw-bold ${navBar.STYLE.SOCIAL_NETWORKS.bootstrapClass}`}>
          <a class="" target={item.target} href={item.redirect}>
            <img 
              class='icone-rs' 
              style={navBar.STYLE.SOCIAL_NETWORKS.style} 
              src={item.icon} 
              alt={item.alt} 
            />
          </a>
        </div>
      {/each}
    </div>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"><i class="bi bi-list"></i></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav ms-auto align-items-center">
        {#each navBar.TITLE as item}
        <li class="nav-item">
          <a 
            class={`nav-link active ${navBar.STYLE.TITLE.bootstrapClass}`}
            style={navBar.STYLE.TITLE.style}
            aria-current="page" 
            href={item.url}
          >{item.name.toString()}</a>
        </li>
        {/each}
      </ul>
    </div>
  </div>
</nav>