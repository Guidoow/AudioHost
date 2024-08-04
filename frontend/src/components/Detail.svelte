<script lang="ts">
  import DetailBackgroundBox from "./audioBox/detail/DetailBackgroundBox.svelte";
  import DetailAudioBox from "./audioBox/detail/DetailAudioBox.svelte";
  import Loader from "./assets/Loader.svelte";
  import NotFound from "./NotFound.svelte";

  import { UtilsService, RequestService } from "../services";
  import { Songs } from "../globals";
  import config from "../config";

  import type { Song } from "../types";

  export let UUID: string;

  let song = Array.from($Songs).find((s) => s.UUID === UUID);
  let loading = true;

  if (!song) {
    setTimeout(async () => {
      const response = await RequestService.get({
        url: "api/song/" + UUID,
      });

      if (response.data) song = response.data as Song;
      else {
        UtilsService.displayDialog(
          "Song created",
          "You have created a song correctly."
        );
      }

      loading = false;

      if (song) $Songs = [...$Songs, song];
    }, 10);
  }

  if (song) loading = false;

  $: image = location.origin + "/api/image/" + song?.image;
</script>

{#if !loading && song}
  {#key song}
    <div
      class="scroll-wrapper {config.css.shape.l} {config.css.colors.surface}"
    >
      <div class="scroll {config.css.shape.l} {config.css.colors.surface}">
        <DetailBackgroundBox {image} />
        <DetailAudioBox {song} />
      </div>
    </div>
  {/key}
{:else if !song && loading}
  <div class="scroll-wrapper {config.css.shape.l} {config.css.colors.surface}">
    <div class="scroll {config.css.shape.l} {config.css.colors.surface}">
      <Loader />
    </div>
  </div>
{:else}
  <NotFound />
{/if}

<style>
  .scroll-wrapper {
    max-height: var(--content-height) !important;
    min-height: var(--content-height) !important;
  }

  .scroll {
    display: flex;
    flex-direction: column;
    align-self: center;
    justify-content: center;
    align-items: center;
    overflow: hidden;

    padding: 3rem;
    box-sizing: border-box;
  }
</style>
