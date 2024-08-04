<script lang="ts">
  import { StatsService, UtilsService } from "../../../services";
  import { AppState } from "../../../globals";
  import config from "../../../config";

  import type { Song } from "../../../types";

  export let song: Song;

  async function copyLink() {
    await navigator.clipboard.writeText(
      location.origin + "/detail/" + song.UUID
    );
  }
</script>

<div class="card-bottom">
  <div class="card-bottom-left">
    <div
      role="button"
      tabindex="-1"
      class="btn-container"
      on:click={async () => {
        await StatsService.assignLike(song);
      }}
      on:keydown
    >
      <md-filled-button>
        <div class="btn-content">
          {#if $AppState.client.likes.includes(song.UUID)}
            <md-icon filled>favorite</md-icon>
          {:else}
            <md-icon>favorite</md-icon>
          {/if}
          <span class="audiobox-btn-text">{song.likes}</span>
        </div>
      </md-filled-button>
    </div>

    <div class="btn-container">
      <md-filled-button
        role="button"
        aria-roledescription="copy link button"
        tabindex="0"
        on:click={copyLink}
        on:keydown={copyLink}
      >
        <div class="btn-content">
          <md-icon>share</md-icon>
          <span class="audiobox-btn-text">Share</span>
        </div>
      </md-filled-button>
    </div>

    <div class="btn-container">
      <md-filled-button>
        <div class="btn-content">
          <md-icon>playlist_add</md-icon>
          <span class="audiobox-btn-text">Add Next</span>
        </div>
      </md-filled-button>
    </div>
  </div>

  <div
    class="card-bottom-right"
    style="color: var({config.css.variables.inverseSurface});"
  >
    <div class="card-bottom-description">
      <md-icon filled>play_arrow</md-icon>
      <span>
        {song.views}
      </span>
    </div>

    <div class="card-bottom-description">
      <md-icon style="padding: 5px;" filled small>forum</md-icon>
      <span>
        {UtilsService.formatStats(song.comments)}
      </span>
    </div>

    <div class="card-bottom-description">
      <md-icon filled thin>bookmark</md-icon>
      <span>
        {UtilsService.formatStats(song.saved)}
      </span>
    </div>
  </div>
</div>

<style>
  .card-bottom {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .card-bottom-left,
  .card-bottom-right {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .audiobox-btn-text {
    margin-left: 5px;
  }

  div.btn-container {
    display: flex;
    align-items: center;
    height: calc(var(--svg-audiobox-btn-size) + 2px);
    zoom: 0.9;
  }

  md-filled-button {
    padding: 10px 15px;
    margin: 0 3px;
  }

  div.btn-content {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .card-bottom-description {
    display: flex;
    flex-direction: row;
    align-items: center;

    margin: 0 4px;
  }

  .card-bottom-description > span {
    position: relative;
    font-size: 0.7rem;
    margin: 0 1px;
    left: -4px;
  }

  @media (max-width: 600px) {
    .card-bottom {
      flex-direction: column;
    }
  }

  @media (min-width: 601px) and (max-width: 768px) {
    .card-bottom {
      flex-direction: column;
    }
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    .card-bottom {
      flex-direction: column;
    }
  }

  @media (min-width: 1025px) and (max-width: 1200px) {
    .card-bottom {
      flex-direction: column;
    }
  }

  @media (min-width: 1201px) {
    .card-bottom {
      flex-direction: row;
    }
  }
</style>
