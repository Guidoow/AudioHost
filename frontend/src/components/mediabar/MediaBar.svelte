<script lang="ts">
  import { AudioService } from "../../services";
  import { AppState } from "../../globals";
  import config from "../../config";

  $: songNotRunning =
    AudioService.song &&
    $AppState.audio.running[AudioService.song!.src] &&
    $AppState.audio.running[AudioService.song!.src].paused;

  function manageInteraction() {
    console.log("songNotRunning: ", songNotRunning);
    console.log(
      "paused: ",
      $AppState.audio.running[AudioService.song!.src].paused
    );

    songNotRunning ? AudioService.play() : AudioService.pause();
  }
</script>

<nav
  class={config.css.colors.background}
  style="background: var({config.css.variables.surfaceContainer});"
>
  <div class="nav-left"></div>

  <div class="nav-center">
    <md-text-button role="button" tabindex="0" on:keypress={() => {}}>
      <md-icon xlarge stroke filled>skip_previous</md-icon>
    </md-text-button>
    <md-text-button
      role="button"
      tabindex="0"
      on:keypress
      on:click={manageInteraction}
    >
      {#if songNotRunning || !AudioService.song}
        <md-icon xlarge stroke filled>play_arrow</md-icon>
      {:else}
        <md-icon xlarge stroke filled>pause</md-icon>
      {/if}
    </md-text-button>

    <md-text-button role="button" tabindex="0" on:keypress on:click>
      <md-icon xlarge stroke filled>skip_next</md-icon>
    </md-text-button>
  </div>

  <div class="nav-right"></div>
</nav>

<style>
  nav {
    z-index: 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-evenly;
    position: fixed;
    bottom: 0px;
    right: 0px;
    left: 0px;
    max-height: var(--horbar-height);
    height: var(--horbar-height);
    min-width: 100%;
  }

  .nav-left,
  .nav-center,
  .nav-right {
    display: flex;
    flex-direction: row;
    flex: 1;
    max-height: var(--horbar-height);
    height: var(--horbar-height);
  }

  .nav-left {
    justify-content: flex-start;
  }

  .nav-center {
    justify-content: center;
  }

  .nav-right {
    justify-content: flex-end;
  }

  md-text-button {
    --md-text-button-container-shape: 0px;
  }

  md-icon {
    position: relative;
    top: 2px;
  }
</style>
