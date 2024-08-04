<script lang="ts">
  import { Audio } from "../../globals/Audio.global";

  function isBlob(source: string) {
    return source.includes("blob:");
  }
</script>

{#each $Audio as audio}
  <audio
    src={(isBlob(audio.src) ? "" : location.origin + "/api/audio/") + audio.src}
    on:timeupdate={audio.handleTimeUpdate}
    on:pause={audio.handleOnPause}
    on:ended={audio.handleOnPause}
    preload="none"
    id="audio-{audio.UUID}"
  />
{/each}
