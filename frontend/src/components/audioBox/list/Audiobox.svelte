<script lang="ts">
  export let isSingle = false;

  import AudioboxImage from "./AudioboxImage.svelte";
  import AudioBoxBottom from "./BodyBottom.svelte";
  import BodyTop from "./BodyTop.svelte";
  import Wave from "../Wave.svelte";

  import { AppState } from "../../../globals";
  import config from "../../../config";

  import type { Song } from "../../../types";

  export let song: Song | undefined;
</script>

{#if song}
  <div
    class="card {config.css.colors.surfaceVariant}"
    style="
      max-width: calc(var({config.css.local.contentWidth}) - 1.5rem)!important;
      {isSingle ? 'margin: 0;' : 'margin: 2rem;'};
      --md-elevation-level: 5; position:relative;"
  >
    <md-elevation />

    {#if $AppState.screenWidth + 1 > config.breakpoints.largeMobile}
      <div class="card-image">
        {#key song.image}
          <AudioboxImage image={song.image} />
        {/key}
      </div>
    {/if}

    <div class="card-body">
      <BodyTop {song} />
      <div class="card-wave">
        <Wave {song} />
      </div>
      <AudioBoxBottom {song} />
    </div>
  </div>
{/if}

<style>
  .card {
    display: flex;
    position: relative;

    border-radius: 32px;
    box-sizing: border-box;
    padding: 1.5rem;

    overflow: hidden;
  }
  .card * {
    max-width: 100%;
    box-sizing: border-box;
  }

  .card:first-child {
    margin: 3rem 2rem 2rem 2rem;
  }

  .card-image {
    display: flex;
    padding: 10px 5px 10px 10px;
  }

  .card-body {
    padding: 5px 10px 20px 5px;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  @media (max-width: 600px) {
    .card {
      padding: 1rem;
      border-radius: 20px;
    }

    .card-body {
      padding: 5px 10px 0px 5px;
    }
  }

  @media (min-width: 601px) and (max-width: 768px) {
    .card {
      padding: 1rem;
      border-radius: 20px;
    }

    .card-body {
      padding: 5px 10px 0px 5px;
    }
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    .card {
      padding: 1rem;
      border-radius: 20px;
    }

    .card-body {
      padding: 5px 10px 0px 5px;
    }
  }

  @media (min-width: 1025px) and (max-width: 1200px) {
    .card {
      padding: 1.5rem;
      border-radius: 24px;
    }

    .card-body {
      padding: 5px 10px 0px 5px;
    }
  }

  @media (min-width: 1201px) {
    .card {
      padding: 1.5rem;
      border-radius: 32px;
    }

    .card-body {
      padding: 5px 10px 20px 5px;
    }
  }
</style>
