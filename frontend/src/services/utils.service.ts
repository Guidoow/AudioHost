import Dialog from "../components/Dialog.svelte";

import { AppState } from "../globals";
import type { Client, Song } from "../types";
import { RequestService } from ".";

class utilsService {
  private static instance: utilsService;

  // singleton
  static getInstance(): utilsService {
    if (!utilsService.instance) {
      utilsService.instance = new utilsService();
    }
    return utilsService.instance;
  }

  getInputFromMUITextField(element: HTMLElement): HTMLInputElement | null {
    return (
      (this.getParentInputFromMUITextField(element)
        ?.firstElementChild as HTMLInputElement) || null
    );
  }

  getParentInputFromMUITextField(
    element: HTMLElement
  ): HTMLInputElement | null {
    return (
      (element.shadowRoot?.firstElementChild?.firstElementChild
        ?.children[1] as HTMLInputElement) || null
    );
  }

  formatStats(stat: number) {
    const tempFormat = Number(stat).toLocaleString("de-DE");

    const tempSplitted = tempFormat.split(".");

    switch (tempSplitted.length) {
      case 2:
        let comma =
          tempSplitted.slice(-1)[0][0] !== "0"
            ? "." + tempSplitted.slice(-1)[0][0]
            : "";
        return tempSplitted.slice(0, -1).join("") + comma + "k";
      case 3:
        comma =
          tempSplitted.slice(-2, -1)[0][0] !== "0"
            ? "." + tempSplitted.slice(-2, -1)[0][0]
            : "";
        return tempSplitted.slice(0, -2).join("") + comma + "m";
      default:
        return tempSplitted.join("");
    }
  }

  getRandom() {
    return Number(Number(Math.random() * 2500 * Math.random()).toFixed());
  }

  /**
   * Displays a dialog in the top of the screen, with the given parameters.
   * @param { string } headline - for the title of the Dialog.
   * @param { string | HTMLElement } slot - for the body of the Dialog.
   */
  displayDialog(headline: string, slot: string | HTMLElement) {
    slot = typeof slot === "string" ? slot : slot.innerHTML;

    const dialog = new Dialog({
      target: document.body,
      props: { headline, slot },
    });

    return dialog;
  }

  filterRepeatedSongs(array: Song[]): Song[] {
    const seen = new Set();
    return array.filter((song: Song) => {
      const duplicate = seen.has(song.UUID);
      seen.add(song.UUID);
      return !duplicate;
    });
  }

  async getClient() {
    const response = await RequestService.get({ url: "api/stats" });
    AppState.update((app) => {
      app.client = response.data as Client;
      return app;
    });
  }
}

export const UtilsService = utilsService.getInstance();
