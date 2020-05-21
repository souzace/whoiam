<script>
  import SocialButtons from "./SocialButtons.svelte";
  import LanguagesButtons from "./LanguagesButtons.svelte";
  import Text from "./Text.svelte";

  let languageSelected = "en";

  function changeLang(language) {
    languageSelected = language;
  }
</script>

<style>
  h1 {
    font-size: 1em;
    font-weight: bold;
  }
  .content {
      padding: 0rem 5rem 0rem 5rem;
  }
</style>

<section
  class="banner style1 orient-left content-align-left image-position-right
  fullscreen onload-image-fade-in onload-content-fade-right">

  <div class="content">

    <h1>Fabio Souza (souzace)</h1>

    <LanguagesButtons language={languageSelected} {changeLang} />
    {#if languageSelected === 'en'}
      <Text
        title="Web Developer"
        mainText="I am a web developer at Grupo Imagem e Segurança, currently
        living in Fortaleza - CE, Brazil. Between 2010 and 2017, i worked with
        Java Script, PHP 5.x, MySQL, PostgresSQL, Firebird and anothers...
        after, came projects using PHP frameworks like CodeIgniter, Zend and
        Laravel, after 2017, i needed change my stack to focus in modern Java
        Script libraries for UI, and i made my first mobile app project using
        Ionic, since then, i made projects using NodeJS, MongoDB, SQLite,
        Angular, ElectronJS, VueJS, GraphQL and most recently, envolved in a
        project using ReactJS."
        contactText="If you’d like to get in touch, feel free to say hello
        through any of the social links below." />
    {:else}
      <Text
        title="Desenvolvedor Web"
        mainText="Sou desenvolvedor web do Grupo Imagem e Segurança, atualmente
        morando em Fortaleza - CE, Brasil. Entre 2010 e 2017, trabalhei com Java
        Script, PHP 5.x, MySQL, PostgresSQL, Firebird e outros... depois,
        surgiram projetos usando Frameworks PHP como CodeIgniter, Zend e
        Laravel, depois de 2017, precisei mudar meu foco, para se concentrar nas
        bibliotecas Java Script modernas para UI, então recebi meu primeiro
        projeto de aplicativo móvel feito em Ionic, desde então, fiz projetos
        usando NodeJS, MongoDB, SQLite, Angular, ElectronJS, VueJS, GraphQL e
        mais recentemente, envolvido em um projeto usando ReactJS."
        contactText="Se você gostaria de entrar em contato, sinta-se a vontade
        para dizer um Olá através de alguma das redes sociais nos links abaixo." />
    {/if}
    <SocialButtons />

  </div>

</section>
