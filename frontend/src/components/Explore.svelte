<script lang="ts">
  import ListAudioBox from "./audioBox/list/Audiobox.svelte";
  import Loader from "./assets/Loader.svelte";

  import type { RouteLocation } from "svelte-routing/types/Route";
  import { writable, type Writable } from "svelte/store";
  import { Link, useLocation } from "svelte-routing";
  import { onDestroy, onMount } from "svelte";

  import { RequestService, UtilsService } from "../services";
  import { AppState, Songs } from "../globals";
  import config from "../config";

  import type { Song } from "../types";

  let searchParams;

  let mounted = false;

  let loader: HTMLDivElement;

  function observeForLoading() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(async (entry) => {
        if (entry.isIntersecting) {
          if (mounted) await fetchSongs();

          if (filter === "random") filteredSongs.set(Array.from($Songs));
          else await filterSongs().then((songs) => filteredSongs.set(songs));
        }
      });
    });

    observer.observe(loader);
  }

  let filter: string = "random";
  let lastFilter: string = "";

  const defaultAmount = 3;
  let amount = defaultAmount;

  const filteredSongs: Writable<Song[]> = writable([]);
  let filteredSongsSubscriptor: Song[];

  async function fetchSongs() {
    amount += defaultAmount;

    const response = await RequestService.get({
      url: `api/song/amount/${amount}?filter=${filter}`,
    });

    if (response.data)
      Songs.set(
        UtilsService.filterRepeatedSongs([
          ...$Songs,
          ...(response.data as Song[]),
        ])
      );
  }

  async function filterSongs(): Promise<Song[]> {
    const arraySongs: Song[] = Array.from($Songs);

    switch (filter) {
      case "random":
        for (let i = arraySongs.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [arraySongs[i], arraySongs[j]] = [arraySongs[j], arraySongs[i]];
        }
        break;

      case "relevant":
        arraySongs.sort((a, b) => b.likes - a.likes);
        break;

      case "recent":
        arraySongs.sort(
          (a, b) =>
            new Date(b.date.toString()).getTime() -
            new Date(a.date.toString()).getTime()
        );
        break;

      case "older":
        arraySongs.sort(
          (a, b) =>
            new Date(a.date.toString()).getTime() -
            new Date(b.date.toString()).getTime()
        );
        break;
    }

    return arraySongs;
  }

  async function onLocationChange(URL: RouteLocation) {
    if (!mounted)
      return setTimeout(() => {
        onLocationChange(URL);
      }, 10);

    if (!URL.pathname.includes("/")) return 0;

    searchParams = new URLSearchParams(URL.search);
    filter = searchParams.get("filter") || "random";

    if (lastFilter === filter) return 0;

    amount = 0;

    $Songs = [];
    filteredSongs.set(await filterSongs());

    lastFilter = filter;
  }

  const unsuscribeLocation = useLocation().subscribe(onLocationChange);
  const filteredSongsUnsuscriptor = filteredSongs.subscribe((songs) => {
    filteredSongsSubscriptor = songs;
  });
  const unsuscribeAppState = AppState.subscribe((appState) => {
    if (appState.requireRefresh) {
      filteredSongsSubscriptor = filteredSongsSubscriptor;
      AppState.update((appState) => {
        appState.requireRefresh = false;
        return appState;
      });
    }
  });

  onDestroy(() => {
    unsuscribeLocation();
    unsuscribeAppState();
    filteredSongsUnsuscriptor();
  });

  onMount(async () => {
    observeForLoading();

    mounted = true;
  });
</script>

<div
  class="scroll-wrapper
    {config.css.shape.l} 
    {config.css.colors.surface}"
>
  <div class="scroll {config.css.shape.l} {config.css.colors.surface}">
    <section style="display:flex;flex-direction:column;align-items:center;">
      <span class={config.css.typography.displayLarge}>Explore</span>
      <span class={config.css.typography.bodyLarge}>the uploaded songs</span>
    </section>

    <divider-min />

    <md-chip-set>
      <Link tabindex={-1} to="explore">
        <md-filter-chip
          selected={filter === "random"}
          label="Random"
          icon="filter"
        />
      </Link>

      <Link tabindex={-1} to="explore?filter=relevant">
        <md-filter-chip selected={filter === "relevant"} label="Relevant" />
      </Link>

      <Link tabindex={-1} to="explore?filter=recent">
        <md-filter-chip selected={filter === "recent"} label="Recent" />
      </Link>
      <Link tabindex={-1} to="explore?filter=older">
        <md-filter-chip selected={filter === "older"} label="Older" />
      </Link>
    </md-chip-set>

    <md-list>
      {#each filteredSongsSubscriptor as song}
        <ListAudioBox {song} />
      {/each}
    </md-list>
    <div class="loading" bind:this={loader}>
      <Loader />
    </div>
  </div>
</div>

<style>
  .scroll-wrapper {
    max-height: var(--content-height) !important;
    min-height: var(--content-height) !important;
  }

  .scroll {
    display: flex;
    flex-direction: column;
    align-items: center;

    padding: 3rem;
    max-width: calc(100% - 6rem);
  }

  divider-min {
    margin: 3rem 0 2rem 0;
  }

  md-chip-set {
    margin: 1rem;
    display: flex;
    flex-direction: row;
    justify-content: center;
  }

  md-list {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  div.loading {
    padding-top: 3rem;
    padding-bottom: 10rem;

    display: flex;
  }
</style>
