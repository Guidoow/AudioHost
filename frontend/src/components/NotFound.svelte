<script lang="ts">
  import { Link } from "svelte-routing";

  import config from "../config";
</script>

<div
  class="scroll-wrapper
    {config.css.shape.l} 
    {config.css.colors.surface}"
>
  <div class="scroll {config.css.shape.l} {config.css.colors.surface}">
    <h2>The route you attempting to access was not found.</h2>

    <div style="display:flex;align-items:center;zoom:5;">
      <md-icon>gpp_bad</md-icon>
      404
    </div>

    <divider-min />

    <Link to="/">
      <md-outlined-button> Go home </md-outlined-button>
    </Link>
  </div>
</div>

<style>
  .scroll {
    padding: 5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;

    max-width: calc(100% - 10rem);
  }

  divider-min {
    margin: 2rem 0;
  }
</style>
