<script lang="ts">
  import BodyBottom from "./BodyBottom.svelte";
  import Wave from "../Wave.svelte";

  import { AppState } from "../../../globals";
  import config from "../../../config";

  import type { Song } from "../../../types";

  export let song: Song | undefined;

  function calcWaveSize(): number {
    const waveRanges = [2.333333333, 2, 1.666666666, 1.333333333, 1, 0.667];
    const breakpointsPattern = "012301212345";
    const breakpoints = [
      1700,
      1600,
      1350,
      config.breakpoints.desk,
      950,
      830,
      config.breakpoints.smallLaptop,
      666,
      config.breakpoints.largeMobile,
      450,
      344,
      config.breakpoints.mobile,
    ];

    for (let i = 0; i < breakpoints.length; i++) {
      if ($AppState.screenWidth > breakpoints[i]) {
        return waveRanges[Number(breakpointsPattern[i])];
      }
    }

    return waveRanges[-1];
  }

  let size = calcWaveSize();

  $: if ($AppState.screenWidth) size = calcWaveSize();
</script>

{#if song}
  <span class="card-author">{song.author} </span>
  <span class="card-title">{song.title}</span>
  <div class="card">
    <Wave {size} {song} />
  </div>
  <BodyBottom {song} />
{/if}

<style>
  .card {
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 5px;
    margin: 1rem;
    position: relative;
    padding: 25px;
  }

  .card-author,
  .card-title {
    position: relative;

    font-size: 2rem;
    z-index: 10;
    text-shadow: 0 0px 15px rgba(0, 0, 0, 1);
  }

  .card-author {
    font-size: 1.25rem;
  }

  .card-title {
    font-size: 2rem;
  }
</style>
