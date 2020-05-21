<script>
  export let title;
  export let mainText;
  export let contactText;
  
</script>

<style>
  h3 {
    font-size: 1em;
  }

  p {
    margin: 0 0 1rem 0;
  }

  .text {
    height: 50%;
  }
</style>

<div class="text">

  <h3>{title}</h3>
  <p class="major">{mainText}</p>

  <p>{contactText}</p>

</div>
