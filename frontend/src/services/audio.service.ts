import { get } from "svelte/store";

import { AppState } from "../globals";

import type { Song } from "../types";
import config from "../config";

class audioService {
  private static instance: audioService;

  static getInstance(): audioService {
    if (!audioService.instance) {
      audioService.instance = new audioService();
    }

    return audioService.instance;
  }

  public audio: HTMLAudioElement = document.createElement("audio");
  public song?: Song;
  public state = {
    hasTimer: false,
    waiting: false,
    canPlay: false,
    playerTimer: 0,
  };

  public pause() {
    if (!this.audio.paused && this.audio) this.audio.pause();
  }

  /**
   * Plays the audio managing posible errors.
   */
  public play() {
    if (this.audio.paused) {
      const hasValidSource =
        this.audio.src !== undefined && this.audio.src !== location.origin;
      if (hasValidSource)
        this.audio
          .play()
          .then((_) => {
            AppState.update((v) => {
              v.audio.running[this.song!.src].paused = false;
              return v;
            });
          })
          .catch((error) => {
            console.error(
              error.name === "NotAllowedError"
                ? "The browser blocked the audio play. \n\n To fix it, authorize the client by clicking anywhere in the document.\n"
                : "An unknown error happens while trying to reproduce the audio."
            );
          });
    }
  }

  /**
   * Recursively updates the current audio time being played.
   * @param { number } tile - tile position clicked used set the time by the audio duration.
   * @returns A promise that when solved returns the tile, indicating the song is correctly assigned.
   */
  public setTime(tile: number): Promise<number> {
    return new Promise((resolve) => {
      if (!this.audio.duration)
        setTimeout(() => resolve(this.setTime(tile)), 10);
      else {
        let tileLength =
          get(AppState).screenWidth < config.breakpoints.desk ? 100 : 220;

        let scale = (tile * this.audio.duration) / tileLength;
        this.audio.currentTime = scale;

        resolve(tile);
      }
    });
  }

  public getClearSource() {
    return this.audio.src.replace(location.origin + "/api/audio/", "");
  }

  public setAudioElement(uuid: string) {
    this.audio = document.getElementById("audio-" + uuid) as HTMLAudioElement;
  }

  /**
   * Main function to play the audio, given a `song`.
   * When a tile is supplied, initializes the audio in that tile.
   * @param { Song } song - song to be played.
   * @param { boolean } tile - optional tile from which to initialize the audio.
   */
  public async playNew(song: Song, tile: number | null = null) {
    if (!this.state.hasTimer && this.state.canPlay) {
      const currentSource = decodeURIComponent(this.getClearSource());
      const newSource = decodeURIComponent(song.src);

      this.setWaitingMode(song.src);

      const isSameSource = currentSource === newSource;
      const isSameUUID = this.song?.UUID === song.UUID;
      const isAudioRunning = this.audio && !this.audio.paused;

      const otherAudioRunning = !isSameSource && isAudioRunning;

      if (otherAudioRunning) this.audio.pause();

      this.setAudioElement(song.UUID);

      if (!isSameSource || !isSameUUID) this.song = song;

      if (tile === null) {
        const currentTile = get(AppState).audio.running[this.song?.src!]?.tile;
        tile = currentTile || 0;
      }

      this.setTime(tile);

      this.play();

      this.setWaitingMode(song.src, false);
    }

    if (!this.state.canPlay) {
      if (this.state.hasTimer) clearTimeout(this.state.playerTimer);

      this.state.hasTimer = true;

      this.state.playerTimer = setTimeout(async () => {
        this.state.hasTimer = false;
        this.state.canPlay = true;

        await this.playNew(song, tile);

        this.state.canPlay = false;
      }, 10);
    }
  }
  /**
   * Set the state of the audio between waiting or ready, given an audio `source` and a boolean `mode`.
   * @param { string } source - source of the audio to update the state.
   * @param { boolean } mode - a true boolean representing is waiting or false, is ready.
   */
  private setWaitingMode(source: string, mode: boolean = true) {
    AppState.update((state) => {
      state.audio.waiting[source] = mode;
      return state;
    });
  }
}

export const AudioService = audioService.getInstance();
