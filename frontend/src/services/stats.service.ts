//

import type { Song } from "src/types";
import { RequestService } from "./request.service";
import { AppState, Songs } from "../globals";
import { get } from "svelte/store";

class statsService {
  private static instance: statsService;

  static getInstance(): statsService {
    if (!statsService.instance) {
      statsService.instance = new statsService();
    }

    return statsService.instance;
  }

  /**
   * Assigns like or favorite state to a given song.
   */
  async assignLike(song: Song) {
    if (song.isCreating) return 0;

    setTimeout(() => {
      RequestService.get({ url: "api/stats/like/" + song.UUID });
    }, 10);

    const appState = get(AppState);
    const index = get(Songs).findIndex((s) => s.UUID === song.UUID);

    Songs.update((s) => {
      appState.client.likes.includes(song.UUID)
        ? s[index].likes--
        : s[index].likes++;
      return s;
    });

    if (appState.client.likes.includes(song.UUID)) {
      appState.client.likes = appState.client.likes.filter(
        (UUID) => UUID !== song.UUID
      );
    } else appState.client.likes.push(song.UUID);

    AppState.update((appState) => {
      appState.requireRefresh = true;
      return appState;
    });
  }

  /**
   * Assigns view or "played" state to a given song.
   */
  async assignView(song: Song) {
    if (song.isCreating) return 0;

    const appState = get(AppState);
    if (appState.client.views.includes(song.UUID)) return 0;

    setTimeout(() => {
      RequestService.get({ url: "api/stats/view/" + song.UUID });
    }, 10);

    const index = get(Songs).findIndex((s) => s.UUID === song.UUID);

    Songs.update((s) => {
      s[index].views++;
      return s;
    });

    appState.client.views.push(song.UUID);
  }
}

export const StatsService = statsService.getInstance();
