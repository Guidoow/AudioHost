<script lang="ts">
  import Audiobox from "./audioBox/list/Audiobox.svelte";
  import Loader from "./assets/Loader.svelte";

  import { RequestService, UtilsService } from "../services";
  import { Songs } from "../globals";
  import config from "../config";

  import type { Song } from "../types";

  export let search: string;

  function filterSongs() {
    const uniqueArray = UtilsService.filterRepeatedSongs([
      ...$Songs,
      ...filteredSongs,
    ]);

    filteredSongs = uniqueArray.filter(
      (song: Song) =>
        song.title.includes(search) || song.author.includes(search)
    );
  }

  async function fetchSongs() {
    const songs = await RequestService.get({
      url: "api/song/search/" + search,
    });

    filteredSongs = UtilsService.filterRepeatedSongs([
      ...filteredSongs,
      ...(songs.data as Song[]),
    ]);

    $Songs.push(...(songs.data as Song[]));
  }

  let filteredSongs: Song[] = [];

  $: if (search) {
    filterSongs();
    fetchSongs();
  }
</script>

<div
  class="scroll-wrapper
      {config.css.shape.l} 
      {config.css.colors.surface}"
>
  <div class="scroll {config.css.shape.l} {config.css.colors.surface}">
    <h3 style="display:flex;align-items:center;">
      <md-icon style="padding-right: 5px;">search</md-icon>Search for "{search}"
    </h3>

    <divider-min />

    <md-list>
      {#each filteredSongs as song}
        <Audiobox {song} />
      {/each}
      <Loader />
    </md-list>
  </div>
</div>

<style>
  .scroll {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 3rem;
    max-width: calc(100% - 6rem);
  }

  divider-min {
    margin: 1rem 0 3rem 0;
  }

  md-list {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: 15rem;
  }
</style>
