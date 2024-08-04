<script lang="ts">
  import { onMount } from "svelte";
  import config from "../../config";

  export let color = `var(${config.css.variables.primary})`;

  export let zoom = "1";

  let backgroundImage = `linear-gradient(${color}, 50px, transparent 0),linear-gradient(${color}, 50px, transparent 0),linear-gradient(${color}, 50px, transparent 0),linear-gradient(${color}, 50px, transparent 0),linear-gradient(${color}, 50px, transparent 0),linear-gradient(${color}, 50px, transparent 0)`;

  onMount(() => {
    backgroundImage = backgroundImage;
  });
</script>

<span
  class="loader"
  style="background-image:{backgroundImage};color:{color};zoom:{zoom}"
/>

<style>
  .loader {
    display: flex;
    position: relative;
    width: 90px;
    height: 50px;
    margin-bottom: 15px;
    background-repeat: no-repeat;
    background-position:
      0px center,
      15px center,
      30px center,
      45px center,
      60px center,
      75px center,
      90px center;
    animation: rikSpikeRoll 1s ease-out infinite;
  }
  @keyframes rikSpikeRoll {
    0% {
      background-size: 10px 3px;
    }
    10% {
      background-size:
        10px 50px,
        10px 3px,
        10px 3px,
        10px 3px,
        10px 3px,
        10px 3px;
    }
    20% {
      background-size:
        10px 30px,
        10px 50px,
        10px 3px,
        10px 3px,
        10px 3px,
        10px 3px;
    }
    33% {
      background-size:
        10px 10px,
        10px 30px,
        10px 50px,
        10px 3px,
        10px 3px,
        10px 3px;
    }
    45% {
      background-size:
        10px 3px,
        10px 10px,
        10px 30px,
        10px 50px,
        10px 3px,
        10px 3px;
    }
    57% {
      background-size:
        10px 3px,
        10px 3px,
        10px 10px,
        10px 30px,
        10px 50px,
        10px 3px;
    }
    65% {
      background-size:
        10px 3px,
        10px 3px,
        10px 3px,
        10px 3px,
        10px 10px,
        10px 30px;
    }

    75% {
      background-size: 10px 3px;
    }
    100% {
      background-size: 10px 3px;
    }
  }
</style>
