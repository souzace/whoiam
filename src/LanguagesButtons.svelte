<script>
    export let language;
    export let changeLang;
</script>


<a href="#" on:click="{changeLang('pt-BR')}" class="flag">
    {#if language === 'pt-BR'}
        <img src="images/brazil-enabled.png" alt="" />
    {:else}
        <img src="images/brazil-disabled.png" alt="" />
    {/if}
</a>

<a href="#" on:click="{changeLang('en')}" class="flag">
    {#if language === 'en'}
        <img src="images/usa-enabled.png" alt="" />
    {:else}
        <img src="images/usa-disabled.png" alt="" />
    {/if}    
</a>

<style>
   .flag {
        border: 0!important;
        box-shadow: 0 0 0 0!important;
        height: 1.5rem;
        padding: 0 0.5em;
        margin-left: -7px;
    }

    .flag:hover, .flag:active {
        color: transparent!important;
    }
</style>