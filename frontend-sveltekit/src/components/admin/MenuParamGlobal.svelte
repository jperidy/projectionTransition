<script>
    export let showNavigationBar = false;
    export let showFooter = false;
    export let showFonts = false;
    export let showDefaultSeo = false;
    export let showFavicon = false;

    const toogle = (param) => {
        showNavigationBar = false;
        showFooter = false;
        showFonts = false;
        showDefaultSeo = false;
        showFavicon = false;
        switch (param) {
            case 'navBar':
                showNavigationBar = true; 
                return;       
            case 'footer':
                showFooter = true;
                return;
            case 'fonts':
                showFonts = true;
                return;
            case 'defaultSeo':
                showDefaultSeo = true;
                return;
            case 'favicon':
                showFavicon = true;
                return;
        }
    }
</script>

<div class='mt-2 d-grid gap-2'>
    <h3 class="p-0 m-0">Global Parameters</h3>
    <button class={`page-item btn ${showNavigationBar ? "btn-primary" : "btn-transparent"} text-start shadow-sm rounded-0`} on:click={() => toogle('navBar')}>Navigation bar</button>
    <button class={`page-item btn ${showFooter ? "btn-primary" : "btn-transparent"} text-start shadow-sm rounded-0`} on:click={() => toogle('footer')}>Footer</button>
    <button class={`page-item btn ${showFonts ? "btn-primary" : "btn-transparent"} text-start shadow-sm rounded-0`} on:click={() => toogle('fonts')}>Fonts</button>
    <button class={`page-item btn ${showDefaultSeo ? "btn-primary" : "btn-transparent"} text-start shadow-sm rounded-0`} on:click={() => toogle('defaultSeo')}>Default SEO</button>
    <button class={`page-item btn ${showFavicon ? "btn-primary" : "btn-transparent"} text-start shadow-sm rounded-0`} on:click={() => toogle('favicon')}>Favicon</button>
</div>

<style>
    .page-item {
        transition: 0.5s;
    }
    .page-item:hover {
        background-color: rgba(255, 255, 255, .5);
        transition: 0.5s;
    }
</style>