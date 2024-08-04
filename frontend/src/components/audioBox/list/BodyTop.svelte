<script lang="ts">
  import AudioboxImage from "./AudioboxImage.svelte";
  import Loading from "../../assets/Loading.svelte";

  import { Link } from "svelte-routing";

  import { AppState, Songs } from "../../../globals";
  import config from "../../../config";
  import {
    AudioService,
    StatsService,
    RequestService,
    UtilsService,
  } from "../../../services";

  import { type Song, HttpStatus } from "../../../types";

  export let song: Song;

  async function buttonAction(event: MouseEvent | KeyboardEvent) {
    if (event instanceof KeyboardEvent && event.key !== "Enter") return;
    if (!song.src || song.src === "api/audio/") return;

    return songNotRunning ? await managePlay() : managePause();
  }

  $: songNotRunning =
    ($AppState.audio.running[song!.src] &&
      $AppState.audio.running[song!.src].paused) ||
    !(song!.src in $AppState.audio.running);

  async function managePlay() {
    await AudioService.playNew(song!);
    await StatsService.assignView(song);
  }

  function managePause() {
    AudioService.pause();
  }

  async function deleteSong() {
    const response = await RequestService.custom({
      method: "DELETE",
      url: "api/song",
      body: "",
    });

    const status = response.statusCode;

    if (status === HttpStatus.ACCEPTED) {
      UtilsService.displayDialog(
        "Song deleted",
        "You have deleted a song correctly."
      );

      $Songs = $Songs.filter((s) => s.UUID !== song.UUID);
      $AppState.client.Song = undefined;
    } else if (status === HttpStatus.BAD_REQUEST) {
      UtilsService.displayDialog(
        "Bad request",
        "You doesn't have a song registered yet.  :("
      );
    } else if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      UtilsService.displayDialog(
        "Server error",
        "Something failed in the server.  :("
      );
    } else {
      UtilsService.displayDialog("Unknown error", "Something failed.");
    }
  }
</script>

<div class="card-top">
  <span class="card-top-top">
    {#if $AppState.screenWidth < config.breakpoints.largeMobile}
      <div class="card-image">
        <AudioboxImage image={song.image} />
      </div>
    {/if}

    <md-text-button
      class="card-top-button"
      role="button"
      tabindex="0"
      style="zoom: {$AppState.screenWidth < config.breakpoints.laptop
        ? '0.75'
        : '1'};"
      on:keydown={buttonAction}
      on:click={buttonAction}
    >
      {#if songNotRunning}
        <md-icon xxlarge style="position: relative; left: -4px;">
          play_arrow
        </md-icon>
      {:else}
        <Loading zoom={"0.3"} />
      {/if}
    </md-text-button>
  </span>
  <span class="card-top-left">
    <md-text-button
      class="main-button"
      style="
        --md-sys-color-primary: none;
        cursor: default;
        color: var(--md-sys-color-primary);
        font-size: 1.1rem;
        zoom: {$AppState.screenWidth < config.breakpoints.laptop
        ? '0.8'
        : '1'};"
    >
      {song.author || "UNKNOWN AUTHOR"}
    </md-text-button>

    <Link to="detail/{song.UUID}" tabindex={-1} replace={true}>
      <md-text-button
        class="main-button"
        style="
        position:relative;
        font-size: 1.1rem;
        zoom: {$AppState.screenWidth < config.breakpoints.laptop
          ? '0.8'
          : '1'};"
      >
        {song.title}
      </md-text-button>
    </Link>
  </span>

  {#if $AppState.client.UUID === song.UUID}
    <span class="card-top-right">
      <md-text-button
        id="trash"
        role="button"
        tabindex="0"
        style="
        zoom: {$AppState.screenWidth < config.breakpoints.laptop
          ? '0.9'
          : '1'};"
        on:click={deleteSong}
        on:keydown
      >
        <md-icon>delete</md-icon>
      </md-text-button>
    </span>
  {/if}
</div>

<style>
  * {
    transition:
      color 0.1s,
      background-color 0.1s,
      background 0.1s !important;
  }
  .card-top {
    position: relative;
    display: flex;
    align-items: center;

    width: 100%;

    text-wrap: nowrap;
  }

  .card-top-button {
    display: flex;
    width: 50px;
    height: 100%;
    padding: 5px 5px 0 5px;
  }

  .card-top-top {
    position: relative;
    display: flex;
    height: 100%;

    padding-left: 0;
  }

  .card-top-left {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .card-top-right {
    position: absolute;
    right: 0px;
  }

  .card-image {
    display: flex;
    padding: 10px 5px 10px 10px;
  }

  md-text-button {
    width: max-content;
    height: min-content;
  }

  md-text-button#trash {
    padding-top: 15px;
  }

  @media (max-width: 600px) {
    .card-top {
      flex-direction: column;
    }

    .card-top-left {
      align-items: center;
    }

    .card-top-top {
      padding-left: 36px;
    }

    md-text-button.main-button {
      max-width: 325px;
    }
  }

  @media (min-width: 601px) and (max-width: 768px) {
    .card-top {
      flex-direction: row;
    }

    .card-top-left {
      align-items: flex-start;
    }

    .card-top-top {
      padding-left: 36px;
    }

    md-text-button.main-button {
      max-width: 325px;
    }
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    .card-top {
      flex-direction: row;
    }

    .card-top-left {
      align-items: flex-start;
    }

    .card-top-top {
      padding-left: 0;
    }

    md-text-button.main-button {
      max-width: 325px;
    }
  }

  @media (min-width: 1025px) and (max-width: 1200px) {
    .card-top {
      flex-direction: row;
    }

    .card-top-left {
      align-items: flex-start;
    }

    .card-top-top {
      padding-left: 0;
    }

    md-text-button.main-button {
      max-width: 280px;
    }
  }

  @media (min-width: 1201px) {
    .card-top {
      flex-direction: row;
    }

    .card-top-left {
      align-items: flex-start;
    }

    .card-top-top {
      padding-left: 0;
    }

    md-text-button.main-button {
      max-width: 600px;
    }
  }
</style>
