<script lang="ts">
  import { onMount } from "svelte";

  import { StatsService, AudioService } from "../../services";
  import { Audio, AppState } from "../../globals";
  import config from "../../config";

  import type { Song } from "../../types";

  export let song: Song;
  export let size: number = 1;

  let renderized = false;

  let timerClick: number | null;
  let timerDrag: number | null;

  let mouseMovedOnDrag: boolean = false;
  let waveNeedsReset: boolean = false;
  let isHovering: boolean = false;

  let currentTilePlaying: number | null;
  let tileSelectedOnDrag: number | null;
  let tileHovering: number | null;

  let audio: HTMLAudioElement | null;
  let soundbar: HTMLElement | null;

  let tempGlobalIndex: number | null;

  let mousePos: number | null;

  let waveTileElem: Array<HTMLElement> = [];

  let audioIndex = -1;

  let tileLength = $AppState.screenWidth < config.breakpoints.desk ? 100 : 220;

  $: if ($AppState.screenWidth)
    tileLength = $AppState.screenWidth < config.breakpoints.desk ? 100 : 220;

  const wavePixelWidth = tileLength * 3;
  let lastScreenWidth = $AppState.screenWidth;

  let AudioObject = {
    src: song.src,
    handleOnPause,
    UUID: song.UUID,
    handleTimeUpdate,
  };

  $: if (audioIndex !== -1) {
    if (song.src) $Audio[audioIndex].src = song.src;
  }

  $: audioIndex = audioIndex;
  $: isHovering = isHovering;
  $: waveTileElem = waveTileElem;
  $: tileHovering = tileHovering;
  $: currentTilePlaying = currentTilePlaying;

  function getAudioIndex() {
    audioIndex = $Audio.findIndex((aud) => aud.UUID === song.UUID);
    return audioIndex;
  }

  function normalizeWave(rawWave: number[]) {
    const max = Math.max(...rawWave.map(Math.abs));
    return rawWave.map((n) => n / max || 1);
  }
  let wave = normalizeWave(
    $AppState.screenWidth < config.breakpoints.desk
      ? song.wave100
      : song.wave220
  );

  $: if (renderized) {
    if ($AppState.screenWidth !== lastScreenWidth) {
      wave = normalizeWave(
        $AppState.screenWidth < config.breakpoints.desk
          ? song.wave100
          : song.wave220
      );

      lastScreenWidth = $AppState.screenWidth;
    }

    setTimeout(() => {
      initializeSoundbar();
      initializeTileElements();
      audio = document.getElementById("audio-" + song.UUID) as HTMLAudioElement;
    }, 100);
  }

  onMount(() => {
    initializeSoundbar();

    initializeTileElements();

    const existsAudio = $Audio.find((aud) => aud.UUID === song.UUID);
    if (!existsAudio) {
      $Audio.push(AudioObject);

      getAudioIndex();
    } else $Audio[getAudioIndex()] = AudioObject;

    setTimeout(() => {
      audio = document.getElementById("audio-" + song.UUID) as HTMLAudioElement;
    }, 100);

    const newSource = decodeURIComponent(song.src);
    const sourceInRunning = newSource in $AppState.audio.running;

    if (sourceInRunning) {
      currentTilePlaying = $AppState.audio.running[newSource].tile;
      assignEnterPlaying(currentTilePlaying!);
    }

    renderized = true;
  });

  function handleTimeUpdate() {
    const newSource = decodeURIComponent(song.src);

    if (!audio || !audio.duration) return;

    const scaleInverse = Math.ceil(
      (audio!.currentTime * tileLength) / audio!.duration
    );

    if (scaleInverse === currentTilePlaying) return 0;

    currentTilePlaying = scaleInverse;

    assignEnterPlaying(scaleInverse);

    if ((tileHovering && isHovering) || currentTilePlaying === 1) {
      if (tileHovering) assignEnter(tileHovering);
      else {
        assignEnter(currentTilePlaying!);
        assignLeave();
      }
    }

    AppState.update((v) => {
      v.audio.running[newSource] = {
        tile: currentTilePlaying! || 0,
        time: audio!.currentTime,
        paused: false,
      };
      return v;
    });
  }

  function handleOnPause() {
    AppState.update((v) => {
      v.audio.running[song.src].paused = true;
      return v;
    });
  }

  const initializeTileElements = () => {
    for (let tile: number = 0; tile < wave.length; tile++) {
      const element = document.getElementById(`wave_${song.UUID}_${tile}`);
      if (!element) return; // avoid errors while page changes.
      waveTileElem[tile] = element;
    }
  };

  function initializeSoundbar() {
    soundbar = document.getElementById(`sb_${song.UUID}`);
  }

  function mouseDrag() {
    document.removeEventListener("mouseup", mouseReleaseClick);
    document.removeEventListener("touchend", mouseReleaseClick);

    if (audio!) AudioService.pause();

    clearTimeout(timerClick!);
    if (!soundbar) initializeSoundbar();

    document.addEventListener("mouseup", mouseReleaseDrag);
    document.addEventListener("touchend", mouseReleaseDrag);

    document.addEventListener("mousemove", mouseCapture);
    document.addEventListener("touchmove", mouseCapture);
  }

  function mouseCapture(event: TouchEvent | MouseEvent) {
    const rect = soundbar!.getBoundingClientRect();

    function getEventXPosition() {
      if ("clientX" in event && !("touches" in event)) return event.clientX;
      else if ("touches" in event && !("clientX" in event))
        return event.touches[0].clientX;
      else throw new Error("Unknown mouse event.");
    }

    const evPosX = getEventXPosition();

    let mouseX = evPosX - rect.left;

    const cRight = wavePixelWidth;
    const coLeft = 0;

    if (mouseX < coLeft) mousePos = coLeft;
    else if (mouseX > cRight) mousePos = cRight;
    else mousePos = mouseX;

    tileSelectedOnDrag = Math.floor(mousePos / 3);

    if (timerDrag) clearTimeout(timerDrag);

    assignEnter(tileSelectedOnDrag);

    mouseMovedOnDrag = false;

    timerDrag = setTimeout(async () => {
      mouseMovedOnDrag = true;

      await AudioService.playNew(song, tileSelectedOnDrag!);
    }, 1000);
  }

  async function mouseReleaseClick() {
    clearTimeout(timerClick!);
    document.removeEventListener("mouseup", mouseReleaseClick);
    document.removeEventListener("touchend", mouseReleaseClick);

    await AudioService.playNew(song, tempGlobalIndex!);
    await StatsService.assignView(song);

    waveNeedsReset = true;
  }

  async function mouseReleaseDrag() {
    clearTimeout(timerDrag!);

    await StatsService.assignView(song);

    if (!mouseMovedOnDrag)
      await AudioService.playNew(song, tileSelectedOnDrag!);

    document.removeEventListener("mouseup", mouseReleaseDrag);
    document.removeEventListener("touchend", mouseReleaseDrag);

    document.removeEventListener("mousemove", mouseCapture);
    document.removeEventListener("touchmove", mouseCapture);
  }

  function assignEnter(tile: number, isDrag?: boolean) {
    // update tile colors according to item hovered &/| else currentTile being played
    isHovering = true;
    tileHovering = tile;

    if (isDrag) currentTilePlaying = tile;

    waveTileElem.forEach((childTile: HTMLElement, index: number) => {
      // waveTileElem.forEach((tileElement: HTMLElement, index: number) => {
      // const childTile = tileElement.firstChild as HTMLElement;

      if (index < tile && childTile) {
        // element IR is less than the current hovering/selected
        if (index < currentTilePlaying!) {
          // element IR is less than the current playing
          childTile.style.backgroundColor = "var(--wave-tile-played)";
        } else {
          // element IR is greather than the current playing
          childTile.style.backgroundColor = "var(--wave-tile-hover)";
        }
      } else {
        // element IR is greather than the current hovering/selected
        if (index < currentTilePlaying!) {
          // element IR is less than the current playing
          childTile.style.backgroundColor = "var(--wave-tile-hover)";
        } else {
          // element IR is greather than the current playing
          childTile.style.backgroundColor = "var(--wave-tile)";
        }
      }
    });
  }

  function assignEnterPlaying(tile: number) {
    if (isHovering && tileHovering)
      if (tile <= tileHovering) {
        // HOVERING >

        waveTileElem
          .slice(tileHovering, currentTilePlaying!)
          .forEach((tile) => {
            tile.style.backgroundColor = "var(--wave-tile-played)";
          });
      } else {
        // HOVERING <

        waveTileElem
          .slice(currentTilePlaying!, tileHovering)
          .forEach((tile) => {
            tile.style.backgroundColor = "var(--wave-tile-played)";
          });
      }
    else {
      // NO HOVERING

      if (waveNeedsReset) {
        assignEnter(currentTilePlaying || tile);
        assignLeave();

        waveNeedsReset = false;
      }

      waveTileElem.slice(0, currentTilePlaying || tile).forEach((tile) => {
        tile.style.backgroundColor = "var(--wave-tile-played)";
      });
    }
  }

  function assignLeave() {
    currentTilePlaying
      ? waveTileElem.forEach((childTile, index: number) => {
          childTile.style.backgroundColor =
            index >= currentTilePlaying!
              ? "var(--wave-tile)"
              : "var(--wave-tile-played)";
        })
      : waveTileElem.forEach(
          (tile) => (tile.style.backgroundColor = "var(--wave-tile)")
        );

    isHovering = false;
    tileHovering = null;
  }

  function defineMouseAction(tile: number) {
    if (!song.src || (audio && audio?.src === location.origin)) return;

    tempGlobalIndex = tile;
    document.addEventListener("mouseup", mouseReleaseClick);
    document.addEventListener("touchend", mouseReleaseClick);
    timerClick = setTimeout(mouseDrag, 300);
  }
</script>

<div class="mid">
  <div class="progress">
    {#if wave}
      {#key wave}
        <div class="top" id="sb_{song.UUID}">
          {#each wave as tile, tileIndex}
            <span
              role="button"
              tabindex="-1"
              on:mouseleave={assignLeave}
              on:mouseenter={() => assignEnter(tileIndex)}
              on:touchstart={() => {
                setTimeout(() => defineMouseAction(tileIndex), 10);
              }}
              on:mousedown={() => {
                defineMouseAction(tileIndex);
              }}
              style="
                width:{3 * size}px;
                max-width:{3 * size}px;"
            >
              <span
                class="blurtile"
                style="
                  width:{3 * size}px;
                  max-width:{3 * size}px;
                  height:calc(6px + {tile * 35}px);"
              />
              <span
                id="wave_{song.UUID}_{tileIndex}"
                class="tile"
                style="
                  background-color: var(--wave-tile);
                  width:{2 * size}px;
                  max-width:{2 * size}px;
                  height:calc(6px + {tile * 35}px)"
              />
            </span>
          {/each}
        </div>
        <div class="bottom">
          {#each wave as tile}
            <span
              style="
                width:{3 * size}px;
                max-width:{3 * size}px;"
            >
              <span
                class="blurtile"
                style="
                  width:{3 * size}px;
                  max-width:{3 * size}px;
                  height:calc(2px + {tile * 12}px)"
              />
              <span
                class="tile"
                style="
                  background-color: var(--wave-tile);
                  width:{2 * size}px;
                  max-width:{2 * size}px;
                  height:calc(2px + {tile * 12}px)"
              />
            </span>
          {/each}
        </div>
      {/key}
    {/if}
  </div>
</div>

<style>
  * {
    user-select: none;
  }

  .mid {
    z-index: 10000;
    padding: 0.5rem 0.2rem;
  }

  .progress {
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .progress > div {
    display: flex;
    height: max-content;
    max-height: max-content;
  }

  .progress > div > span {
    transition: 0.5s;
    display: inline-flex;
  }

  .top {
    height: max-content;
    max-height: max-content;
    margin-bottom: 2px;
  }

  .top > span {
    align-items: flex-end;
  }

  .bottom {
    height: max-content;
    max-height: max-content;
  }

  .bottom > span {
    opacity: 1;
    z-index: 10;
    align-items: flex-start;
    max-height: max-content;
    height: max-content;
  }

  .tile {
    transition: background-color 0.05s ease;
    z-index: 10;
    display: inline-flex;
    box-sizing: border-box;
    border-left: 1px solid transparent;

    position: relative;
  }

  .blurtile {
    z-index: -1;
    display: inline-flex;
    position: absolute;

    filter: blur(6px);

    background: var(--wave-background-bottom);
  }

  .bottom > span > .tile {
    opacity: 0.5;
    background-color: var(--wave-tile);
  }
</style>
